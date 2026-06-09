import { Platform } from 'react-native';
import { tokenStorage } from './tokenStorage';

const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';

export class ApiError extends Error {
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
let unauthorizedHandler: (() => void | Promise<void>) | null = null;

export function setUnauthorizedHandler(handler: (() => void | Promise<void>) | null) {
  unauthorizedHandler = handler;
}

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function handleUnauthorized() {
  await tokenStorage.clearTokens();
  await unauthorizedHandler?.();
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = await tokenStorage.getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return {} as T;
  }

  if (response.status === 401) {
    if (path.includes('/api/users/refresh')) {
      await handleUnauthorized();
      throw new ApiError('Session expired. Please log in again.', 401);
    }

    const refreshToken = await tokenStorage.getRefreshToken();
    if (refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshResponse = await fetch(`${BASE_URL}/api/users/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const result = refreshData.data;
            const newAccessToken = result?.accessToken;
            const newRefreshToken = result?.refreshToken || refreshToken;

            if (!newAccessToken) {
              throw new Error('No access token in refresh response');
            }

            await tokenStorage.saveTokens(newAccessToken, newRefreshToken);
            onRefreshed(newAccessToken);
            isRefreshing = false;
          } else {
            throw new Error('Refresh token request failed');
          }
        } catch {
          isRefreshing = false;
          refreshSubscribers = [];
          await handleUnauthorized();
          throw new ApiError('Session expired. Please log in again.', 401);
        }
      }

      return new Promise<T>((resolve, reject) => {
        subscribeTokenRefresh(async (newToken) => {
          try {
            const retryHeaders = {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            };
            const retryResponse = await fetch(url, { ...options, headers: retryHeaders });
            if (retryResponse.ok) {
              const contentType = retryResponse.headers.get('content-type');
              if (contentType && contentType.includes('application/json')) {
                resolve(await retryResponse.json());
              } else {
                resolve({} as T);
              }
            } else {
              let errMessage = 'Request failed after refresh';
              let errData: any = null;
              try {
                const errJson = await retryResponse.json();
                errMessage = errJson.message || errJson.error || errMessage;
                errData = errJson;
              } catch {}
              reject(new ApiError(errMessage, retryResponse.status, errData));
            }
          } catch (err) {
            reject(err);
          }
        });
      });
    }
  }

  let errorMessage = 'An error occurred';
  let errorData: any = null;
  try {
    const errorJson = await response.json();
    errorMessage = errorJson.message || errorJson.error || errorMessage;
    errorData = errorJson;
  } catch {
    try {
      errorMessage = await response.text();
    } catch {}
  }

  throw new ApiError(errorMessage, response.status, errorData);
}

export const api = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: 'GET' });
  },

  post<T>(path: string, body?: any, options?: RequestOptions): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(path: string, body?: any, options?: RequestOptions): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: 'DELETE' });
  },
};
