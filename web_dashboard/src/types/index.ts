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
}

export type CabinetStatus = 'ONLINE' | 'OFFLINE' | 'INACTIVE'

export interface Cabinet {
  id: string
  name: string
  locationId: string
  locationName: string
  status: CabinetStatus
  lastSeen?: string
  availableCompartments: number
  totalCompartments: number
  mcpDevices: number
  compartments?: Compartment[]
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
