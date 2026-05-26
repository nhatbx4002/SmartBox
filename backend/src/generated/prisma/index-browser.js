
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.AdminScalarFieldEnum = {
  id: 'id',
  email: 'email',
  passwordHash: 'passwordHash',
  name: 'name',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  phone: 'phone',
  passwordHash: 'passwordHash',
  name: 'name',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LocationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  address: 'address',
  latitude: 'latitude',
  longitude: 'longitude',
  googlePlaceId: 'googlePlaceId',
  mapImageUrl: 'mapImageUrl',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CabinetScalarFieldEnum = {
  id: 'id',
  locationId: 'locationId',
  name: 'name',
  status: 'status',
  lastHeartbeatAt: 'lastHeartbeatAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.McpDeviceScalarFieldEnum = {
  id: 'id',
  cabinetId: 'cabinetId',
  bus: 'bus',
  address: 'address',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CompartmentScalarFieldEnum = {
  id: 'id',
  cabinetId: 'cabinetId',
  name: 'name',
  size: 'size',
  mcp23017PinLock: 'mcp23017PinLock',
  mcp23017PinSensor: 'mcp23017PinSensor',
  lockMcpDeviceId: 'lockMcpDeviceId',
  sensorMcpDeviceId: 'sensorMcpDeviceId',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CompartmentStatusScalarFieldEnum = {
  id: 'id',
  compartmentId: 'compartmentId',
  lockStatus: 'lockStatus',
  doorStatus: 'doorStatus',
  lastUpdatedAt: 'lastUpdatedAt'
};

exports.Prisma.PricePlanScalarFieldEnum = {
  id: 'id',
  name: 'name',
  size: 'size',
  rentalType: 'rentalType',
  price: 'price',
  maxOpens: 'maxOpens',
  durationDays: 'durationDays',
  description: 'description',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RentalScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  compartmentId: 'compartmentId',
  pricePlanId: 'pricePlanId',
  code: 'code',
  codeHash: 'codeHash',
  qrToken: 'qrToken',
  openCount: 'openCount',
  maxOpens: 'maxOpens',
  expiresAt: 'expiresAt',
  paymentStatus: 'paymentStatus',
  paymentMethod: 'paymentMethod',
  paidAt: 'paidAt',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LockerLogScalarFieldEnum = {
  id: 'id',
  cabinetId: 'cabinetId',
  compartmentId: 'compartmentId',
  rentalId: 'rentalId',
  action: 'action',
  attemptCount: 'attemptCount',
  success: 'success',
  ipAddress: 'ipAddress',
  deviceInfo: 'deviceInfo',
  note: 'note',
  createdAt: 'createdAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  adminId: 'adminId',
  action: 'action',
  resource: 'resource',
  resourceId: 'resourceId',
  details: 'details',
  ipAddress: 'ipAddress',
  createdAt: 'createdAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  body: 'body',
  type: 'type',
  data: 'data',
  isRead: 'isRead',
  sentAt: 'sentAt',
  createdAt: 'createdAt'
};

exports.Prisma.UserSessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  socketId: 'socketId',
  deviceType: 'deviceType',
  deviceInfo: 'deviceInfo',
  connectedAt: 'connectedAt',
  disconnectedAt: 'disconnectedAt',
  isActive: 'isActive'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.AdminRole = exports.$Enums.AdminRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  CABINET_ADMIN: 'CABINET_ADMIN'
};

exports.UserStatus = exports.$Enums.UserStatus = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED'
};

exports.LocationStatus = exports.$Enums.LocationStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

exports.CabinetStatus = exports.$Enums.CabinetStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  OFFLINE: 'OFFLINE'
};

exports.CompartmentSize = exports.$Enums.CompartmentSize = {
  SMALL: 'SMALL',
  LARGE: 'LARGE'
};

exports.CompartmentAvailability = exports.$Enums.CompartmentAvailability = {
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  MAINTENANCE: 'MAINTENANCE',
  RESERVED: 'RESERVED'
};

exports.LockStatus = exports.$Enums.LockStatus = {
  UNKNOWN: 'UNKNOWN',
  LOCKED: 'LOCKED',
  UNLOCKED: 'UNLOCKED',
  FAULTY: 'FAULTY'
};

exports.DoorStatus = exports.$Enums.DoorStatus = {
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  UNKNOWN: 'UNKNOWN'
};

exports.RentalType = exports.$Enums.RentalType = {
  ONCE: 'ONCE',
  DAILY: 'DAILY',
  MONTHLY: 'MONTHLY'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
  FAILED: 'FAILED'
};

exports.PaymentMethod = exports.$Enums.PaymentMethod = {
  MOMO: 'MOMO',
  ZALOPAY: 'ZALOPAY',
  VIETQR: 'VIETQR',
  CASH: 'CASH',
  NONE: 'NONE'
};

exports.RentalStatus = exports.$Enums.RentalStatus = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED'
};

exports.LockerAction = exports.$Enums.LockerAction = {
  OPENED: 'OPENED',
  CLOSED: 'CLOSED',
  EXPIRED: 'EXPIRED',
  DENIED: 'DENIED',
  NO_SHOW: 'NO_SHOW',
  HEARTBEAT: 'HEARTBEAT',
  FAULTY: 'FAULTY'
};

exports.AuditAction = exports.$Enums.AuditAction = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  CREATE_LOCATION: 'CREATE_LOCATION',
  UPDATE_LOCATION: 'UPDATE_LOCATION',
  DELETE_LOCATION: 'DELETE_LOCATION',
  CREATE_CABINET: 'CREATE_CABINET',
  UPDATE_CABINET: 'UPDATE_CABINET',
  DELETE_CABINET: 'DELETE_CABINET',
  UNLOCK_COMPARTMENT: 'UNLOCK_COMPARTMENT',
  CANCEL_RENTAL: 'CANCEL_RENTAL'
};

exports.NotificationType = exports.$Enums.NotificationType = {
  RENTAL_EXPIRED: 'RENTAL_EXPIRED',
  CABINET_OFFLINE: 'CABINET_OFFLINE',
  RENTAL_STARTED: 'RENTAL_STARTED',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  RENTAL_EXPIRING_SOON: 'RENTAL_EXPIRING_SOON',
  SYSTEM: 'SYSTEM'
};

exports.DeviceType = exports.$Enums.DeviceType = {
  ANDROID: 'ANDROID',
  WEB: 'WEB',
  KIOSK: 'KIOSK'
};

exports.Prisma.ModelName = {
  Admin: 'Admin',
  User: 'User',
  Location: 'Location',
  Cabinet: 'Cabinet',
  McpDevice: 'McpDevice',
  Compartment: 'Compartment',
  CompartmentStatus: 'CompartmentStatus',
  PricePlan: 'PricePlan',
  Rental: 'Rental',
  LockerLog: 'LockerLog',
  AuditLog: 'AuditLog',
  Notification: 'Notification',
  UserSession: 'UserSession'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
