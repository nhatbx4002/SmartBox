import axios from 'axios'
import { useAuthStore } from '@/store'
import type {
  Admin,
  AuditLog,
  Cabinet,
  CabinetStatus,
  Compartment,
  DashboardStats,
  Location,
  Notification,
  NotificationType,
  PaymentStatus,
  Rental,
  RentalEvent,
} from '@/types'

interface ApiEnvelope<T> {
  data: T
}

type BackendCabinetStatus = 'ACTIVE' | 'INACTIVE' | 'OFFLINE'
type BackendPaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED'

interface BackendCompartment {
  id: string
  name: string
  size: Compartment['size']
  status: Compartment['status']
  cabinetId: string
  realtimeStatus?: {
    lockStatus?: Compartment['lockStatus'] | 'UNKNOWN' | 'FAULTY'
    doorStatus?: Compartment['doorStatus'] | 'UNKNOWN'
  } | null
}

interface BackendCabinet {
  id: string
  name: string
  locationId: string
  status: BackendCabinetStatus
  lastHeartbeatAt?: string | null
  location?: { name?: string } | null
  mcpDevices?: unknown[]
  compartments?: BackendCompartment[]
}

interface BackendLocation {
  id: string
  name: string
  address: string
  latitude?: number | null
  longitude?: number | null
  googlePlaceId?: string | null
  status: Location['status']
  _count?: { cabinets?: number }
}

interface BackendNotification {
  id: string
  type: NotificationType | 'RENTAL_STARTED' | 'RENTAL_EXPIRING_SOON'
  title: string
  body: string
  isRead: boolean
  createdAt: string
  data?: {
    rentalId?: string
    cabinetId?: string
  } | null
}

interface BackendRental {
  id: string
  code: string
  compartmentId: string
  pricePlanId: string
  paymentStatus: BackendPaymentStatus
  paymentMethod?: string
  status: Rental['status']
  createdAt: string
  expiresAt: string
  user?: { phone?: string | null } | null
  compartment?: {
    id: string
    name: string
    cabinetId: string
    cabinet?: { id: string; name: string } | null
  } | null
  pricePlan?: { id: string; name: string; price: number } | null
  logs?: BackendLockerLog[]
}

interface BackendLockerLog {
  id: string
  rentalId?: string | null
  action: string
  note?: string | null
  ipAddress?: string | null
  success: boolean
  createdAt: string
}

interface BackendAuditLog {
  id: string
  adminId: string
  action: AuditLog['action']
  resource: string
  resourceId?: string | null
  ipAddress?: string | null
  createdAt: string
  admin?: { name?: string; email?: string } | null
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(err)
  },
)

export default api

async function unwrap<T>(request: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  const response = await request
  return response.data.data
}

function mapCabinetStatus(status: BackendCabinetStatus): CabinetStatus {
  if (status === 'ACTIVE') return 'ONLINE'
  return status
}

function mapPaymentStatus(status: BackendPaymentStatus): PaymentStatus {
  if (status === 'PENDING' || status === 'FAILED') return 'UNPAID'
  return status
}

function mapNotificationType(type: BackendNotification['type']): NotificationType {
  if (type === 'RENTAL_STARTED' || type === 'RENTAL_EXPIRING_SOON') return 'SYSTEM'
  return type
}

function mapCompartment(compartment: BackendCompartment, cabinetName: string): Compartment {
  const lockStatus = compartment.realtimeStatus?.lockStatus
  const doorStatus = compartment.realtimeStatus?.doorStatus
  return {
    id: compartment.id,
    name: compartment.name,
    size: compartment.size,
    status: compartment.status,
    cabinetId: compartment.cabinetId,
    cabinetName,
    lockStatus: lockStatus === 'LOCKED' || lockStatus === 'UNLOCKED' ? lockStatus : undefined,
    doorStatus: doorStatus === 'OPEN' || doorStatus === 'CLOSED' ? doorStatus : undefined,
  }
}

function mapCabinet(cabinet: BackendCabinet): Cabinet {
  const compartments = cabinet.compartments ?? []
  return {
    id: cabinet.id,
    name: cabinet.name,
    locationId: cabinet.locationId,
    locationName: cabinet.location?.name ?? cabinet.locationId,
    status: mapCabinetStatus(cabinet.status),
    lastSeen: cabinet.lastHeartbeatAt ?? undefined,
    availableCompartments: compartments.filter((compartment) => compartment.status === 'AVAILABLE').length,
    totalCompartments: compartments.length,
    mcpDevices: cabinet.mcpDevices?.length ?? 0,
    compartments: compartments.map((compartment) => mapCompartment(compartment, cabinet.name)),
  }
}

function mapLocation(location: BackendLocation): Location {
  return {
    id: location.id,
    name: location.name,
    address: location.address,
    lat: location.latitude ?? undefined,
    lng: location.longitude ?? undefined,
    googlePlaceId: location.googlePlaceId ?? undefined,
    status: location.status,
    cabinetCount: location._count?.cabinets ?? 0,
  }
}

function mapNotification(notification: BackendNotification): Notification {
  return {
    id: notification.id,
    type: mapNotificationType(notification.type),
    title: notification.title,
    body: notification.body,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
    relatedRentalId: notification.data?.rentalId,
    relatedCabinetId: notification.data?.cabinetId,
  }
}

function mapRental(rental: BackendRental): Rental {
  return {
    id: rental.id,
    code: rental.code,
    customerPhone: rental.user?.phone ?? '',
    compartmentId: rental.compartmentId,
    compartmentName: rental.compartment?.name ?? rental.compartmentId,
    cabinetId: rental.compartment?.cabinetId ?? '',
    cabinetName: rental.compartment?.cabinet?.name ?? '',
    planId: rental.pricePlanId,
    planName: rental.pricePlan?.name ?? rental.pricePlanId,
    status: rental.status,
    paymentStatus: mapPaymentStatus(rental.paymentStatus),
    paymentMethod: rental.paymentMethod,
    price: rental.pricePlan?.price ?? 0,
    startedAt: rental.createdAt,
    expiresAt: rental.expiresAt,
  }
}

function mapRentalEvent(log: BackendLockerLog): RentalEvent {
  return {
    id: log.id,
    rentalId: log.rentalId ?? '',
    type: log.action,
    description: log.note || log.action,
    timestamp: log.createdAt,
    ipAddress: log.ipAddress ?? undefined,
    success: log.success,
  }
}

function mapAuditLog(log: BackendAuditLog): AuditLog {
  return {
    id: log.id,
    timestamp: log.createdAt,
    adminId: log.adminId,
    adminName: log.admin?.name ?? log.admin?.email ?? log.adminId,
    action: log.action,
    target: [log.resource, log.resourceId].filter(Boolean).join(' #'),
    ipAddress: log.ipAddress ?? '',
    success: true,
  }
}

function mapLocationInput(data: unknown) {
  if (!data || typeof data !== 'object') return data
  const input = data as Record<string, unknown>
  const { lat, lng, ...rest } = input
  return {
    ...rest,
    ...(lat === undefined ? {} : { latitude: lat }),
    ...(lng === undefined ? {} : { longitude: lng }),
  }
}

export const cabinetsApi = {
  list: (params?: { locationId?: string; status?: string }) =>
    unwrap<BackendCabinet[]>(api.get('/admin/cabinets', { params })).then((items) => items.map(mapCabinet)),
  get: (id: string) =>
    unwrap<BackendCabinet>(api.get(`/admin/cabinets/${id}`)).then(mapCabinet),
  create: (data: unknown) =>
    unwrap<BackendCabinet>(api.post('/admin/cabinets', data)).then(mapCabinet),
  update: (id: string, data: unknown) =>
    unwrap<BackendCabinet>(api.put(`/admin/cabinets/${id}`, data)).then(mapCabinet),
  delete: (id: string) => unwrap<{ ok: boolean }>(api.delete(`/admin/cabinets/${id}`)),
  openCompartment: (cabinetId: string, compId: string) =>
    unwrap<{ ok: boolean }>(api.post(`/admin/cabinets/${cabinetId}/unlock/${compId}`)),
}

export const rentalsApi = {
  list: (params?: {
    status?: string
    locationId?: string
    startDate?: string
    endDate?: string
    page?: number
  }) => unwrap<BackendRental[]>(api.get('/admin/rentals', { params })).then((items) => items.map(mapRental)),
  get: (id: string) =>
    unwrap<BackendRental>(api.get(`/admin/rentals/${id}`)).then(mapRental),
  getDetail: (id: string) =>
    unwrap<BackendRental>(api.get(`/admin/rentals/${id}`)).then((rental) => ({
      rental: mapRental(rental),
      events: (rental.logs ?? []).map(mapRentalEvent),
    })),
  cancel: (id: string) => unwrap<{ ok: boolean }>(api.put(`/admin/rentals/${id}/cancel`)),
  unlock: (id: string) => unwrap<BackendRental | undefined>(api.post(`/rentals/${id}/unlock`)),
}

export const locationsApi = {
  list: (params?: { status?: string }) =>
    unwrap<BackendLocation[]>(api.get('/admin/locations', { params })).then((items) => items.map(mapLocation)),
  publicList: () =>
    unwrap<BackendLocation[]>(api.get('/public/locations')).then((items) => items.map(mapLocation)),
  get: (id: string) =>
    unwrap<BackendLocation>(api.get(`/public/locations/${id}`)).then(mapLocation),
  create: (data: unknown) =>
    unwrap<BackendLocation>(api.post('/admin/locations', mapLocationInput(data))).then(mapLocation),
  update: (id: string, data: unknown) =>
    unwrap<BackendLocation>(api.put(`/admin/locations/${id}`, mapLocationInput(data))).then(mapLocation),
  delete: (id: string) => unwrap<{ ok: boolean }>(api.delete(`/admin/locations/${id}`)),
}

export const notificationsApi = {
  list: (params?: { isRead?: boolean }) =>
    unwrap<BackendNotification[]>(api.get('/notifications', { params })).then((items) => items.map(mapNotification)),
  markRead: (id: string) =>
    unwrap<BackendNotification>(api.put(`/notifications/${id}/read`)).then(mapNotification),
  markAllRead: () => unwrap<{ ok: boolean; count: number }>(api.put('/notifications/read-all')),
}

export const dashboardApi = {
  stats: () => unwrap<DashboardStats>(api.get('/dashboard/stats')),
}

export const authApi = {
  login: (email: string, password: string) =>
    unwrap<{ admin: Admin; accessToken: string; refreshToken: string }>(
      api.post('/auth/admin/login', { email, password }),
    ),
}

export const auditApi = {
  list: (params?: {
    adminId?: string
    action?: string
    resource?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }) =>
    unwrap<{ items: BackendAuditLog[]; page: number; limit: number; total: number }>(
      api.get('/audit-logs', { params }),
    ).then((result) => ({
      ...result,
      items: result.items.map(mapAuditLog),
    })),
}
