export type AdminRole = 'SUPER_ADMIN' | 'CABINET_ADMIN'

export interface Admin {
  id: string
  name: string
  email: string
  role: AdminRole
  avatarUrl?: string
  cabinetIds?: string[]
  assignedCabinets?: { id: string; name: string }[]
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
  | 'CONFIGURING'

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
  hardwareSerial?: string | null
  notes?: string | null
  compartments?: Compartment[]
  createdAt?: string
}

export type RentalStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'

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
  status: 'ACTIVE' | 'INACTIVE'
  cabinetCount: number
}

export type NotificationType = 'RENTAL_EXPIRED' | 'CABINET_OFFLINE' | 'RENTAL_STARTED' | 'PAYMENT_SUCCESS' | 'HARDWARE_FAULT'

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
  | 'CREATE_PRICE_PLAN'
  | 'UPDATE_PRICE_PLAN'
  | 'DELETE_PRICE_PLAN'
  | 'CREATE_LOCATION'
  | 'UPDATE_LOCATION'
  | 'DELETE_LOCATION'
  | 'CREATE_CABINET'
  | 'UPDATE_CABINET'
  | 'DELETE_CABINET'
  | 'CANCEL_RENTAL'
  | 'CREATE_ADMIN'
  | 'UPDATE_ADMIN'
  | 'DELETE_ADMIN'
  | 'ASSIGN_ADMIN_CABINET'
  | 'UNASSIGN_ADMIN_CABINET'
  | 'CANCEL_PAIRING'
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

export type PairingSessionStatus = 'PENDING' | 'APPROVED' | 'EXPIRED' | 'REJECTED'

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

export type RentalType = 'ONCE' | 'DAILY' | 'MONTHLY'

export interface PricePlan {
  id: string
  name: string
  size: CompartmentSize
  rentalType: RentalType
  price: number
  maxOpens?: number | null
  durationDays: number
  description?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
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
