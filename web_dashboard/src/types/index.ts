export type AdminRole = 'SUPER_ADMIN' | 'CABINET_ADMIN'

export interface Admin {
  id: string
  name: string
  email: string
  role: AdminRole
  avatarUrl?: string
}

export type CompartmentStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED'

export type CompartmentSize = 'SMALL' | 'LARGE'

export interface Compartment {
  id: string
  name: string
  size: CompartmentSize
  status: CompartmentStatus
  cabinetId: string
  cabinetName: string
  currentRentalId?: string
  customerPhone?: string
  expiresAt?: string
  lockStatus?: 'LOCKED' | 'UNLOCKED'
  doorStatus?: 'OPEN' | 'CLOSED'
  // Full detail fields (from cabinet detail API)
  mcp23017PinLock?: number
  mcp23017PinSensor?: number
  lockMcpDeviceId?: string
  sensorMcpDeviceId?: string
  lockMcpDevice?: McpDevice
  sensorMcpDevice?: McpDevice
  realtimeStatus?: { lockStatus: string; doorStatus: string }
}

export interface McpDevice {
  id: string
  bus: number
  address: number
  name?: string
  role?: string
}

export type CabinetStatus =
  | 'ACTIVE' | 'ONLINE'
  | 'OFFLINE'
  | 'INACTIVE'
  | 'PENDING_REGISTRATION'
  | 'PENDING_PROVISION'
  | 'PROVISION_FAILED'
  | 'DRAFT'
  | 'CONFIGURING'

export type ProvisionMode = 'CHECK_EXISTING' | 'ALLOW_NEW'

export interface ProvisionMcpDevice {
  id: string
  bus: number
  address: number
  role: 'SENSOR' | 'LOCK'
  name?: string
}

export interface ProvisionProfile {
  id: string
  name: string
  provisionKey: string
  provisionSecret?: string | null
  mode: ProvisionMode
  isActive: boolean
  templateRows: number
  templateCols: number
  templateSizes: CompartmentSize[][]
  mcpDevices: ProvisionMcpDevice[]
  cabinetCount: number
  createdAt: string
  updatedAt: string
}

export interface ProvisioningConfig {
  id?: string
  strategy: string
  provisionKey: string
  provisionSecret?: string | null
  webhookUrl?: string | null
  isActive: boolean
  updatedAt?: string
}

export interface Cabinet {
  id: string
  name: string
  locationId: string
  locationName: string
  status: CabinetStatus
  lastSeen?: string
  availableCompartments: number
  totalCompartments: number
  mcpDevices: number | McpDevice[]
  provisionCode?: string | null
  provisionCodeExpires?: string | null
  configVersion?: number
  hardwareSerial?: string | null
  notes?: string | null
  profile?: { id: string; name: string } | null
  compartments?: Compartment[]
  createdAt?: string
}

export type RentalStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'

export type PaymentStatus = 'PAID' | 'UNPAID' | 'REFUNDED'

export interface Rental {
  id: string
  code: string
  customerPhone: string
  compartmentId: string
  compartmentName: string
  cabinetId: string
  cabinetName: string
  planId: string
  planName: string
  status: RentalStatus
  paymentStatus: PaymentStatus
  paymentMethod?: string
  price: number
  startedAt: string
  expiresAt: string
  completedAt?: string
}

export interface RentalEvent {
  id: string
  rentalId: string
  type: string
  description: string
  timestamp: string
  ipAddress?: string
  success: boolean
}

export interface Location {
  id: string
  name: string
  address: string
  lat?: number
  lng?: number
  googlePlaceId?: string
  status: 'ACTIVE' | 'INACTIVE'
  cabinetCount: number
}

export type NotificationType = 'RENTAL_EXPIRED' | 'PAYMENT_SUCCESS' | 'CABINET_OFFLINE' | 'SYSTEM'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  isRead: boolean
  createdAt: string
  relatedRentalId?: string
  relatedCabinetId?: string
}

export type AuditAction =
  | 'UNLOCK_COMPARTMENT'
  | 'UPDATE_PRICE_PLAN'
  | 'CREATE_LOCATION'
  | 'UPDATE_LOCATION'
  | 'DELETE_LOCATION'
  | 'CREATE_CABINET'
  | 'UPDATE_CABINET'
  | 'DELETE_CABINET'
  | 'CANCEL_RENTAL'
  | 'LOGIN'
  | 'LOGOUT'

export interface AuditLog {
  id: string
  timestamp: string
  adminId: string
  adminName: string
  action: AuditAction
  target: string
  ipAddress: string
  success: boolean
}

export type PairingSessionStatus = 'PENDING' | 'APPROVED' | 'EXPIRED' | 'CANCELLED'

export interface DiscoveredMcpDevice {
  bus: number
  address: number
}

export interface PairingSession {
  id: string
  hardwareSerial: string
  discoveredMcpDevices: DiscoveredMcpDevice[]
  pairingCode: string
  status: PairingSessionStatus
  cabinetId?: string
  expiresAt: string
  createdAt: string
}

export interface PairingStartResponse {
  sessionId: string
  pairingCode: string
  expiresInSeconds: number
}

export interface DashboardStats {
  totalCabinets: number
  onlineCabinets: number
  totalCompartments: number
  availableCompartments: number
  activeRentals: number
  todayRevenue: number
  occupancyRate: number
  revenueByDay: { date: string; revenue: number }[]
  rentalsByStatus: { status: string; count: number }[]
}
