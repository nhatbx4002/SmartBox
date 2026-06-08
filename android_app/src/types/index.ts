export type ISODateString = string;

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = {
  [key: string]: JsonValue;
};

export type UserStatus = "ACTIVE" | "SUSPENDED";
export type LocationStatus = "ACTIVE" | "INACTIVE";
export type CabinetStatus = "ACTIVE" | "INACTIVE" | "OFFLINE";
export type CompartmentSize = "SMALL" | "LARGE";
export type CompartmentAvailability =
  | "AVAILABLE"
  | "OCCUPIED"
  | "MAINTENANCE"
  | "RESERVED";
export type LockStatus = "UNKNOWN" | "LOCKED" | "UNLOCKED" | "FAULTY";
export type DoorStatus = "CLOSED" | "OPEN" | "UNKNOWN";
export type RentalType = "ONCE" | "DAILY" | "MONTHLY";
export type RentalStatus = "ACTIVE" | "COMPLETED" | "CANCELLED" | "EXPIRED";
export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED" | "FAILED";
export type PaymentMethod = "MOMO" | "ZALOPAY" | "VIETQR" | "CASH" | "NONE";
export type LockerAction =
  | "OPENED"
  | "CLOSED"
  | "EXPIRED"
  | "DENIED"
  | "NO_SHOW"
  | "HEARTBEAT"
  | "FAULTY";
export type NotificationType =
  | "RENTAL_EXPIRED"
  | "CABINET_OFFLINE"
  | "RENTAL_STARTED"
  | "PAYMENT_SUCCESS"
  | "RENTAL_EXPIRING_SOON"
  | "SYSTEM";
export type DeviceType = "ANDROID" | "WEB" | "KIOSK";

export interface ApiErrorPayload {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  pagination: PaginationMeta;
}

export interface User {
  id: string;
  phone: string;
  email: string | null;
  name: string | null;
  status: UserStatus;
}

export interface UserSession {
  id: string;
  userId: string;
  socketId: string;
  deviceType: DeviceType;
  deviceInfo: string | null;
  connectedAt: ISODateString;
  disconnectedAt: ISODateString | null;
  isActive: boolean;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  googlePlaceId: string | null;
  mapImageUrl: string | null;
  status: LocationStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Cabinet {
  id: string;
  locationId: string;
  name: string;
  status: CabinetStatus;
  lastHeartbeatAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CompartmentRealtimeStatus {
  id: string;
  compartmentId: string;
  lockStatus: LockStatus;
  doorStatus: DoorStatus;
  lastUpdatedAt: ISODateString;
}

export interface Compartment {
  id: string;
  cabinetId: string;
  name: string;
  size: CompartmentSize;
  mcp23017PinLock: number;
  mcp23017PinSensor: number;
  lockMcpDeviceId: string | null;
  sensorMcpDeviceId: string | null;
  status: CompartmentAvailability;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface PricePlan {
  id: string;
  name: string;
  size: CompartmentSize;
  rentalType: RentalType;
  price: number;
  maxOpens: number | null;
  durationDays: number;
  description: string | null;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface LockerLog {
  id: string;
  cabinetId: string | null;
  compartmentId: string | null;
  rentalId: string | null;
  action: LockerAction;
  attemptCount: number;
  success: boolean;
  ipAddress: string | null;
  deviceInfo: string | null;
  note: string | null;
  createdAt: ISODateString;
}

export interface Notification {
  id: string;
  userId: string | null;
  title: string;
  body: string;
  type: NotificationType;
  data: JsonValue | null;
  isRead: boolean;
  sentAt: ISODateString;
  createdAt: ISODateString;
}

export interface CabinetWithCompartments extends Cabinet {
  compartments: Array<Compartment & { realtimeStatus?: CompartmentRealtimeStatus | null }>;
}

export interface LocationDetail extends Location {
  cabinets?: CabinetWithCompartments[];
}

export interface CompartmentWithCabinet extends Compartment {
  cabinet: Cabinet;
  realtimeStatus?: CompartmentRealtimeStatus | null;
}

export interface Rental {
  id: string;
  userId: string | null;
  compartmentId: string;
  pricePlanId: string;
  code: string;
  qrToken: string;
  openCount: number;
  maxOpens: number;
  expiresAt: ISODateString;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paidAt: ISODateString | null;
  status: RentalStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface RentalWithRelations extends Rental {
  compartment: CompartmentWithCabinet;
  pricePlan: PricePlan;
  user?: User | null;
  logs?: LockerLog[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult extends AuthTokens {
  user: User;
}

export interface RefreshTokenResult {
  accessToken: string;
}

export interface VerifyOtpResult {
  resetToken: string;
}

export interface CreateRentalResult {
  rental: RentalWithRelations;
  code: string;
  compartment: CompartmentWithCabinet;
}

export interface OkResult {
  ok: true;
}

export interface MarkAllReadResult extends OkResult {
  count: number;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  phone: string;
  password: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
}

export interface RegisterDevicePayload {
  fcmToken: string;
}

export interface CreateRentalPayload {
  size: CompartmentSize;
  planId: string;
  paymentMethod?: PaymentMethod;
  cabinetId?: string;
}

export interface ForgotPasswordPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  code: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}
