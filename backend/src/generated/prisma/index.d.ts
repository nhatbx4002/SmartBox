
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Admin
 * 
 */
export type Admin = $Result.DefaultSelection<Prisma.$AdminPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Location
 * 
 */
export type Location = $Result.DefaultSelection<Prisma.$LocationPayload>
/**
 * Model Cabinet
 * 
 */
export type Cabinet = $Result.DefaultSelection<Prisma.$CabinetPayload>
/**
 * Model McpDevice
 * 
 */
export type McpDevice = $Result.DefaultSelection<Prisma.$McpDevicePayload>
/**
 * Model Compartment
 * 
 */
export type Compartment = $Result.DefaultSelection<Prisma.$CompartmentPayload>
/**
 * Model CompartmentStatus
 * 
 */
export type CompartmentStatus = $Result.DefaultSelection<Prisma.$CompartmentStatusPayload>
/**
 * Model PricePlan
 * 
 */
export type PricePlan = $Result.DefaultSelection<Prisma.$PricePlanPayload>
/**
 * Model Rental
 * 
 */
export type Rental = $Result.DefaultSelection<Prisma.$RentalPayload>
/**
 * Model LockerLog
 * 
 */
export type LockerLog = $Result.DefaultSelection<Prisma.$LockerLogPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model UserSession
 * 
 */
export type UserSession = $Result.DefaultSelection<Prisma.$UserSessionPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const AdminRole: {
  SUPER_ADMIN: 'SUPER_ADMIN',
  CABINET_ADMIN: 'CABINET_ADMIN'
};

export type AdminRole = (typeof AdminRole)[keyof typeof AdminRole]


export const UserStatus: {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED'
};

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]


export const LocationStatus: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

export type LocationStatus = (typeof LocationStatus)[keyof typeof LocationStatus]


export const CabinetStatus: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  OFFLINE: 'OFFLINE'
};

export type CabinetStatus = (typeof CabinetStatus)[keyof typeof CabinetStatus]


export const CompartmentSize: {
  SMALL: 'SMALL',
  LARGE: 'LARGE'
};

export type CompartmentSize = (typeof CompartmentSize)[keyof typeof CompartmentSize]


export const CompartmentAvailability: {
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  MAINTENANCE: 'MAINTENANCE',
  RESERVED: 'RESERVED'
};

export type CompartmentAvailability = (typeof CompartmentAvailability)[keyof typeof CompartmentAvailability]


export const LockStatus: {
  UNKNOWN: 'UNKNOWN',
  LOCKED: 'LOCKED',
  UNLOCKED: 'UNLOCKED',
  FAULTY: 'FAULTY'
};

export type LockStatus = (typeof LockStatus)[keyof typeof LockStatus]


export const DoorStatus: {
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  UNKNOWN: 'UNKNOWN'
};

export type DoorStatus = (typeof DoorStatus)[keyof typeof DoorStatus]


export const RentalType: {
  ONCE: 'ONCE',
  DAILY: 'DAILY',
  MONTHLY: 'MONTHLY'
};

export type RentalType = (typeof RentalType)[keyof typeof RentalType]


export const PaymentStatus: {
  PENDING: 'PENDING',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
  FAILED: 'FAILED'
};

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]


export const PaymentMethod: {
  MOMO: 'MOMO',
  ZALOPAY: 'ZALOPAY',
  VIETQR: 'VIETQR',
  CASH: 'CASH',
  NONE: 'NONE'
};

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]


export const RentalStatus: {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED'
};

export type RentalStatus = (typeof RentalStatus)[keyof typeof RentalStatus]


export const LockerAction: {
  OPENED: 'OPENED',
  CLOSED: 'CLOSED',
  EXPIRED: 'EXPIRED',
  DENIED: 'DENIED',
  NO_SHOW: 'NO_SHOW',
  HEARTBEAT: 'HEARTBEAT',
  FAULTY: 'FAULTY'
};

export type LockerAction = (typeof LockerAction)[keyof typeof LockerAction]


export const NotificationType: {
  RENTAL_EXPIRED: 'RENTAL_EXPIRED',
  CABINET_OFFLINE: 'CABINET_OFFLINE',
  RENTAL_STARTED: 'RENTAL_STARTED',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  RENTAL_EXPIRING_SOON: 'RENTAL_EXPIRING_SOON',
  SYSTEM: 'SYSTEM'
};

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]


export const DeviceType: {
  ANDROID: 'ANDROID',
  WEB: 'WEB',
  KIOSK: 'KIOSK'
};

export type DeviceType = (typeof DeviceType)[keyof typeof DeviceType]

}

export type AdminRole = $Enums.AdminRole

export const AdminRole: typeof $Enums.AdminRole

export type UserStatus = $Enums.UserStatus

export const UserStatus: typeof $Enums.UserStatus

export type LocationStatus = $Enums.LocationStatus

export const LocationStatus: typeof $Enums.LocationStatus

export type CabinetStatus = $Enums.CabinetStatus

export const CabinetStatus: typeof $Enums.CabinetStatus

export type CompartmentSize = $Enums.CompartmentSize

export const CompartmentSize: typeof $Enums.CompartmentSize

export type CompartmentAvailability = $Enums.CompartmentAvailability

export const CompartmentAvailability: typeof $Enums.CompartmentAvailability

export type LockStatus = $Enums.LockStatus

export const LockStatus: typeof $Enums.LockStatus

export type DoorStatus = $Enums.DoorStatus

export const DoorStatus: typeof $Enums.DoorStatus

export type RentalType = $Enums.RentalType

export const RentalType: typeof $Enums.RentalType

export type PaymentStatus = $Enums.PaymentStatus

export const PaymentStatus: typeof $Enums.PaymentStatus

export type PaymentMethod = $Enums.PaymentMethod

export const PaymentMethod: typeof $Enums.PaymentMethod

export type RentalStatus = $Enums.RentalStatus

export const RentalStatus: typeof $Enums.RentalStatus

export type LockerAction = $Enums.LockerAction

export const LockerAction: typeof $Enums.LockerAction

export type NotificationType = $Enums.NotificationType

export const NotificationType: typeof $Enums.NotificationType

export type DeviceType = $Enums.DeviceType

export const DeviceType: typeof $Enums.DeviceType

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Admins
 * const admins = await prisma.admin.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Admins
   * const admins = await prisma.admin.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.admin`: Exposes CRUD operations for the **Admin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Admins
    * const admins = await prisma.admin.findMany()
    * ```
    */
  get admin(): Prisma.AdminDelegate<ExtArgs>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.location`: Exposes CRUD operations for the **Location** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Locations
    * const locations = await prisma.location.findMany()
    * ```
    */
  get location(): Prisma.LocationDelegate<ExtArgs>;

  /**
   * `prisma.cabinet`: Exposes CRUD operations for the **Cabinet** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Cabinets
    * const cabinets = await prisma.cabinet.findMany()
    * ```
    */
  get cabinet(): Prisma.CabinetDelegate<ExtArgs>;

  /**
   * `prisma.mcpDevice`: Exposes CRUD operations for the **McpDevice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more McpDevices
    * const mcpDevices = await prisma.mcpDevice.findMany()
    * ```
    */
  get mcpDevice(): Prisma.McpDeviceDelegate<ExtArgs>;

  /**
   * `prisma.compartment`: Exposes CRUD operations for the **Compartment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Compartments
    * const compartments = await prisma.compartment.findMany()
    * ```
    */
  get compartment(): Prisma.CompartmentDelegate<ExtArgs>;

  /**
   * `prisma.compartmentStatus`: Exposes CRUD operations for the **CompartmentStatus** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CompartmentStatuses
    * const compartmentStatuses = await prisma.compartmentStatus.findMany()
    * ```
    */
  get compartmentStatus(): Prisma.CompartmentStatusDelegate<ExtArgs>;

  /**
   * `prisma.pricePlan`: Exposes CRUD operations for the **PricePlan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PricePlans
    * const pricePlans = await prisma.pricePlan.findMany()
    * ```
    */
  get pricePlan(): Prisma.PricePlanDelegate<ExtArgs>;

  /**
   * `prisma.rental`: Exposes CRUD operations for the **Rental** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Rentals
    * const rentals = await prisma.rental.findMany()
    * ```
    */
  get rental(): Prisma.RentalDelegate<ExtArgs>;

  /**
   * `prisma.lockerLog`: Exposes CRUD operations for the **LockerLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LockerLogs
    * const lockerLogs = await prisma.lockerLog.findMany()
    * ```
    */
  get lockerLog(): Prisma.LockerLogDelegate<ExtArgs>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs>;

  /**
   * `prisma.userSession`: Exposes CRUD operations for the **UserSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserSessions
    * const userSessions = await prisma.userSession.findMany()
    * ```
    */
  get userSession(): Prisma.UserSessionDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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
    Notification: 'Notification',
    UserSession: 'UserSession'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "admin" | "user" | "location" | "cabinet" | "mcpDevice" | "compartment" | "compartmentStatus" | "pricePlan" | "rental" | "lockerLog" | "notification" | "userSession"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Admin: {
        payload: Prisma.$AdminPayload<ExtArgs>
        fields: Prisma.AdminFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findFirst: {
            args: Prisma.AdminFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findMany: {
            args: Prisma.AdminFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          create: {
            args: Prisma.AdminCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          createMany: {
            args: Prisma.AdminCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          delete: {
            args: Prisma.AdminDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          update: {
            args: Prisma.AdminUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          deleteMany: {
            args: Prisma.AdminDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AdminUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          aggregate: {
            args: Prisma.AdminAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdmin>
          }
          groupBy: {
            args: Prisma.AdminGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminCountArgs<ExtArgs>
            result: $Utils.Optional<AdminCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Location: {
        payload: Prisma.$LocationPayload<ExtArgs>
        fields: Prisma.LocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          findFirst: {
            args: Prisma.LocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          findMany: {
            args: Prisma.LocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>[]
          }
          create: {
            args: Prisma.LocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          createMany: {
            args: Prisma.LocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>[]
          }
          delete: {
            args: Prisma.LocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          update: {
            args: Prisma.LocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          deleteMany: {
            args: Prisma.LocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          aggregate: {
            args: Prisma.LocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocation>
          }
          groupBy: {
            args: Prisma.LocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocationCountArgs<ExtArgs>
            result: $Utils.Optional<LocationCountAggregateOutputType> | number
          }
        }
      }
      Cabinet: {
        payload: Prisma.$CabinetPayload<ExtArgs>
        fields: Prisma.CabinetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CabinetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CabinetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CabinetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CabinetPayload>
          }
          findFirst: {
            args: Prisma.CabinetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CabinetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CabinetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CabinetPayload>
          }
          findMany: {
            args: Prisma.CabinetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CabinetPayload>[]
          }
          create: {
            args: Prisma.CabinetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CabinetPayload>
          }
          createMany: {
            args: Prisma.CabinetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CabinetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CabinetPayload>[]
          }
          delete: {
            args: Prisma.CabinetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CabinetPayload>
          }
          update: {
            args: Prisma.CabinetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CabinetPayload>
          }
          deleteMany: {
            args: Prisma.CabinetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CabinetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CabinetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CabinetPayload>
          }
          aggregate: {
            args: Prisma.CabinetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCabinet>
          }
          groupBy: {
            args: Prisma.CabinetGroupByArgs<ExtArgs>
            result: $Utils.Optional<CabinetGroupByOutputType>[]
          }
          count: {
            args: Prisma.CabinetCountArgs<ExtArgs>
            result: $Utils.Optional<CabinetCountAggregateOutputType> | number
          }
        }
      }
      McpDevice: {
        payload: Prisma.$McpDevicePayload<ExtArgs>
        fields: Prisma.McpDeviceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.McpDeviceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpDevicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.McpDeviceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpDevicePayload>
          }
          findFirst: {
            args: Prisma.McpDeviceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpDevicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.McpDeviceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpDevicePayload>
          }
          findMany: {
            args: Prisma.McpDeviceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpDevicePayload>[]
          }
          create: {
            args: Prisma.McpDeviceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpDevicePayload>
          }
          createMany: {
            args: Prisma.McpDeviceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.McpDeviceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpDevicePayload>[]
          }
          delete: {
            args: Prisma.McpDeviceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpDevicePayload>
          }
          update: {
            args: Prisma.McpDeviceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpDevicePayload>
          }
          deleteMany: {
            args: Prisma.McpDeviceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.McpDeviceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.McpDeviceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$McpDevicePayload>
          }
          aggregate: {
            args: Prisma.McpDeviceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMcpDevice>
          }
          groupBy: {
            args: Prisma.McpDeviceGroupByArgs<ExtArgs>
            result: $Utils.Optional<McpDeviceGroupByOutputType>[]
          }
          count: {
            args: Prisma.McpDeviceCountArgs<ExtArgs>
            result: $Utils.Optional<McpDeviceCountAggregateOutputType> | number
          }
        }
      }
      Compartment: {
        payload: Prisma.$CompartmentPayload<ExtArgs>
        fields: Prisma.CompartmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompartmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompartmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentPayload>
          }
          findFirst: {
            args: Prisma.CompartmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompartmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentPayload>
          }
          findMany: {
            args: Prisma.CompartmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentPayload>[]
          }
          create: {
            args: Prisma.CompartmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentPayload>
          }
          createMany: {
            args: Prisma.CompartmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CompartmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentPayload>[]
          }
          delete: {
            args: Prisma.CompartmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentPayload>
          }
          update: {
            args: Prisma.CompartmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentPayload>
          }
          deleteMany: {
            args: Prisma.CompartmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompartmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CompartmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentPayload>
          }
          aggregate: {
            args: Prisma.CompartmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompartment>
          }
          groupBy: {
            args: Prisma.CompartmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompartmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompartmentCountArgs<ExtArgs>
            result: $Utils.Optional<CompartmentCountAggregateOutputType> | number
          }
        }
      }
      CompartmentStatus: {
        payload: Prisma.$CompartmentStatusPayload<ExtArgs>
        fields: Prisma.CompartmentStatusFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompartmentStatusFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentStatusPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompartmentStatusFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentStatusPayload>
          }
          findFirst: {
            args: Prisma.CompartmentStatusFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentStatusPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompartmentStatusFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentStatusPayload>
          }
          findMany: {
            args: Prisma.CompartmentStatusFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentStatusPayload>[]
          }
          create: {
            args: Prisma.CompartmentStatusCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentStatusPayload>
          }
          createMany: {
            args: Prisma.CompartmentStatusCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CompartmentStatusCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentStatusPayload>[]
          }
          delete: {
            args: Prisma.CompartmentStatusDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentStatusPayload>
          }
          update: {
            args: Prisma.CompartmentStatusUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentStatusPayload>
          }
          deleteMany: {
            args: Prisma.CompartmentStatusDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompartmentStatusUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CompartmentStatusUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompartmentStatusPayload>
          }
          aggregate: {
            args: Prisma.CompartmentStatusAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompartmentStatus>
          }
          groupBy: {
            args: Prisma.CompartmentStatusGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompartmentStatusGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompartmentStatusCountArgs<ExtArgs>
            result: $Utils.Optional<CompartmentStatusCountAggregateOutputType> | number
          }
        }
      }
      PricePlan: {
        payload: Prisma.$PricePlanPayload<ExtArgs>
        fields: Prisma.PricePlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PricePlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PricePlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePlanPayload>
          }
          findFirst: {
            args: Prisma.PricePlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PricePlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePlanPayload>
          }
          findMany: {
            args: Prisma.PricePlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePlanPayload>[]
          }
          create: {
            args: Prisma.PricePlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePlanPayload>
          }
          createMany: {
            args: Prisma.PricePlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PricePlanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePlanPayload>[]
          }
          delete: {
            args: Prisma.PricePlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePlanPayload>
          }
          update: {
            args: Prisma.PricePlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePlanPayload>
          }
          deleteMany: {
            args: Prisma.PricePlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PricePlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PricePlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricePlanPayload>
          }
          aggregate: {
            args: Prisma.PricePlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePricePlan>
          }
          groupBy: {
            args: Prisma.PricePlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<PricePlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.PricePlanCountArgs<ExtArgs>
            result: $Utils.Optional<PricePlanCountAggregateOutputType> | number
          }
        }
      }
      Rental: {
        payload: Prisma.$RentalPayload<ExtArgs>
        fields: Prisma.RentalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RentalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RentalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload>
          }
          findFirst: {
            args: Prisma.RentalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RentalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload>
          }
          findMany: {
            args: Prisma.RentalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload>[]
          }
          create: {
            args: Prisma.RentalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload>
          }
          createMany: {
            args: Prisma.RentalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RentalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload>[]
          }
          delete: {
            args: Prisma.RentalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload>
          }
          update: {
            args: Prisma.RentalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload>
          }
          deleteMany: {
            args: Prisma.RentalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RentalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RentalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload>
          }
          aggregate: {
            args: Prisma.RentalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRental>
          }
          groupBy: {
            args: Prisma.RentalGroupByArgs<ExtArgs>
            result: $Utils.Optional<RentalGroupByOutputType>[]
          }
          count: {
            args: Prisma.RentalCountArgs<ExtArgs>
            result: $Utils.Optional<RentalCountAggregateOutputType> | number
          }
        }
      }
      LockerLog: {
        payload: Prisma.$LockerLogPayload<ExtArgs>
        fields: Prisma.LockerLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LockerLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LockerLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LockerLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LockerLogPayload>
          }
          findFirst: {
            args: Prisma.LockerLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LockerLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LockerLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LockerLogPayload>
          }
          findMany: {
            args: Prisma.LockerLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LockerLogPayload>[]
          }
          create: {
            args: Prisma.LockerLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LockerLogPayload>
          }
          createMany: {
            args: Prisma.LockerLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LockerLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LockerLogPayload>[]
          }
          delete: {
            args: Prisma.LockerLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LockerLogPayload>
          }
          update: {
            args: Prisma.LockerLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LockerLogPayload>
          }
          deleteMany: {
            args: Prisma.LockerLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LockerLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LockerLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LockerLogPayload>
          }
          aggregate: {
            args: Prisma.LockerLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLockerLog>
          }
          groupBy: {
            args: Prisma.LockerLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<LockerLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.LockerLogCountArgs<ExtArgs>
            result: $Utils.Optional<LockerLogCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      UserSession: {
        payload: Prisma.$UserSessionPayload<ExtArgs>
        fields: Prisma.UserSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          findFirst: {
            args: Prisma.UserSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          findMany: {
            args: Prisma.UserSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          create: {
            args: Prisma.UserSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          createMany: {
            args: Prisma.UserSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          delete: {
            args: Prisma.UserSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          update: {
            args: Prisma.UserSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          deleteMany: {
            args: Prisma.UserSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          aggregate: {
            args: Prisma.UserSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserSession>
          }
          groupBy: {
            args: Prisma.UserSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserSessionCountArgs<ExtArgs>
            result: $Utils.Optional<UserSessionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    rentals: number
    notifications: number
    sessions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rentals?: boolean | UserCountOutputTypeCountRentalsArgs
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRentalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RentalWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSessionWhereInput
  }


  /**
   * Count Type LocationCountOutputType
   */

  export type LocationCountOutputType = {
    cabinets: number
  }

  export type LocationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cabinets?: boolean | LocationCountOutputTypeCountCabinetsArgs
  }

  // Custom InputTypes
  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationCountOutputType
     */
    select?: LocationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeCountCabinetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CabinetWhereInput
  }


  /**
   * Count Type CabinetCountOutputType
   */

  export type CabinetCountOutputType = {
    compartments: number
    mcpDevices: number
    logs: number
  }

  export type CabinetCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    compartments?: boolean | CabinetCountOutputTypeCountCompartmentsArgs
    mcpDevices?: boolean | CabinetCountOutputTypeCountMcpDevicesArgs
    logs?: boolean | CabinetCountOutputTypeCountLogsArgs
  }

  // Custom InputTypes
  /**
   * CabinetCountOutputType without action
   */
  export type CabinetCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CabinetCountOutputType
     */
    select?: CabinetCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CabinetCountOutputType without action
   */
  export type CabinetCountOutputTypeCountCompartmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompartmentWhereInput
  }

  /**
   * CabinetCountOutputType without action
   */
  export type CabinetCountOutputTypeCountMcpDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: McpDeviceWhereInput
  }

  /**
   * CabinetCountOutputType without action
   */
  export type CabinetCountOutputTypeCountLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LockerLogWhereInput
  }


  /**
   * Count Type McpDeviceCountOutputType
   */

  export type McpDeviceCountOutputType = {
    lockCompartments: number
    sensorCompartments: number
  }

  export type McpDeviceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lockCompartments?: boolean | McpDeviceCountOutputTypeCountLockCompartmentsArgs
    sensorCompartments?: boolean | McpDeviceCountOutputTypeCountSensorCompartmentsArgs
  }

  // Custom InputTypes
  /**
   * McpDeviceCountOutputType without action
   */
  export type McpDeviceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpDeviceCountOutputType
     */
    select?: McpDeviceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * McpDeviceCountOutputType without action
   */
  export type McpDeviceCountOutputTypeCountLockCompartmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompartmentWhereInput
  }

  /**
   * McpDeviceCountOutputType without action
   */
  export type McpDeviceCountOutputTypeCountSensorCompartmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompartmentWhereInput
  }


  /**
   * Count Type CompartmentCountOutputType
   */

  export type CompartmentCountOutputType = {
    rentals: number
    logs: number
  }

  export type CompartmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rentals?: boolean | CompartmentCountOutputTypeCountRentalsArgs
    logs?: boolean | CompartmentCountOutputTypeCountLogsArgs
  }

  // Custom InputTypes
  /**
   * CompartmentCountOutputType without action
   */
  export type CompartmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompartmentCountOutputType
     */
    select?: CompartmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CompartmentCountOutputType without action
   */
  export type CompartmentCountOutputTypeCountRentalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RentalWhereInput
  }

  /**
   * CompartmentCountOutputType without action
   */
  export type CompartmentCountOutputTypeCountLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LockerLogWhereInput
  }


  /**
   * Count Type PricePlanCountOutputType
   */

  export type PricePlanCountOutputType = {
    rentals: number
  }

  export type PricePlanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rentals?: boolean | PricePlanCountOutputTypeCountRentalsArgs
  }

  // Custom InputTypes
  /**
   * PricePlanCountOutputType without action
   */
  export type PricePlanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricePlanCountOutputType
     */
    select?: PricePlanCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PricePlanCountOutputType without action
   */
  export type PricePlanCountOutputTypeCountRentalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RentalWhereInput
  }


  /**
   * Count Type RentalCountOutputType
   */

  export type RentalCountOutputType = {
    logs: number
  }

  export type RentalCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    logs?: boolean | RentalCountOutputTypeCountLogsArgs
  }

  // Custom InputTypes
  /**
   * RentalCountOutputType without action
   */
  export type RentalCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RentalCountOutputType
     */
    select?: RentalCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RentalCountOutputType without action
   */
  export type RentalCountOutputTypeCountLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LockerLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Admin
   */

  export type AggregateAdmin = {
    _count: AdminCountAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  export type AdminMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    name: string | null
    role: $Enums.AdminRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AdminMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    name: string | null
    role: $Enums.AdminRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AdminCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    name: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AdminMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AdminMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AdminCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AdminAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admin to aggregate.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Admins
    **/
    _count?: true | AdminCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminMaxAggregateInputType
  }

  export type GetAdminAggregateType<T extends AdminAggregateArgs> = {
        [P in keyof T & keyof AggregateAdmin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdmin[P]>
      : GetScalarType<T[P], AggregateAdmin[P]>
  }




  export type AdminGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminWhereInput
    orderBy?: AdminOrderByWithAggregationInput | AdminOrderByWithAggregationInput[]
    by: AdminScalarFieldEnum[] | AdminScalarFieldEnum
    having?: AdminScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminCountAggregateInputType | true
    _min?: AdminMinAggregateInputType
    _max?: AdminMaxAggregateInputType
  }

  export type AdminGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    name: string
    role: $Enums.AdminRole
    createdAt: Date
    updatedAt: Date
    _count: AdminCountAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  type GetAdminGroupByPayload<T extends AdminGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminGroupByOutputType[P]>
            : GetScalarType<T[P], AdminGroupByOutputType[P]>
        }
      >
    >


  export type AdminSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $AdminPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Admin"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      name: string
      role: $Enums.AdminRole
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["admin"]>
    composites: {}
  }

  type AdminGetPayload<S extends boolean | null | undefined | AdminDefaultArgs> = $Result.GetResult<Prisma.$AdminPayload, S>

  type AdminCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AdminFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AdminCountAggregateInputType | true
    }

  export interface AdminDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Admin'], meta: { name: 'Admin' } }
    /**
     * Find zero or one Admin that matches the filter.
     * @param {AdminFindUniqueArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminFindUniqueArgs>(args: SelectSubset<T, AdminFindUniqueArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Admin that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AdminFindUniqueOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Admin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminFindFirstArgs>(args?: SelectSubset<T, AdminFindFirstArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Admin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Admins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Admins
     * const admins = await prisma.admin.findMany()
     * 
     * // Get first 10 Admins
     * const admins = await prisma.admin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminWithIdOnly = await prisma.admin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminFindManyArgs>(args?: SelectSubset<T, AdminFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Admin.
     * @param {AdminCreateArgs} args - Arguments to create a Admin.
     * @example
     * // Create one Admin
     * const Admin = await prisma.admin.create({
     *   data: {
     *     // ... data to create a Admin
     *   }
     * })
     * 
     */
    create<T extends AdminCreateArgs>(args: SelectSubset<T, AdminCreateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Admins.
     * @param {AdminCreateManyArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminCreateManyArgs>(args?: SelectSubset<T, AdminCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Admins and returns the data saved in the database.
     * @param {AdminCreateManyAndReturnArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Admins and only return the `id`
     * const adminWithIdOnly = await prisma.admin.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Admin.
     * @param {AdminDeleteArgs} args - Arguments to delete one Admin.
     * @example
     * // Delete one Admin
     * const Admin = await prisma.admin.delete({
     *   where: {
     *     // ... filter to delete one Admin
     *   }
     * })
     * 
     */
    delete<T extends AdminDeleteArgs>(args: SelectSubset<T, AdminDeleteArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Admin.
     * @param {AdminUpdateArgs} args - Arguments to update one Admin.
     * @example
     * // Update one Admin
     * const admin = await prisma.admin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminUpdateArgs>(args: SelectSubset<T, AdminUpdateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Admins.
     * @param {AdminDeleteManyArgs} args - Arguments to filter Admins to delete.
     * @example
     * // Delete a few Admins
     * const { count } = await prisma.admin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminDeleteManyArgs>(args?: SelectSubset<T, AdminDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Admins
     * const admin = await prisma.admin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminUpdateManyArgs>(args: SelectSubset<T, AdminUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Admin.
     * @param {AdminUpsertArgs} args - Arguments to update or create a Admin.
     * @example
     * // Update or create a Admin
     * const admin = await prisma.admin.upsert({
     *   create: {
     *     // ... data to create a Admin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Admin we want to update
     *   }
     * })
     */
    upsert<T extends AdminUpsertArgs>(args: SelectSubset<T, AdminUpsertArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminCountArgs} args - Arguments to filter Admins to count.
     * @example
     * // Count the number of Admins
     * const count = await prisma.admin.count({
     *   where: {
     *     // ... the filter for the Admins we want to count
     *   }
     * })
    **/
    count<T extends AdminCountArgs>(
      args?: Subset<T, AdminCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminAggregateArgs>(args: Subset<T, AdminAggregateArgs>): Prisma.PrismaPromise<GetAdminAggregateType<T>>

    /**
     * Group by Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminGroupByArgs['orderBy'] }
        : { orderBy?: AdminGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Admin model
   */
  readonly fields: AdminFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Admin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Admin model
   */ 
  interface AdminFieldRefs {
    readonly id: FieldRef<"Admin", 'String'>
    readonly email: FieldRef<"Admin", 'String'>
    readonly passwordHash: FieldRef<"Admin", 'String'>
    readonly name: FieldRef<"Admin", 'String'>
    readonly role: FieldRef<"Admin", 'AdminRole'>
    readonly createdAt: FieldRef<"Admin", 'DateTime'>
    readonly updatedAt: FieldRef<"Admin", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Admin findUnique
   */
  export type AdminFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findUniqueOrThrow
   */
  export type AdminFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findFirst
   */
  export type AdminFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findFirstOrThrow
   */
  export type AdminFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findMany
   */
  export type AdminFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Filter, which Admins to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin create
   */
  export type AdminCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * The data needed to create a Admin.
     */
    data: XOR<AdminCreateInput, AdminUncheckedCreateInput>
  }

  /**
   * Admin createMany
   */
  export type AdminCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Admin createManyAndReturn
   */
  export type AdminCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Admin update
   */
  export type AdminUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * The data needed to update a Admin.
     */
    data: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
    /**
     * Choose, which Admin to update.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin updateMany
   */
  export type AdminUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Admins.
     */
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyInput>
    /**
     * Filter which Admins to update
     */
    where?: AdminWhereInput
  }

  /**
   * Admin upsert
   */
  export type AdminUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * The filter to search for the Admin to update in case it exists.
     */
    where: AdminWhereUniqueInput
    /**
     * In case the Admin found by the `where` argument doesn't exist, create a new Admin with this data.
     */
    create: XOR<AdminCreateInput, AdminUncheckedCreateInput>
    /**
     * In case the Admin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
  }

  /**
   * Admin delete
   */
  export type AdminDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Filter which Admin to delete.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin deleteMany
   */
  export type AdminDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admins to delete
     */
    where?: AdminWhereInput
  }

  /**
   * Admin without action
   */
  export type AdminDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    phone: string | null
    passwordHash: string | null
    name: string | null
    status: $Enums.UserStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    phone: string | null
    passwordHash: string | null
    name: string | null
    status: $Enums.UserStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    phone: number
    passwordHash: number
    name: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    passwordHash?: true
    name?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    passwordHash?: true
    name?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    passwordHash?: true
    name?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string | null
    phone: string
    passwordHash: string | null
    name: string | null
    status: $Enums.UserStatus
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    passwordHash?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    rentals?: boolean | User$rentalsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    passwordHash?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    phone?: boolean
    passwordHash?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rentals?: boolean | User$rentalsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      rentals: Prisma.$RentalPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
      sessions: Prisma.$UserSessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string | null
      phone: string
      passwordHash: string | null
      name: string | null
      status: $Enums.UserStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rentals<T extends User$rentalsArgs<ExtArgs> = {}>(args?: Subset<T, User$rentalsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "findMany"> | Null>
    notifications<T extends User$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany"> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly status: FieldRef<"User", 'UserStatus'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.rentals
   */
  export type User$rentalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    where?: RentalWhereInput
    orderBy?: RentalOrderByWithRelationInput | RentalOrderByWithRelationInput[]
    cursor?: RentalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RentalScalarFieldEnum | RentalScalarFieldEnum[]
  }

  /**
   * User.notifications
   */
  export type User$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    where?: UserSessionWhereInput
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    cursor?: UserSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Location
   */

  export type AggregateLocation = {
    _count: LocationCountAggregateOutputType | null
    _avg: LocationAvgAggregateOutputType | null
    _sum: LocationSumAggregateOutputType | null
    _min: LocationMinAggregateOutputType | null
    _max: LocationMaxAggregateOutputType | null
  }

  export type LocationAvgAggregateOutputType = {
    latitude: number | null
    longitude: number | null
  }

  export type LocationSumAggregateOutputType = {
    latitude: number | null
    longitude: number | null
  }

  export type LocationMinAggregateOutputType = {
    id: string | null
    name: string | null
    address: string | null
    latitude: number | null
    longitude: number | null
    googlePlaceId: string | null
    mapImageUrl: string | null
    status: $Enums.LocationStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    address: string | null
    latitude: number | null
    longitude: number | null
    googlePlaceId: string | null
    mapImageUrl: string | null
    status: $Enums.LocationStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocationCountAggregateOutputType = {
    id: number
    name: number
    address: number
    latitude: number
    longitude: number
    googlePlaceId: number
    mapImageUrl: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LocationAvgAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type LocationSumAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type LocationMinAggregateInputType = {
    id?: true
    name?: true
    address?: true
    latitude?: true
    longitude?: true
    googlePlaceId?: true
    mapImageUrl?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocationMaxAggregateInputType = {
    id?: true
    name?: true
    address?: true
    latitude?: true
    longitude?: true
    googlePlaceId?: true
    mapImageUrl?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocationCountAggregateInputType = {
    id?: true
    name?: true
    address?: true
    latitude?: true
    longitude?: true
    googlePlaceId?: true
    mapImageUrl?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Location to aggregate.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Locations
    **/
    _count?: true | LocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocationMaxAggregateInputType
  }

  export type GetLocationAggregateType<T extends LocationAggregateArgs> = {
        [P in keyof T & keyof AggregateLocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocation[P]>
      : GetScalarType<T[P], AggregateLocation[P]>
  }




  export type LocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationWhereInput
    orderBy?: LocationOrderByWithAggregationInput | LocationOrderByWithAggregationInput[]
    by: LocationScalarFieldEnum[] | LocationScalarFieldEnum
    having?: LocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocationCountAggregateInputType | true
    _avg?: LocationAvgAggregateInputType
    _sum?: LocationSumAggregateInputType
    _min?: LocationMinAggregateInputType
    _max?: LocationMaxAggregateInputType
  }

  export type LocationGroupByOutputType = {
    id: string
    name: string
    address: string
    latitude: number | null
    longitude: number | null
    googlePlaceId: string | null
    mapImageUrl: string | null
    status: $Enums.LocationStatus
    createdAt: Date
    updatedAt: Date
    _count: LocationCountAggregateOutputType | null
    _avg: LocationAvgAggregateOutputType | null
    _sum: LocationSumAggregateOutputType | null
    _min: LocationMinAggregateOutputType | null
    _max: LocationMaxAggregateOutputType | null
  }

  type GetLocationGroupByPayload<T extends LocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocationGroupByOutputType[P]>
            : GetScalarType<T[P], LocationGroupByOutputType[P]>
        }
      >
    >


  export type LocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    latitude?: boolean
    longitude?: boolean
    googlePlaceId?: boolean
    mapImageUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cabinets?: boolean | Location$cabinetsArgs<ExtArgs>
    _count?: boolean | LocationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["location"]>

  export type LocationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    latitude?: boolean
    longitude?: boolean
    googlePlaceId?: boolean
    mapImageUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["location"]>

  export type LocationSelectScalar = {
    id?: boolean
    name?: boolean
    address?: boolean
    latitude?: boolean
    longitude?: boolean
    googlePlaceId?: boolean
    mapImageUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cabinets?: boolean | Location$cabinetsArgs<ExtArgs>
    _count?: boolean | LocationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LocationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $LocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Location"
    objects: {
      cabinets: Prisma.$CabinetPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      address: string
      latitude: number | null
      longitude: number | null
      googlePlaceId: string | null
      mapImageUrl: string | null
      status: $Enums.LocationStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["location"]>
    composites: {}
  }

  type LocationGetPayload<S extends boolean | null | undefined | LocationDefaultArgs> = $Result.GetResult<Prisma.$LocationPayload, S>

  type LocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LocationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LocationCountAggregateInputType | true
    }

  export interface LocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Location'], meta: { name: 'Location' } }
    /**
     * Find zero or one Location that matches the filter.
     * @param {LocationFindUniqueArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocationFindUniqueArgs>(args: SelectSubset<T, LocationFindUniqueArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Location that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LocationFindUniqueOrThrowArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocationFindUniqueOrThrowArgs>(args: SelectSubset<T, LocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Location that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindFirstArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocationFindFirstArgs>(args?: SelectSubset<T, LocationFindFirstArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Location that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindFirstOrThrowArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocationFindFirstOrThrowArgs>(args?: SelectSubset<T, LocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Locations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Locations
     * const locations = await prisma.location.findMany()
     * 
     * // Get first 10 Locations
     * const locations = await prisma.location.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const locationWithIdOnly = await prisma.location.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocationFindManyArgs>(args?: SelectSubset<T, LocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Location.
     * @param {LocationCreateArgs} args - Arguments to create a Location.
     * @example
     * // Create one Location
     * const Location = await prisma.location.create({
     *   data: {
     *     // ... data to create a Location
     *   }
     * })
     * 
     */
    create<T extends LocationCreateArgs>(args: SelectSubset<T, LocationCreateArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Locations.
     * @param {LocationCreateManyArgs} args - Arguments to create many Locations.
     * @example
     * // Create many Locations
     * const location = await prisma.location.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocationCreateManyArgs>(args?: SelectSubset<T, LocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Locations and returns the data saved in the database.
     * @param {LocationCreateManyAndReturnArgs} args - Arguments to create many Locations.
     * @example
     * // Create many Locations
     * const location = await prisma.location.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Locations and only return the `id`
     * const locationWithIdOnly = await prisma.location.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocationCreateManyAndReturnArgs>(args?: SelectSubset<T, LocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Location.
     * @param {LocationDeleteArgs} args - Arguments to delete one Location.
     * @example
     * // Delete one Location
     * const Location = await prisma.location.delete({
     *   where: {
     *     // ... filter to delete one Location
     *   }
     * })
     * 
     */
    delete<T extends LocationDeleteArgs>(args: SelectSubset<T, LocationDeleteArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Location.
     * @param {LocationUpdateArgs} args - Arguments to update one Location.
     * @example
     * // Update one Location
     * const location = await prisma.location.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocationUpdateArgs>(args: SelectSubset<T, LocationUpdateArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Locations.
     * @param {LocationDeleteManyArgs} args - Arguments to filter Locations to delete.
     * @example
     * // Delete a few Locations
     * const { count } = await prisma.location.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocationDeleteManyArgs>(args?: SelectSubset<T, LocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Locations
     * const location = await prisma.location.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocationUpdateManyArgs>(args: SelectSubset<T, LocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Location.
     * @param {LocationUpsertArgs} args - Arguments to update or create a Location.
     * @example
     * // Update or create a Location
     * const location = await prisma.location.upsert({
     *   create: {
     *     // ... data to create a Location
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Location we want to update
     *   }
     * })
     */
    upsert<T extends LocationUpsertArgs>(args: SelectSubset<T, LocationUpsertArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationCountArgs} args - Arguments to filter Locations to count.
     * @example
     * // Count the number of Locations
     * const count = await prisma.location.count({
     *   where: {
     *     // ... the filter for the Locations we want to count
     *   }
     * })
    **/
    count<T extends LocationCountArgs>(
      args?: Subset<T, LocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Location.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocationAggregateArgs>(args: Subset<T, LocationAggregateArgs>): Prisma.PrismaPromise<GetLocationAggregateType<T>>

    /**
     * Group by Location.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocationGroupByArgs['orderBy'] }
        : { orderBy?: LocationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Location model
   */
  readonly fields: LocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Location.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cabinets<T extends Location$cabinetsArgs<ExtArgs> = {}>(args?: Subset<T, Location$cabinetsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CabinetPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Location model
   */ 
  interface LocationFieldRefs {
    readonly id: FieldRef<"Location", 'String'>
    readonly name: FieldRef<"Location", 'String'>
    readonly address: FieldRef<"Location", 'String'>
    readonly latitude: FieldRef<"Location", 'Float'>
    readonly longitude: FieldRef<"Location", 'Float'>
    readonly googlePlaceId: FieldRef<"Location", 'String'>
    readonly mapImageUrl: FieldRef<"Location", 'String'>
    readonly status: FieldRef<"Location", 'LocationStatus'>
    readonly createdAt: FieldRef<"Location", 'DateTime'>
    readonly updatedAt: FieldRef<"Location", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Location findUnique
   */
  export type LocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location findUniqueOrThrow
   */
  export type LocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location findFirst
   */
  export type LocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location findFirstOrThrow
   */
  export type LocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location findMany
   */
  export type LocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Locations to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location create
   */
  export type LocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The data needed to create a Location.
     */
    data: XOR<LocationCreateInput, LocationUncheckedCreateInput>
  }

  /**
   * Location createMany
   */
  export type LocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Locations.
     */
    data: LocationCreateManyInput | LocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Location createManyAndReturn
   */
  export type LocationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Locations.
     */
    data: LocationCreateManyInput | LocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Location update
   */
  export type LocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The data needed to update a Location.
     */
    data: XOR<LocationUpdateInput, LocationUncheckedUpdateInput>
    /**
     * Choose, which Location to update.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location updateMany
   */
  export type LocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Locations.
     */
    data: XOR<LocationUpdateManyMutationInput, LocationUncheckedUpdateManyInput>
    /**
     * Filter which Locations to update
     */
    where?: LocationWhereInput
  }

  /**
   * Location upsert
   */
  export type LocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The filter to search for the Location to update in case it exists.
     */
    where: LocationWhereUniqueInput
    /**
     * In case the Location found by the `where` argument doesn't exist, create a new Location with this data.
     */
    create: XOR<LocationCreateInput, LocationUncheckedCreateInput>
    /**
     * In case the Location was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocationUpdateInput, LocationUncheckedUpdateInput>
  }

  /**
   * Location delete
   */
  export type LocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter which Location to delete.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location deleteMany
   */
  export type LocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Locations to delete
     */
    where?: LocationWhereInput
  }

  /**
   * Location.cabinets
   */
  export type Location$cabinetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cabinet
     */
    select?: CabinetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CabinetInclude<ExtArgs> | null
    where?: CabinetWhereInput
    orderBy?: CabinetOrderByWithRelationInput | CabinetOrderByWithRelationInput[]
    cursor?: CabinetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CabinetScalarFieldEnum | CabinetScalarFieldEnum[]
  }

  /**
   * Location without action
   */
  export type LocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
  }


  /**
   * Model Cabinet
   */

  export type AggregateCabinet = {
    _count: CabinetCountAggregateOutputType | null
    _min: CabinetMinAggregateOutputType | null
    _max: CabinetMaxAggregateOutputType | null
  }

  export type CabinetMinAggregateOutputType = {
    id: string | null
    locationId: string | null
    name: string | null
    status: $Enums.CabinetStatus | null
    lastHeartbeatAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CabinetMaxAggregateOutputType = {
    id: string | null
    locationId: string | null
    name: string | null
    status: $Enums.CabinetStatus | null
    lastHeartbeatAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CabinetCountAggregateOutputType = {
    id: number
    locationId: number
    name: number
    status: number
    lastHeartbeatAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CabinetMinAggregateInputType = {
    id?: true
    locationId?: true
    name?: true
    status?: true
    lastHeartbeatAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CabinetMaxAggregateInputType = {
    id?: true
    locationId?: true
    name?: true
    status?: true
    lastHeartbeatAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CabinetCountAggregateInputType = {
    id?: true
    locationId?: true
    name?: true
    status?: true
    lastHeartbeatAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CabinetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cabinet to aggregate.
     */
    where?: CabinetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cabinets to fetch.
     */
    orderBy?: CabinetOrderByWithRelationInput | CabinetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CabinetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cabinets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cabinets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Cabinets
    **/
    _count?: true | CabinetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CabinetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CabinetMaxAggregateInputType
  }

  export type GetCabinetAggregateType<T extends CabinetAggregateArgs> = {
        [P in keyof T & keyof AggregateCabinet]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCabinet[P]>
      : GetScalarType<T[P], AggregateCabinet[P]>
  }




  export type CabinetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CabinetWhereInput
    orderBy?: CabinetOrderByWithAggregationInput | CabinetOrderByWithAggregationInput[]
    by: CabinetScalarFieldEnum[] | CabinetScalarFieldEnum
    having?: CabinetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CabinetCountAggregateInputType | true
    _min?: CabinetMinAggregateInputType
    _max?: CabinetMaxAggregateInputType
  }

  export type CabinetGroupByOutputType = {
    id: string
    locationId: string
    name: string
    status: $Enums.CabinetStatus
    lastHeartbeatAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: CabinetCountAggregateOutputType | null
    _min: CabinetMinAggregateOutputType | null
    _max: CabinetMaxAggregateOutputType | null
  }

  type GetCabinetGroupByPayload<T extends CabinetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CabinetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CabinetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CabinetGroupByOutputType[P]>
            : GetScalarType<T[P], CabinetGroupByOutputType[P]>
        }
      >
    >


  export type CabinetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    locationId?: boolean
    name?: boolean
    status?: boolean
    lastHeartbeatAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    location?: boolean | LocationDefaultArgs<ExtArgs>
    compartments?: boolean | Cabinet$compartmentsArgs<ExtArgs>
    mcpDevices?: boolean | Cabinet$mcpDevicesArgs<ExtArgs>
    logs?: boolean | Cabinet$logsArgs<ExtArgs>
    _count?: boolean | CabinetCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cabinet"]>

  export type CabinetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    locationId?: boolean
    name?: boolean
    status?: boolean
    lastHeartbeatAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cabinet"]>

  export type CabinetSelectScalar = {
    id?: boolean
    locationId?: boolean
    name?: boolean
    status?: boolean
    lastHeartbeatAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CabinetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    location?: boolean | LocationDefaultArgs<ExtArgs>
    compartments?: boolean | Cabinet$compartmentsArgs<ExtArgs>
    mcpDevices?: boolean | Cabinet$mcpDevicesArgs<ExtArgs>
    logs?: boolean | Cabinet$logsArgs<ExtArgs>
    _count?: boolean | CabinetCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CabinetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }

  export type $CabinetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Cabinet"
    objects: {
      location: Prisma.$LocationPayload<ExtArgs>
      compartments: Prisma.$CompartmentPayload<ExtArgs>[]
      mcpDevices: Prisma.$McpDevicePayload<ExtArgs>[]
      logs: Prisma.$LockerLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      locationId: string
      name: string
      status: $Enums.CabinetStatus
      lastHeartbeatAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cabinet"]>
    composites: {}
  }

  type CabinetGetPayload<S extends boolean | null | undefined | CabinetDefaultArgs> = $Result.GetResult<Prisma.$CabinetPayload, S>

  type CabinetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CabinetFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CabinetCountAggregateInputType | true
    }

  export interface CabinetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Cabinet'], meta: { name: 'Cabinet' } }
    /**
     * Find zero or one Cabinet that matches the filter.
     * @param {CabinetFindUniqueArgs} args - Arguments to find a Cabinet
     * @example
     * // Get one Cabinet
     * const cabinet = await prisma.cabinet.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CabinetFindUniqueArgs>(args: SelectSubset<T, CabinetFindUniqueArgs<ExtArgs>>): Prisma__CabinetClient<$Result.GetResult<Prisma.$CabinetPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Cabinet that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CabinetFindUniqueOrThrowArgs} args - Arguments to find a Cabinet
     * @example
     * // Get one Cabinet
     * const cabinet = await prisma.cabinet.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CabinetFindUniqueOrThrowArgs>(args: SelectSubset<T, CabinetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CabinetClient<$Result.GetResult<Prisma.$CabinetPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Cabinet that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CabinetFindFirstArgs} args - Arguments to find a Cabinet
     * @example
     * // Get one Cabinet
     * const cabinet = await prisma.cabinet.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CabinetFindFirstArgs>(args?: SelectSubset<T, CabinetFindFirstArgs<ExtArgs>>): Prisma__CabinetClient<$Result.GetResult<Prisma.$CabinetPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Cabinet that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CabinetFindFirstOrThrowArgs} args - Arguments to find a Cabinet
     * @example
     * // Get one Cabinet
     * const cabinet = await prisma.cabinet.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CabinetFindFirstOrThrowArgs>(args?: SelectSubset<T, CabinetFindFirstOrThrowArgs<ExtArgs>>): Prisma__CabinetClient<$Result.GetResult<Prisma.$CabinetPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Cabinets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CabinetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cabinets
     * const cabinets = await prisma.cabinet.findMany()
     * 
     * // Get first 10 Cabinets
     * const cabinets = await prisma.cabinet.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cabinetWithIdOnly = await prisma.cabinet.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CabinetFindManyArgs>(args?: SelectSubset<T, CabinetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CabinetPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Cabinet.
     * @param {CabinetCreateArgs} args - Arguments to create a Cabinet.
     * @example
     * // Create one Cabinet
     * const Cabinet = await prisma.cabinet.create({
     *   data: {
     *     // ... data to create a Cabinet
     *   }
     * })
     * 
     */
    create<T extends CabinetCreateArgs>(args: SelectSubset<T, CabinetCreateArgs<ExtArgs>>): Prisma__CabinetClient<$Result.GetResult<Prisma.$CabinetPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Cabinets.
     * @param {CabinetCreateManyArgs} args - Arguments to create many Cabinets.
     * @example
     * // Create many Cabinets
     * const cabinet = await prisma.cabinet.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CabinetCreateManyArgs>(args?: SelectSubset<T, CabinetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Cabinets and returns the data saved in the database.
     * @param {CabinetCreateManyAndReturnArgs} args - Arguments to create many Cabinets.
     * @example
     * // Create many Cabinets
     * const cabinet = await prisma.cabinet.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Cabinets and only return the `id`
     * const cabinetWithIdOnly = await prisma.cabinet.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CabinetCreateManyAndReturnArgs>(args?: SelectSubset<T, CabinetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CabinetPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Cabinet.
     * @param {CabinetDeleteArgs} args - Arguments to delete one Cabinet.
     * @example
     * // Delete one Cabinet
     * const Cabinet = await prisma.cabinet.delete({
     *   where: {
     *     // ... filter to delete one Cabinet
     *   }
     * })
     * 
     */
    delete<T extends CabinetDeleteArgs>(args: SelectSubset<T, CabinetDeleteArgs<ExtArgs>>): Prisma__CabinetClient<$Result.GetResult<Prisma.$CabinetPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Cabinet.
     * @param {CabinetUpdateArgs} args - Arguments to update one Cabinet.
     * @example
     * // Update one Cabinet
     * const cabinet = await prisma.cabinet.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CabinetUpdateArgs>(args: SelectSubset<T, CabinetUpdateArgs<ExtArgs>>): Prisma__CabinetClient<$Result.GetResult<Prisma.$CabinetPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Cabinets.
     * @param {CabinetDeleteManyArgs} args - Arguments to filter Cabinets to delete.
     * @example
     * // Delete a few Cabinets
     * const { count } = await prisma.cabinet.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CabinetDeleteManyArgs>(args?: SelectSubset<T, CabinetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cabinets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CabinetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cabinets
     * const cabinet = await prisma.cabinet.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CabinetUpdateManyArgs>(args: SelectSubset<T, CabinetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Cabinet.
     * @param {CabinetUpsertArgs} args - Arguments to update or create a Cabinet.
     * @example
     * // Update or create a Cabinet
     * const cabinet = await prisma.cabinet.upsert({
     *   create: {
     *     // ... data to create a Cabinet
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cabinet we want to update
     *   }
     * })
     */
    upsert<T extends CabinetUpsertArgs>(args: SelectSubset<T, CabinetUpsertArgs<ExtArgs>>): Prisma__CabinetClient<$Result.GetResult<Prisma.$CabinetPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Cabinets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CabinetCountArgs} args - Arguments to filter Cabinets to count.
     * @example
     * // Count the number of Cabinets
     * const count = await prisma.cabinet.count({
     *   where: {
     *     // ... the filter for the Cabinets we want to count
     *   }
     * })
    **/
    count<T extends CabinetCountArgs>(
      args?: Subset<T, CabinetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CabinetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Cabinet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CabinetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CabinetAggregateArgs>(args: Subset<T, CabinetAggregateArgs>): Prisma.PrismaPromise<GetCabinetAggregateType<T>>

    /**
     * Group by Cabinet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CabinetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CabinetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CabinetGroupByArgs['orderBy'] }
        : { orderBy?: CabinetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CabinetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCabinetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Cabinet model
   */
  readonly fields: CabinetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Cabinet.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CabinetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    location<T extends LocationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocationDefaultArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    compartments<T extends Cabinet$compartmentsArgs<ExtArgs> = {}>(args?: Subset<T, Cabinet$compartmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompartmentPayload<ExtArgs>, T, "findMany"> | Null>
    mcpDevices<T extends Cabinet$mcpDevicesArgs<ExtArgs> = {}>(args?: Subset<T, Cabinet$mcpDevicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$McpDevicePayload<ExtArgs>, T, "findMany"> | Null>
    logs<T extends Cabinet$logsArgs<ExtArgs> = {}>(args?: Subset<T, Cabinet$logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LockerLogPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Cabinet model
   */ 
  interface CabinetFieldRefs {
    readonly id: FieldRef<"Cabinet", 'String'>
    readonly locationId: FieldRef<"Cabinet", 'String'>
    readonly name: FieldRef<"Cabinet", 'String'>
    readonly status: FieldRef<"Cabinet", 'CabinetStatus'>
    readonly lastHeartbeatAt: FieldRef<"Cabinet", 'DateTime'>
    readonly createdAt: FieldRef<"Cabinet", 'DateTime'>
    readonly updatedAt: FieldRef<"Cabinet", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Cabinet findUnique
   */
  export type CabinetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cabinet
     */
    select?: CabinetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CabinetInclude<ExtArgs> | null
    /**
     * Filter, which Cabinet to fetch.
     */
    where: CabinetWhereUniqueInput
  }

  /**
   * Cabinet findUniqueOrThrow
   */
  export type CabinetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cabinet
     */
    select?: CabinetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CabinetInclude<ExtArgs> | null
    /**
     * Filter, which Cabinet to fetch.
     */
    where: CabinetWhereUniqueInput
  }

  /**
   * Cabinet findFirst
   */
  export type CabinetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cabinet
     */
    select?: CabinetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CabinetInclude<ExtArgs> | null
    /**
     * Filter, which Cabinet to fetch.
     */
    where?: CabinetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cabinets to fetch.
     */
    orderBy?: CabinetOrderByWithRelationInput | CabinetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cabinets.
     */
    cursor?: CabinetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cabinets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cabinets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cabinets.
     */
    distinct?: CabinetScalarFieldEnum | CabinetScalarFieldEnum[]
  }

  /**
   * Cabinet findFirstOrThrow
   */
  export type CabinetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cabinet
     */
    select?: CabinetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CabinetInclude<ExtArgs> | null
    /**
     * Filter, which Cabinet to fetch.
     */
    where?: CabinetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cabinets to fetch.
     */
    orderBy?: CabinetOrderByWithRelationInput | CabinetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cabinets.
     */
    cursor?: CabinetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cabinets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cabinets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cabinets.
     */
    distinct?: CabinetScalarFieldEnum | CabinetScalarFieldEnum[]
  }

  /**
   * Cabinet findMany
   */
  export type CabinetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cabinet
     */
    select?: CabinetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CabinetInclude<ExtArgs> | null
    /**
     * Filter, which Cabinets to fetch.
     */
    where?: CabinetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cabinets to fetch.
     */
    orderBy?: CabinetOrderByWithRelationInput | CabinetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Cabinets.
     */
    cursor?: CabinetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cabinets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cabinets.
     */
    skip?: number
    distinct?: CabinetScalarFieldEnum | CabinetScalarFieldEnum[]
  }

  /**
   * Cabinet create
   */
  export type CabinetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cabinet
     */
    select?: CabinetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CabinetInclude<ExtArgs> | null
    /**
     * The data needed to create a Cabinet.
     */
    data: XOR<CabinetCreateInput, CabinetUncheckedCreateInput>
  }

  /**
   * Cabinet createMany
   */
  export type CabinetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Cabinets.
     */
    data: CabinetCreateManyInput | CabinetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cabinet createManyAndReturn
   */
  export type CabinetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cabinet
     */
    select?: CabinetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Cabinets.
     */
    data: CabinetCreateManyInput | CabinetCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CabinetIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Cabinet update
   */
  export type CabinetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cabinet
     */
    select?: CabinetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CabinetInclude<ExtArgs> | null
    /**
     * The data needed to update a Cabinet.
     */
    data: XOR<CabinetUpdateInput, CabinetUncheckedUpdateInput>
    /**
     * Choose, which Cabinet to update.
     */
    where: CabinetWhereUniqueInput
  }

  /**
   * Cabinet updateMany
   */
  export type CabinetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Cabinets.
     */
    data: XOR<CabinetUpdateManyMutationInput, CabinetUncheckedUpdateManyInput>
    /**
     * Filter which Cabinets to update
     */
    where?: CabinetWhereInput
  }

  /**
   * Cabinet upsert
   */
  export type CabinetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cabinet
     */
    select?: CabinetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CabinetInclude<ExtArgs> | null
    /**
     * The filter to search for the Cabinet to update in case it exists.
     */
    where: CabinetWhereUniqueInput
    /**
     * In case the Cabinet found by the `where` argument doesn't exist, create a new Cabinet with this data.
     */
    create: XOR<CabinetCreateInput, CabinetUncheckedCreateInput>
    /**
     * In case the Cabinet was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CabinetUpdateInput, CabinetUncheckedUpdateInput>
  }

  /**
   * Cabinet delete
   */
  export type CabinetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cabinet
     */
    select?: CabinetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CabinetInclude<ExtArgs> | null
    /**
     * Filter which Cabinet to delete.
     */
    where: CabinetWhereUniqueInput
  }

  /**
   * Cabinet deleteMany
   */
  export type CabinetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cabinets to delete
     */
    where?: CabinetWhereInput
  }

  /**
   * Cabinet.compartments
   */
  export type Cabinet$compartmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Compartment
     */
    select?: CompartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentInclude<ExtArgs> | null
    where?: CompartmentWhereInput
    orderBy?: CompartmentOrderByWithRelationInput | CompartmentOrderByWithRelationInput[]
    cursor?: CompartmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CompartmentScalarFieldEnum | CompartmentScalarFieldEnum[]
  }

  /**
   * Cabinet.mcpDevices
   */
  export type Cabinet$mcpDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpDevice
     */
    select?: McpDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpDeviceInclude<ExtArgs> | null
    where?: McpDeviceWhereInput
    orderBy?: McpDeviceOrderByWithRelationInput | McpDeviceOrderByWithRelationInput[]
    cursor?: McpDeviceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: McpDeviceScalarFieldEnum | McpDeviceScalarFieldEnum[]
  }

  /**
   * Cabinet.logs
   */
  export type Cabinet$logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LockerLog
     */
    select?: LockerLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LockerLogInclude<ExtArgs> | null
    where?: LockerLogWhereInput
    orderBy?: LockerLogOrderByWithRelationInput | LockerLogOrderByWithRelationInput[]
    cursor?: LockerLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LockerLogScalarFieldEnum | LockerLogScalarFieldEnum[]
  }

  /**
   * Cabinet without action
   */
  export type CabinetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cabinet
     */
    select?: CabinetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CabinetInclude<ExtArgs> | null
  }


  /**
   * Model McpDevice
   */

  export type AggregateMcpDevice = {
    _count: McpDeviceCountAggregateOutputType | null
    _avg: McpDeviceAvgAggregateOutputType | null
    _sum: McpDeviceSumAggregateOutputType | null
    _min: McpDeviceMinAggregateOutputType | null
    _max: McpDeviceMaxAggregateOutputType | null
  }

  export type McpDeviceAvgAggregateOutputType = {
    bus: number | null
    address: number | null
  }

  export type McpDeviceSumAggregateOutputType = {
    bus: number | null
    address: number | null
  }

  export type McpDeviceMinAggregateOutputType = {
    id: string | null
    cabinetId: string | null
    bus: number | null
    address: number | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type McpDeviceMaxAggregateOutputType = {
    id: string | null
    cabinetId: string | null
    bus: number | null
    address: number | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type McpDeviceCountAggregateOutputType = {
    id: number
    cabinetId: number
    bus: number
    address: number
    name: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type McpDeviceAvgAggregateInputType = {
    bus?: true
    address?: true
  }

  export type McpDeviceSumAggregateInputType = {
    bus?: true
    address?: true
  }

  export type McpDeviceMinAggregateInputType = {
    id?: true
    cabinetId?: true
    bus?: true
    address?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type McpDeviceMaxAggregateInputType = {
    id?: true
    cabinetId?: true
    bus?: true
    address?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type McpDeviceCountAggregateInputType = {
    id?: true
    cabinetId?: true
    bus?: true
    address?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type McpDeviceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which McpDevice to aggregate.
     */
    where?: McpDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of McpDevices to fetch.
     */
    orderBy?: McpDeviceOrderByWithRelationInput | McpDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: McpDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` McpDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` McpDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned McpDevices
    **/
    _count?: true | McpDeviceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: McpDeviceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: McpDeviceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: McpDeviceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: McpDeviceMaxAggregateInputType
  }

  export type GetMcpDeviceAggregateType<T extends McpDeviceAggregateArgs> = {
        [P in keyof T & keyof AggregateMcpDevice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMcpDevice[P]>
      : GetScalarType<T[P], AggregateMcpDevice[P]>
  }




  export type McpDeviceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: McpDeviceWhereInput
    orderBy?: McpDeviceOrderByWithAggregationInput | McpDeviceOrderByWithAggregationInput[]
    by: McpDeviceScalarFieldEnum[] | McpDeviceScalarFieldEnum
    having?: McpDeviceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: McpDeviceCountAggregateInputType | true
    _avg?: McpDeviceAvgAggregateInputType
    _sum?: McpDeviceSumAggregateInputType
    _min?: McpDeviceMinAggregateInputType
    _max?: McpDeviceMaxAggregateInputType
  }

  export type McpDeviceGroupByOutputType = {
    id: string
    cabinetId: string
    bus: number
    address: number
    name: string | null
    createdAt: Date
    updatedAt: Date
    _count: McpDeviceCountAggregateOutputType | null
    _avg: McpDeviceAvgAggregateOutputType | null
    _sum: McpDeviceSumAggregateOutputType | null
    _min: McpDeviceMinAggregateOutputType | null
    _max: McpDeviceMaxAggregateOutputType | null
  }

  type GetMcpDeviceGroupByPayload<T extends McpDeviceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<McpDeviceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof McpDeviceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], McpDeviceGroupByOutputType[P]>
            : GetScalarType<T[P], McpDeviceGroupByOutputType[P]>
        }
      >
    >


  export type McpDeviceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cabinetId?: boolean
    bus?: boolean
    address?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cabinet?: boolean | CabinetDefaultArgs<ExtArgs>
    lockCompartments?: boolean | McpDevice$lockCompartmentsArgs<ExtArgs>
    sensorCompartments?: boolean | McpDevice$sensorCompartmentsArgs<ExtArgs>
    _count?: boolean | McpDeviceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mcpDevice"]>

  export type McpDeviceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cabinetId?: boolean
    bus?: boolean
    address?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cabinet?: boolean | CabinetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mcpDevice"]>

  export type McpDeviceSelectScalar = {
    id?: boolean
    cabinetId?: boolean
    bus?: boolean
    address?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type McpDeviceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cabinet?: boolean | CabinetDefaultArgs<ExtArgs>
    lockCompartments?: boolean | McpDevice$lockCompartmentsArgs<ExtArgs>
    sensorCompartments?: boolean | McpDevice$sensorCompartmentsArgs<ExtArgs>
    _count?: boolean | McpDeviceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type McpDeviceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cabinet?: boolean | CabinetDefaultArgs<ExtArgs>
  }

  export type $McpDevicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "McpDevice"
    objects: {
      cabinet: Prisma.$CabinetPayload<ExtArgs>
      lockCompartments: Prisma.$CompartmentPayload<ExtArgs>[]
      sensorCompartments: Prisma.$CompartmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cabinetId: string
      bus: number
      address: number
      name: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["mcpDevice"]>
    composites: {}
  }

  type McpDeviceGetPayload<S extends boolean | null | undefined | McpDeviceDefaultArgs> = $Result.GetResult<Prisma.$McpDevicePayload, S>

  type McpDeviceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<McpDeviceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: McpDeviceCountAggregateInputType | true
    }

  export interface McpDeviceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['McpDevice'], meta: { name: 'McpDevice' } }
    /**
     * Find zero or one McpDevice that matches the filter.
     * @param {McpDeviceFindUniqueArgs} args - Arguments to find a McpDevice
     * @example
     * // Get one McpDevice
     * const mcpDevice = await prisma.mcpDevice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends McpDeviceFindUniqueArgs>(args: SelectSubset<T, McpDeviceFindUniqueArgs<ExtArgs>>): Prisma__McpDeviceClient<$Result.GetResult<Prisma.$McpDevicePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one McpDevice that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {McpDeviceFindUniqueOrThrowArgs} args - Arguments to find a McpDevice
     * @example
     * // Get one McpDevice
     * const mcpDevice = await prisma.mcpDevice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends McpDeviceFindUniqueOrThrowArgs>(args: SelectSubset<T, McpDeviceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__McpDeviceClient<$Result.GetResult<Prisma.$McpDevicePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first McpDevice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpDeviceFindFirstArgs} args - Arguments to find a McpDevice
     * @example
     * // Get one McpDevice
     * const mcpDevice = await prisma.mcpDevice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends McpDeviceFindFirstArgs>(args?: SelectSubset<T, McpDeviceFindFirstArgs<ExtArgs>>): Prisma__McpDeviceClient<$Result.GetResult<Prisma.$McpDevicePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first McpDevice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpDeviceFindFirstOrThrowArgs} args - Arguments to find a McpDevice
     * @example
     * // Get one McpDevice
     * const mcpDevice = await prisma.mcpDevice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends McpDeviceFindFirstOrThrowArgs>(args?: SelectSubset<T, McpDeviceFindFirstOrThrowArgs<ExtArgs>>): Prisma__McpDeviceClient<$Result.GetResult<Prisma.$McpDevicePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more McpDevices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpDeviceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all McpDevices
     * const mcpDevices = await prisma.mcpDevice.findMany()
     * 
     * // Get first 10 McpDevices
     * const mcpDevices = await prisma.mcpDevice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mcpDeviceWithIdOnly = await prisma.mcpDevice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends McpDeviceFindManyArgs>(args?: SelectSubset<T, McpDeviceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$McpDevicePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a McpDevice.
     * @param {McpDeviceCreateArgs} args - Arguments to create a McpDevice.
     * @example
     * // Create one McpDevice
     * const McpDevice = await prisma.mcpDevice.create({
     *   data: {
     *     // ... data to create a McpDevice
     *   }
     * })
     * 
     */
    create<T extends McpDeviceCreateArgs>(args: SelectSubset<T, McpDeviceCreateArgs<ExtArgs>>): Prisma__McpDeviceClient<$Result.GetResult<Prisma.$McpDevicePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many McpDevices.
     * @param {McpDeviceCreateManyArgs} args - Arguments to create many McpDevices.
     * @example
     * // Create many McpDevices
     * const mcpDevice = await prisma.mcpDevice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends McpDeviceCreateManyArgs>(args?: SelectSubset<T, McpDeviceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many McpDevices and returns the data saved in the database.
     * @param {McpDeviceCreateManyAndReturnArgs} args - Arguments to create many McpDevices.
     * @example
     * // Create many McpDevices
     * const mcpDevice = await prisma.mcpDevice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many McpDevices and only return the `id`
     * const mcpDeviceWithIdOnly = await prisma.mcpDevice.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends McpDeviceCreateManyAndReturnArgs>(args?: SelectSubset<T, McpDeviceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$McpDevicePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a McpDevice.
     * @param {McpDeviceDeleteArgs} args - Arguments to delete one McpDevice.
     * @example
     * // Delete one McpDevice
     * const McpDevice = await prisma.mcpDevice.delete({
     *   where: {
     *     // ... filter to delete one McpDevice
     *   }
     * })
     * 
     */
    delete<T extends McpDeviceDeleteArgs>(args: SelectSubset<T, McpDeviceDeleteArgs<ExtArgs>>): Prisma__McpDeviceClient<$Result.GetResult<Prisma.$McpDevicePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one McpDevice.
     * @param {McpDeviceUpdateArgs} args - Arguments to update one McpDevice.
     * @example
     * // Update one McpDevice
     * const mcpDevice = await prisma.mcpDevice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends McpDeviceUpdateArgs>(args: SelectSubset<T, McpDeviceUpdateArgs<ExtArgs>>): Prisma__McpDeviceClient<$Result.GetResult<Prisma.$McpDevicePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more McpDevices.
     * @param {McpDeviceDeleteManyArgs} args - Arguments to filter McpDevices to delete.
     * @example
     * // Delete a few McpDevices
     * const { count } = await prisma.mcpDevice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends McpDeviceDeleteManyArgs>(args?: SelectSubset<T, McpDeviceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more McpDevices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpDeviceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many McpDevices
     * const mcpDevice = await prisma.mcpDevice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends McpDeviceUpdateManyArgs>(args: SelectSubset<T, McpDeviceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one McpDevice.
     * @param {McpDeviceUpsertArgs} args - Arguments to update or create a McpDevice.
     * @example
     * // Update or create a McpDevice
     * const mcpDevice = await prisma.mcpDevice.upsert({
     *   create: {
     *     // ... data to create a McpDevice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the McpDevice we want to update
     *   }
     * })
     */
    upsert<T extends McpDeviceUpsertArgs>(args: SelectSubset<T, McpDeviceUpsertArgs<ExtArgs>>): Prisma__McpDeviceClient<$Result.GetResult<Prisma.$McpDevicePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of McpDevices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpDeviceCountArgs} args - Arguments to filter McpDevices to count.
     * @example
     * // Count the number of McpDevices
     * const count = await prisma.mcpDevice.count({
     *   where: {
     *     // ... the filter for the McpDevices we want to count
     *   }
     * })
    **/
    count<T extends McpDeviceCountArgs>(
      args?: Subset<T, McpDeviceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], McpDeviceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a McpDevice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpDeviceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends McpDeviceAggregateArgs>(args: Subset<T, McpDeviceAggregateArgs>): Prisma.PrismaPromise<GetMcpDeviceAggregateType<T>>

    /**
     * Group by McpDevice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {McpDeviceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends McpDeviceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: McpDeviceGroupByArgs['orderBy'] }
        : { orderBy?: McpDeviceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, McpDeviceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMcpDeviceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the McpDevice model
   */
  readonly fields: McpDeviceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for McpDevice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__McpDeviceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cabinet<T extends CabinetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CabinetDefaultArgs<ExtArgs>>): Prisma__CabinetClient<$Result.GetResult<Prisma.$CabinetPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    lockCompartments<T extends McpDevice$lockCompartmentsArgs<ExtArgs> = {}>(args?: Subset<T, McpDevice$lockCompartmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompartmentPayload<ExtArgs>, T, "findMany"> | Null>
    sensorCompartments<T extends McpDevice$sensorCompartmentsArgs<ExtArgs> = {}>(args?: Subset<T, McpDevice$sensorCompartmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompartmentPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the McpDevice model
   */ 
  interface McpDeviceFieldRefs {
    readonly id: FieldRef<"McpDevice", 'String'>
    readonly cabinetId: FieldRef<"McpDevice", 'String'>
    readonly bus: FieldRef<"McpDevice", 'Int'>
    readonly address: FieldRef<"McpDevice", 'Int'>
    readonly name: FieldRef<"McpDevice", 'String'>
    readonly createdAt: FieldRef<"McpDevice", 'DateTime'>
    readonly updatedAt: FieldRef<"McpDevice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * McpDevice findUnique
   */
  export type McpDeviceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpDevice
     */
    select?: McpDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpDeviceInclude<ExtArgs> | null
    /**
     * Filter, which McpDevice to fetch.
     */
    where: McpDeviceWhereUniqueInput
  }

  /**
   * McpDevice findUniqueOrThrow
   */
  export type McpDeviceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpDevice
     */
    select?: McpDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpDeviceInclude<ExtArgs> | null
    /**
     * Filter, which McpDevice to fetch.
     */
    where: McpDeviceWhereUniqueInput
  }

  /**
   * McpDevice findFirst
   */
  export type McpDeviceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpDevice
     */
    select?: McpDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpDeviceInclude<ExtArgs> | null
    /**
     * Filter, which McpDevice to fetch.
     */
    where?: McpDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of McpDevices to fetch.
     */
    orderBy?: McpDeviceOrderByWithRelationInput | McpDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for McpDevices.
     */
    cursor?: McpDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` McpDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` McpDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of McpDevices.
     */
    distinct?: McpDeviceScalarFieldEnum | McpDeviceScalarFieldEnum[]
  }

  /**
   * McpDevice findFirstOrThrow
   */
  export type McpDeviceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpDevice
     */
    select?: McpDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpDeviceInclude<ExtArgs> | null
    /**
     * Filter, which McpDevice to fetch.
     */
    where?: McpDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of McpDevices to fetch.
     */
    orderBy?: McpDeviceOrderByWithRelationInput | McpDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for McpDevices.
     */
    cursor?: McpDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` McpDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` McpDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of McpDevices.
     */
    distinct?: McpDeviceScalarFieldEnum | McpDeviceScalarFieldEnum[]
  }

  /**
   * McpDevice findMany
   */
  export type McpDeviceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpDevice
     */
    select?: McpDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpDeviceInclude<ExtArgs> | null
    /**
     * Filter, which McpDevices to fetch.
     */
    where?: McpDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of McpDevices to fetch.
     */
    orderBy?: McpDeviceOrderByWithRelationInput | McpDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing McpDevices.
     */
    cursor?: McpDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` McpDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` McpDevices.
     */
    skip?: number
    distinct?: McpDeviceScalarFieldEnum | McpDeviceScalarFieldEnum[]
  }

  /**
   * McpDevice create
   */
  export type McpDeviceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpDevice
     */
    select?: McpDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpDeviceInclude<ExtArgs> | null
    /**
     * The data needed to create a McpDevice.
     */
    data: XOR<McpDeviceCreateInput, McpDeviceUncheckedCreateInput>
  }

  /**
   * McpDevice createMany
   */
  export type McpDeviceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many McpDevices.
     */
    data: McpDeviceCreateManyInput | McpDeviceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * McpDevice createManyAndReturn
   */
  export type McpDeviceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpDevice
     */
    select?: McpDeviceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many McpDevices.
     */
    data: McpDeviceCreateManyInput | McpDeviceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpDeviceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * McpDevice update
   */
  export type McpDeviceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpDevice
     */
    select?: McpDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpDeviceInclude<ExtArgs> | null
    /**
     * The data needed to update a McpDevice.
     */
    data: XOR<McpDeviceUpdateInput, McpDeviceUncheckedUpdateInput>
    /**
     * Choose, which McpDevice to update.
     */
    where: McpDeviceWhereUniqueInput
  }

  /**
   * McpDevice updateMany
   */
  export type McpDeviceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update McpDevices.
     */
    data: XOR<McpDeviceUpdateManyMutationInput, McpDeviceUncheckedUpdateManyInput>
    /**
     * Filter which McpDevices to update
     */
    where?: McpDeviceWhereInput
  }

  /**
   * McpDevice upsert
   */
  export type McpDeviceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpDevice
     */
    select?: McpDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpDeviceInclude<ExtArgs> | null
    /**
     * The filter to search for the McpDevice to update in case it exists.
     */
    where: McpDeviceWhereUniqueInput
    /**
     * In case the McpDevice found by the `where` argument doesn't exist, create a new McpDevice with this data.
     */
    create: XOR<McpDeviceCreateInput, McpDeviceUncheckedCreateInput>
    /**
     * In case the McpDevice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<McpDeviceUpdateInput, McpDeviceUncheckedUpdateInput>
  }

  /**
   * McpDevice delete
   */
  export type McpDeviceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpDevice
     */
    select?: McpDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpDeviceInclude<ExtArgs> | null
    /**
     * Filter which McpDevice to delete.
     */
    where: McpDeviceWhereUniqueInput
  }

  /**
   * McpDevice deleteMany
   */
  export type McpDeviceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which McpDevices to delete
     */
    where?: McpDeviceWhereInput
  }

  /**
   * McpDevice.lockCompartments
   */
  export type McpDevice$lockCompartmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Compartment
     */
    select?: CompartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentInclude<ExtArgs> | null
    where?: CompartmentWhereInput
    orderBy?: CompartmentOrderByWithRelationInput | CompartmentOrderByWithRelationInput[]
    cursor?: CompartmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CompartmentScalarFieldEnum | CompartmentScalarFieldEnum[]
  }

  /**
   * McpDevice.sensorCompartments
   */
  export type McpDevice$sensorCompartmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Compartment
     */
    select?: CompartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentInclude<ExtArgs> | null
    where?: CompartmentWhereInput
    orderBy?: CompartmentOrderByWithRelationInput | CompartmentOrderByWithRelationInput[]
    cursor?: CompartmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CompartmentScalarFieldEnum | CompartmentScalarFieldEnum[]
  }

  /**
   * McpDevice without action
   */
  export type McpDeviceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpDevice
     */
    select?: McpDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpDeviceInclude<ExtArgs> | null
  }


  /**
   * Model Compartment
   */

  export type AggregateCompartment = {
    _count: CompartmentCountAggregateOutputType | null
    _avg: CompartmentAvgAggregateOutputType | null
    _sum: CompartmentSumAggregateOutputType | null
    _min: CompartmentMinAggregateOutputType | null
    _max: CompartmentMaxAggregateOutputType | null
  }

  export type CompartmentAvgAggregateOutputType = {
    mcp23017PinLock: number | null
    mcp23017PinSensor: number | null
  }

  export type CompartmentSumAggregateOutputType = {
    mcp23017PinLock: number | null
    mcp23017PinSensor: number | null
  }

  export type CompartmentMinAggregateOutputType = {
    id: string | null
    cabinetId: string | null
    name: string | null
    size: $Enums.CompartmentSize | null
    mcp23017PinLock: number | null
    mcp23017PinSensor: number | null
    lockMcpDeviceId: string | null
    sensorMcpDeviceId: string | null
    status: $Enums.CompartmentAvailability | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CompartmentMaxAggregateOutputType = {
    id: string | null
    cabinetId: string | null
    name: string | null
    size: $Enums.CompartmentSize | null
    mcp23017PinLock: number | null
    mcp23017PinSensor: number | null
    lockMcpDeviceId: string | null
    sensorMcpDeviceId: string | null
    status: $Enums.CompartmentAvailability | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CompartmentCountAggregateOutputType = {
    id: number
    cabinetId: number
    name: number
    size: number
    mcp23017PinLock: number
    mcp23017PinSensor: number
    lockMcpDeviceId: number
    sensorMcpDeviceId: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CompartmentAvgAggregateInputType = {
    mcp23017PinLock?: true
    mcp23017PinSensor?: true
  }

  export type CompartmentSumAggregateInputType = {
    mcp23017PinLock?: true
    mcp23017PinSensor?: true
  }

  export type CompartmentMinAggregateInputType = {
    id?: true
    cabinetId?: true
    name?: true
    size?: true
    mcp23017PinLock?: true
    mcp23017PinSensor?: true
    lockMcpDeviceId?: true
    sensorMcpDeviceId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CompartmentMaxAggregateInputType = {
    id?: true
    cabinetId?: true
    name?: true
    size?: true
    mcp23017PinLock?: true
    mcp23017PinSensor?: true
    lockMcpDeviceId?: true
    sensorMcpDeviceId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CompartmentCountAggregateInputType = {
    id?: true
    cabinetId?: true
    name?: true
    size?: true
    mcp23017PinLock?: true
    mcp23017PinSensor?: true
    lockMcpDeviceId?: true
    sensorMcpDeviceId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CompartmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Compartment to aggregate.
     */
    where?: CompartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Compartments to fetch.
     */
    orderBy?: CompartmentOrderByWithRelationInput | CompartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Compartments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Compartments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Compartments
    **/
    _count?: true | CompartmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CompartmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CompartmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompartmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompartmentMaxAggregateInputType
  }

  export type GetCompartmentAggregateType<T extends CompartmentAggregateArgs> = {
        [P in keyof T & keyof AggregateCompartment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompartment[P]>
      : GetScalarType<T[P], AggregateCompartment[P]>
  }




  export type CompartmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompartmentWhereInput
    orderBy?: CompartmentOrderByWithAggregationInput | CompartmentOrderByWithAggregationInput[]
    by: CompartmentScalarFieldEnum[] | CompartmentScalarFieldEnum
    having?: CompartmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompartmentCountAggregateInputType | true
    _avg?: CompartmentAvgAggregateInputType
    _sum?: CompartmentSumAggregateInputType
    _min?: CompartmentMinAggregateInputType
    _max?: CompartmentMaxAggregateInputType
  }

  export type CompartmentGroupByOutputType = {
    id: string
    cabinetId: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    lockMcpDeviceId: string | null
    sensorMcpDeviceId: string | null
    status: $Enums.CompartmentAvailability
    createdAt: Date
    updatedAt: Date
    _count: CompartmentCountAggregateOutputType | null
    _avg: CompartmentAvgAggregateOutputType | null
    _sum: CompartmentSumAggregateOutputType | null
    _min: CompartmentMinAggregateOutputType | null
    _max: CompartmentMaxAggregateOutputType | null
  }

  type GetCompartmentGroupByPayload<T extends CompartmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompartmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompartmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompartmentGroupByOutputType[P]>
            : GetScalarType<T[P], CompartmentGroupByOutputType[P]>
        }
      >
    >


  export type CompartmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cabinetId?: boolean
    name?: boolean
    size?: boolean
    mcp23017PinLock?: boolean
    mcp23017PinSensor?: boolean
    lockMcpDeviceId?: boolean
    sensorMcpDeviceId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cabinet?: boolean | CabinetDefaultArgs<ExtArgs>
    lockMcpDevice?: boolean | Compartment$lockMcpDeviceArgs<ExtArgs>
    sensorMcpDevice?: boolean | Compartment$sensorMcpDeviceArgs<ExtArgs>
    rentals?: boolean | Compartment$rentalsArgs<ExtArgs>
    logs?: boolean | Compartment$logsArgs<ExtArgs>
    realtimeStatus?: boolean | Compartment$realtimeStatusArgs<ExtArgs>
    _count?: boolean | CompartmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["compartment"]>

  export type CompartmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cabinetId?: boolean
    name?: boolean
    size?: boolean
    mcp23017PinLock?: boolean
    mcp23017PinSensor?: boolean
    lockMcpDeviceId?: boolean
    sensorMcpDeviceId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cabinet?: boolean | CabinetDefaultArgs<ExtArgs>
    lockMcpDevice?: boolean | Compartment$lockMcpDeviceArgs<ExtArgs>
    sensorMcpDevice?: boolean | Compartment$sensorMcpDeviceArgs<ExtArgs>
  }, ExtArgs["result"]["compartment"]>

  export type CompartmentSelectScalar = {
    id?: boolean
    cabinetId?: boolean
    name?: boolean
    size?: boolean
    mcp23017PinLock?: boolean
    mcp23017PinSensor?: boolean
    lockMcpDeviceId?: boolean
    sensorMcpDeviceId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CompartmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cabinet?: boolean | CabinetDefaultArgs<ExtArgs>
    lockMcpDevice?: boolean | Compartment$lockMcpDeviceArgs<ExtArgs>
    sensorMcpDevice?: boolean | Compartment$sensorMcpDeviceArgs<ExtArgs>
    rentals?: boolean | Compartment$rentalsArgs<ExtArgs>
    logs?: boolean | Compartment$logsArgs<ExtArgs>
    realtimeStatus?: boolean | Compartment$realtimeStatusArgs<ExtArgs>
    _count?: boolean | CompartmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CompartmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cabinet?: boolean | CabinetDefaultArgs<ExtArgs>
    lockMcpDevice?: boolean | Compartment$lockMcpDeviceArgs<ExtArgs>
    sensorMcpDevice?: boolean | Compartment$sensorMcpDeviceArgs<ExtArgs>
  }

  export type $CompartmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Compartment"
    objects: {
      cabinet: Prisma.$CabinetPayload<ExtArgs>
      lockMcpDevice: Prisma.$McpDevicePayload<ExtArgs> | null
      sensorMcpDevice: Prisma.$McpDevicePayload<ExtArgs> | null
      rentals: Prisma.$RentalPayload<ExtArgs>[]
      logs: Prisma.$LockerLogPayload<ExtArgs>[]
      realtimeStatus: Prisma.$CompartmentStatusPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cabinetId: string
      name: string
      size: $Enums.CompartmentSize
      mcp23017PinLock: number
      mcp23017PinSensor: number
      lockMcpDeviceId: string | null
      sensorMcpDeviceId: string | null
      status: $Enums.CompartmentAvailability
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["compartment"]>
    composites: {}
  }

  type CompartmentGetPayload<S extends boolean | null | undefined | CompartmentDefaultArgs> = $Result.GetResult<Prisma.$CompartmentPayload, S>

  type CompartmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CompartmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CompartmentCountAggregateInputType | true
    }

  export interface CompartmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Compartment'], meta: { name: 'Compartment' } }
    /**
     * Find zero or one Compartment that matches the filter.
     * @param {CompartmentFindUniqueArgs} args - Arguments to find a Compartment
     * @example
     * // Get one Compartment
     * const compartment = await prisma.compartment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompartmentFindUniqueArgs>(args: SelectSubset<T, CompartmentFindUniqueArgs<ExtArgs>>): Prisma__CompartmentClient<$Result.GetResult<Prisma.$CompartmentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Compartment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CompartmentFindUniqueOrThrowArgs} args - Arguments to find a Compartment
     * @example
     * // Get one Compartment
     * const compartment = await prisma.compartment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompartmentFindUniqueOrThrowArgs>(args: SelectSubset<T, CompartmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompartmentClient<$Result.GetResult<Prisma.$CompartmentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Compartment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompartmentFindFirstArgs} args - Arguments to find a Compartment
     * @example
     * // Get one Compartment
     * const compartment = await prisma.compartment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompartmentFindFirstArgs>(args?: SelectSubset<T, CompartmentFindFirstArgs<ExtArgs>>): Prisma__CompartmentClient<$Result.GetResult<Prisma.$CompartmentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Compartment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompartmentFindFirstOrThrowArgs} args - Arguments to find a Compartment
     * @example
     * // Get one Compartment
     * const compartment = await prisma.compartment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompartmentFindFirstOrThrowArgs>(args?: SelectSubset<T, CompartmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompartmentClient<$Result.GetResult<Prisma.$CompartmentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Compartments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompartmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Compartments
     * const compartments = await prisma.compartment.findMany()
     * 
     * // Get first 10 Compartments
     * const compartments = await prisma.compartment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const compartmentWithIdOnly = await prisma.compartment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompartmentFindManyArgs>(args?: SelectSubset<T, CompartmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompartmentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Compartment.
     * @param {CompartmentCreateArgs} args - Arguments to create a Compartment.
     * @example
     * // Create one Compartment
     * const Compartment = await prisma.compartment.create({
     *   data: {
     *     // ... data to create a Compartment
     *   }
     * })
     * 
     */
    create<T extends CompartmentCreateArgs>(args: SelectSubset<T, CompartmentCreateArgs<ExtArgs>>): Prisma__CompartmentClient<$Result.GetResult<Prisma.$CompartmentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Compartments.
     * @param {CompartmentCreateManyArgs} args - Arguments to create many Compartments.
     * @example
     * // Create many Compartments
     * const compartment = await prisma.compartment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompartmentCreateManyArgs>(args?: SelectSubset<T, CompartmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Compartments and returns the data saved in the database.
     * @param {CompartmentCreateManyAndReturnArgs} args - Arguments to create many Compartments.
     * @example
     * // Create many Compartments
     * const compartment = await prisma.compartment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Compartments and only return the `id`
     * const compartmentWithIdOnly = await prisma.compartment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CompartmentCreateManyAndReturnArgs>(args?: SelectSubset<T, CompartmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompartmentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Compartment.
     * @param {CompartmentDeleteArgs} args - Arguments to delete one Compartment.
     * @example
     * // Delete one Compartment
     * const Compartment = await prisma.compartment.delete({
     *   where: {
     *     // ... filter to delete one Compartment
     *   }
     * })
     * 
     */
    delete<T extends CompartmentDeleteArgs>(args: SelectSubset<T, CompartmentDeleteArgs<ExtArgs>>): Prisma__CompartmentClient<$Result.GetResult<Prisma.$CompartmentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Compartment.
     * @param {CompartmentUpdateArgs} args - Arguments to update one Compartment.
     * @example
     * // Update one Compartment
     * const compartment = await prisma.compartment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompartmentUpdateArgs>(args: SelectSubset<T, CompartmentUpdateArgs<ExtArgs>>): Prisma__CompartmentClient<$Result.GetResult<Prisma.$CompartmentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Compartments.
     * @param {CompartmentDeleteManyArgs} args - Arguments to filter Compartments to delete.
     * @example
     * // Delete a few Compartments
     * const { count } = await prisma.compartment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompartmentDeleteManyArgs>(args?: SelectSubset<T, CompartmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Compartments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompartmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Compartments
     * const compartment = await prisma.compartment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompartmentUpdateManyArgs>(args: SelectSubset<T, CompartmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Compartment.
     * @param {CompartmentUpsertArgs} args - Arguments to update or create a Compartment.
     * @example
     * // Update or create a Compartment
     * const compartment = await prisma.compartment.upsert({
     *   create: {
     *     // ... data to create a Compartment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Compartment we want to update
     *   }
     * })
     */
    upsert<T extends CompartmentUpsertArgs>(args: SelectSubset<T, CompartmentUpsertArgs<ExtArgs>>): Prisma__CompartmentClient<$Result.GetResult<Prisma.$CompartmentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Compartments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompartmentCountArgs} args - Arguments to filter Compartments to count.
     * @example
     * // Count the number of Compartments
     * const count = await prisma.compartment.count({
     *   where: {
     *     // ... the filter for the Compartments we want to count
     *   }
     * })
    **/
    count<T extends CompartmentCountArgs>(
      args?: Subset<T, CompartmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompartmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Compartment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompartmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CompartmentAggregateArgs>(args: Subset<T, CompartmentAggregateArgs>): Prisma.PrismaPromise<GetCompartmentAggregateType<T>>

    /**
     * Group by Compartment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompartmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CompartmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompartmentGroupByArgs['orderBy'] }
        : { orderBy?: CompartmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CompartmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompartmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Compartment model
   */
  readonly fields: CompartmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Compartment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompartmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cabinet<T extends CabinetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CabinetDefaultArgs<ExtArgs>>): Prisma__CabinetClient<$Result.GetResult<Prisma.$CabinetPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    lockMcpDevice<T extends Compartment$lockMcpDeviceArgs<ExtArgs> = {}>(args?: Subset<T, Compartment$lockMcpDeviceArgs<ExtArgs>>): Prisma__McpDeviceClient<$Result.GetResult<Prisma.$McpDevicePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    sensorMcpDevice<T extends Compartment$sensorMcpDeviceArgs<ExtArgs> = {}>(args?: Subset<T, Compartment$sensorMcpDeviceArgs<ExtArgs>>): Prisma__McpDeviceClient<$Result.GetResult<Prisma.$McpDevicePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    rentals<T extends Compartment$rentalsArgs<ExtArgs> = {}>(args?: Subset<T, Compartment$rentalsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "findMany"> | Null>
    logs<T extends Compartment$logsArgs<ExtArgs> = {}>(args?: Subset<T, Compartment$logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LockerLogPayload<ExtArgs>, T, "findMany"> | Null>
    realtimeStatus<T extends Compartment$realtimeStatusArgs<ExtArgs> = {}>(args?: Subset<T, Compartment$realtimeStatusArgs<ExtArgs>>): Prisma__CompartmentStatusClient<$Result.GetResult<Prisma.$CompartmentStatusPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Compartment model
   */ 
  interface CompartmentFieldRefs {
    readonly id: FieldRef<"Compartment", 'String'>
    readonly cabinetId: FieldRef<"Compartment", 'String'>
    readonly name: FieldRef<"Compartment", 'String'>
    readonly size: FieldRef<"Compartment", 'CompartmentSize'>
    readonly mcp23017PinLock: FieldRef<"Compartment", 'Int'>
    readonly mcp23017PinSensor: FieldRef<"Compartment", 'Int'>
    readonly lockMcpDeviceId: FieldRef<"Compartment", 'String'>
    readonly sensorMcpDeviceId: FieldRef<"Compartment", 'String'>
    readonly status: FieldRef<"Compartment", 'CompartmentAvailability'>
    readonly createdAt: FieldRef<"Compartment", 'DateTime'>
    readonly updatedAt: FieldRef<"Compartment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Compartment findUnique
   */
  export type CompartmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Compartment
     */
    select?: CompartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentInclude<ExtArgs> | null
    /**
     * Filter, which Compartment to fetch.
     */
    where: CompartmentWhereUniqueInput
  }

  /**
   * Compartment findUniqueOrThrow
   */
  export type CompartmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Compartment
     */
    select?: CompartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentInclude<ExtArgs> | null
    /**
     * Filter, which Compartment to fetch.
     */
    where: CompartmentWhereUniqueInput
  }

  /**
   * Compartment findFirst
   */
  export type CompartmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Compartment
     */
    select?: CompartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentInclude<ExtArgs> | null
    /**
     * Filter, which Compartment to fetch.
     */
    where?: CompartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Compartments to fetch.
     */
    orderBy?: CompartmentOrderByWithRelationInput | CompartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Compartments.
     */
    cursor?: CompartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Compartments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Compartments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Compartments.
     */
    distinct?: CompartmentScalarFieldEnum | CompartmentScalarFieldEnum[]
  }

  /**
   * Compartment findFirstOrThrow
   */
  export type CompartmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Compartment
     */
    select?: CompartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentInclude<ExtArgs> | null
    /**
     * Filter, which Compartment to fetch.
     */
    where?: CompartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Compartments to fetch.
     */
    orderBy?: CompartmentOrderByWithRelationInput | CompartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Compartments.
     */
    cursor?: CompartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Compartments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Compartments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Compartments.
     */
    distinct?: CompartmentScalarFieldEnum | CompartmentScalarFieldEnum[]
  }

  /**
   * Compartment findMany
   */
  export type CompartmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Compartment
     */
    select?: CompartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentInclude<ExtArgs> | null
    /**
     * Filter, which Compartments to fetch.
     */
    where?: CompartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Compartments to fetch.
     */
    orderBy?: CompartmentOrderByWithRelationInput | CompartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Compartments.
     */
    cursor?: CompartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Compartments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Compartments.
     */
    skip?: number
    distinct?: CompartmentScalarFieldEnum | CompartmentScalarFieldEnum[]
  }

  /**
   * Compartment create
   */
  export type CompartmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Compartment
     */
    select?: CompartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Compartment.
     */
    data: XOR<CompartmentCreateInput, CompartmentUncheckedCreateInput>
  }

  /**
   * Compartment createMany
   */
  export type CompartmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Compartments.
     */
    data: CompartmentCreateManyInput | CompartmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Compartment createManyAndReturn
   */
  export type CompartmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Compartment
     */
    select?: CompartmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Compartments.
     */
    data: CompartmentCreateManyInput | CompartmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Compartment update
   */
  export type CompartmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Compartment
     */
    select?: CompartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Compartment.
     */
    data: XOR<CompartmentUpdateInput, CompartmentUncheckedUpdateInput>
    /**
     * Choose, which Compartment to update.
     */
    where: CompartmentWhereUniqueInput
  }

  /**
   * Compartment updateMany
   */
  export type CompartmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Compartments.
     */
    data: XOR<CompartmentUpdateManyMutationInput, CompartmentUncheckedUpdateManyInput>
    /**
     * Filter which Compartments to update
     */
    where?: CompartmentWhereInput
  }

  /**
   * Compartment upsert
   */
  export type CompartmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Compartment
     */
    select?: CompartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Compartment to update in case it exists.
     */
    where: CompartmentWhereUniqueInput
    /**
     * In case the Compartment found by the `where` argument doesn't exist, create a new Compartment with this data.
     */
    create: XOR<CompartmentCreateInput, CompartmentUncheckedCreateInput>
    /**
     * In case the Compartment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompartmentUpdateInput, CompartmentUncheckedUpdateInput>
  }

  /**
   * Compartment delete
   */
  export type CompartmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Compartment
     */
    select?: CompartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentInclude<ExtArgs> | null
    /**
     * Filter which Compartment to delete.
     */
    where: CompartmentWhereUniqueInput
  }

  /**
   * Compartment deleteMany
   */
  export type CompartmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Compartments to delete
     */
    where?: CompartmentWhereInput
  }

  /**
   * Compartment.lockMcpDevice
   */
  export type Compartment$lockMcpDeviceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpDevice
     */
    select?: McpDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpDeviceInclude<ExtArgs> | null
    where?: McpDeviceWhereInput
  }

  /**
   * Compartment.sensorMcpDevice
   */
  export type Compartment$sensorMcpDeviceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the McpDevice
     */
    select?: McpDeviceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: McpDeviceInclude<ExtArgs> | null
    where?: McpDeviceWhereInput
  }

  /**
   * Compartment.rentals
   */
  export type Compartment$rentalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    where?: RentalWhereInput
    orderBy?: RentalOrderByWithRelationInput | RentalOrderByWithRelationInput[]
    cursor?: RentalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RentalScalarFieldEnum | RentalScalarFieldEnum[]
  }

  /**
   * Compartment.logs
   */
  export type Compartment$logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LockerLog
     */
    select?: LockerLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LockerLogInclude<ExtArgs> | null
    where?: LockerLogWhereInput
    orderBy?: LockerLogOrderByWithRelationInput | LockerLogOrderByWithRelationInput[]
    cursor?: LockerLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LockerLogScalarFieldEnum | LockerLogScalarFieldEnum[]
  }

  /**
   * Compartment.realtimeStatus
   */
  export type Compartment$realtimeStatusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompartmentStatus
     */
    select?: CompartmentStatusSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentStatusInclude<ExtArgs> | null
    where?: CompartmentStatusWhereInput
  }

  /**
   * Compartment without action
   */
  export type CompartmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Compartment
     */
    select?: CompartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentInclude<ExtArgs> | null
  }


  /**
   * Model CompartmentStatus
   */

  export type AggregateCompartmentStatus = {
    _count: CompartmentStatusCountAggregateOutputType | null
    _min: CompartmentStatusMinAggregateOutputType | null
    _max: CompartmentStatusMaxAggregateOutputType | null
  }

  export type CompartmentStatusMinAggregateOutputType = {
    id: string | null
    compartmentId: string | null
    lockStatus: $Enums.LockStatus | null
    doorStatus: $Enums.DoorStatus | null
    lastUpdatedAt: Date | null
  }

  export type CompartmentStatusMaxAggregateOutputType = {
    id: string | null
    compartmentId: string | null
    lockStatus: $Enums.LockStatus | null
    doorStatus: $Enums.DoorStatus | null
    lastUpdatedAt: Date | null
  }

  export type CompartmentStatusCountAggregateOutputType = {
    id: number
    compartmentId: number
    lockStatus: number
    doorStatus: number
    lastUpdatedAt: number
    _all: number
  }


  export type CompartmentStatusMinAggregateInputType = {
    id?: true
    compartmentId?: true
    lockStatus?: true
    doorStatus?: true
    lastUpdatedAt?: true
  }

  export type CompartmentStatusMaxAggregateInputType = {
    id?: true
    compartmentId?: true
    lockStatus?: true
    doorStatus?: true
    lastUpdatedAt?: true
  }

  export type CompartmentStatusCountAggregateInputType = {
    id?: true
    compartmentId?: true
    lockStatus?: true
    doorStatus?: true
    lastUpdatedAt?: true
    _all?: true
  }

  export type CompartmentStatusAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CompartmentStatus to aggregate.
     */
    where?: CompartmentStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompartmentStatuses to fetch.
     */
    orderBy?: CompartmentStatusOrderByWithRelationInput | CompartmentStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompartmentStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompartmentStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompartmentStatuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CompartmentStatuses
    **/
    _count?: true | CompartmentStatusCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompartmentStatusMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompartmentStatusMaxAggregateInputType
  }

  export type GetCompartmentStatusAggregateType<T extends CompartmentStatusAggregateArgs> = {
        [P in keyof T & keyof AggregateCompartmentStatus]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompartmentStatus[P]>
      : GetScalarType<T[P], AggregateCompartmentStatus[P]>
  }




  export type CompartmentStatusGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompartmentStatusWhereInput
    orderBy?: CompartmentStatusOrderByWithAggregationInput | CompartmentStatusOrderByWithAggregationInput[]
    by: CompartmentStatusScalarFieldEnum[] | CompartmentStatusScalarFieldEnum
    having?: CompartmentStatusScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompartmentStatusCountAggregateInputType | true
    _min?: CompartmentStatusMinAggregateInputType
    _max?: CompartmentStatusMaxAggregateInputType
  }

  export type CompartmentStatusGroupByOutputType = {
    id: string
    compartmentId: string
    lockStatus: $Enums.LockStatus
    doorStatus: $Enums.DoorStatus
    lastUpdatedAt: Date
    _count: CompartmentStatusCountAggregateOutputType | null
    _min: CompartmentStatusMinAggregateOutputType | null
    _max: CompartmentStatusMaxAggregateOutputType | null
  }

  type GetCompartmentStatusGroupByPayload<T extends CompartmentStatusGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompartmentStatusGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompartmentStatusGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompartmentStatusGroupByOutputType[P]>
            : GetScalarType<T[P], CompartmentStatusGroupByOutputType[P]>
        }
      >
    >


  export type CompartmentStatusSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    compartmentId?: boolean
    lockStatus?: boolean
    doorStatus?: boolean
    lastUpdatedAt?: boolean
    compartment?: boolean | CompartmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["compartmentStatus"]>

  export type CompartmentStatusSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    compartmentId?: boolean
    lockStatus?: boolean
    doorStatus?: boolean
    lastUpdatedAt?: boolean
    compartment?: boolean | CompartmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["compartmentStatus"]>

  export type CompartmentStatusSelectScalar = {
    id?: boolean
    compartmentId?: boolean
    lockStatus?: boolean
    doorStatus?: boolean
    lastUpdatedAt?: boolean
  }

  export type CompartmentStatusInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    compartment?: boolean | CompartmentDefaultArgs<ExtArgs>
  }
  export type CompartmentStatusIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    compartment?: boolean | CompartmentDefaultArgs<ExtArgs>
  }

  export type $CompartmentStatusPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CompartmentStatus"
    objects: {
      compartment: Prisma.$CompartmentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      compartmentId: string
      lockStatus: $Enums.LockStatus
      doorStatus: $Enums.DoorStatus
      lastUpdatedAt: Date
    }, ExtArgs["result"]["compartmentStatus"]>
    composites: {}
  }

  type CompartmentStatusGetPayload<S extends boolean | null | undefined | CompartmentStatusDefaultArgs> = $Result.GetResult<Prisma.$CompartmentStatusPayload, S>

  type CompartmentStatusCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CompartmentStatusFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CompartmentStatusCountAggregateInputType | true
    }

  export interface CompartmentStatusDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CompartmentStatus'], meta: { name: 'CompartmentStatus' } }
    /**
     * Find zero or one CompartmentStatus that matches the filter.
     * @param {CompartmentStatusFindUniqueArgs} args - Arguments to find a CompartmentStatus
     * @example
     * // Get one CompartmentStatus
     * const compartmentStatus = await prisma.compartmentStatus.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompartmentStatusFindUniqueArgs>(args: SelectSubset<T, CompartmentStatusFindUniqueArgs<ExtArgs>>): Prisma__CompartmentStatusClient<$Result.GetResult<Prisma.$CompartmentStatusPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CompartmentStatus that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CompartmentStatusFindUniqueOrThrowArgs} args - Arguments to find a CompartmentStatus
     * @example
     * // Get one CompartmentStatus
     * const compartmentStatus = await prisma.compartmentStatus.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompartmentStatusFindUniqueOrThrowArgs>(args: SelectSubset<T, CompartmentStatusFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompartmentStatusClient<$Result.GetResult<Prisma.$CompartmentStatusPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CompartmentStatus that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompartmentStatusFindFirstArgs} args - Arguments to find a CompartmentStatus
     * @example
     * // Get one CompartmentStatus
     * const compartmentStatus = await prisma.compartmentStatus.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompartmentStatusFindFirstArgs>(args?: SelectSubset<T, CompartmentStatusFindFirstArgs<ExtArgs>>): Prisma__CompartmentStatusClient<$Result.GetResult<Prisma.$CompartmentStatusPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CompartmentStatus that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompartmentStatusFindFirstOrThrowArgs} args - Arguments to find a CompartmentStatus
     * @example
     * // Get one CompartmentStatus
     * const compartmentStatus = await prisma.compartmentStatus.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompartmentStatusFindFirstOrThrowArgs>(args?: SelectSubset<T, CompartmentStatusFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompartmentStatusClient<$Result.GetResult<Prisma.$CompartmentStatusPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CompartmentStatuses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompartmentStatusFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CompartmentStatuses
     * const compartmentStatuses = await prisma.compartmentStatus.findMany()
     * 
     * // Get first 10 CompartmentStatuses
     * const compartmentStatuses = await prisma.compartmentStatus.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const compartmentStatusWithIdOnly = await prisma.compartmentStatus.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompartmentStatusFindManyArgs>(args?: SelectSubset<T, CompartmentStatusFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompartmentStatusPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CompartmentStatus.
     * @param {CompartmentStatusCreateArgs} args - Arguments to create a CompartmentStatus.
     * @example
     * // Create one CompartmentStatus
     * const CompartmentStatus = await prisma.compartmentStatus.create({
     *   data: {
     *     // ... data to create a CompartmentStatus
     *   }
     * })
     * 
     */
    create<T extends CompartmentStatusCreateArgs>(args: SelectSubset<T, CompartmentStatusCreateArgs<ExtArgs>>): Prisma__CompartmentStatusClient<$Result.GetResult<Prisma.$CompartmentStatusPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CompartmentStatuses.
     * @param {CompartmentStatusCreateManyArgs} args - Arguments to create many CompartmentStatuses.
     * @example
     * // Create many CompartmentStatuses
     * const compartmentStatus = await prisma.compartmentStatus.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompartmentStatusCreateManyArgs>(args?: SelectSubset<T, CompartmentStatusCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CompartmentStatuses and returns the data saved in the database.
     * @param {CompartmentStatusCreateManyAndReturnArgs} args - Arguments to create many CompartmentStatuses.
     * @example
     * // Create many CompartmentStatuses
     * const compartmentStatus = await prisma.compartmentStatus.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CompartmentStatuses and only return the `id`
     * const compartmentStatusWithIdOnly = await prisma.compartmentStatus.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CompartmentStatusCreateManyAndReturnArgs>(args?: SelectSubset<T, CompartmentStatusCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompartmentStatusPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CompartmentStatus.
     * @param {CompartmentStatusDeleteArgs} args - Arguments to delete one CompartmentStatus.
     * @example
     * // Delete one CompartmentStatus
     * const CompartmentStatus = await prisma.compartmentStatus.delete({
     *   where: {
     *     // ... filter to delete one CompartmentStatus
     *   }
     * })
     * 
     */
    delete<T extends CompartmentStatusDeleteArgs>(args: SelectSubset<T, CompartmentStatusDeleteArgs<ExtArgs>>): Prisma__CompartmentStatusClient<$Result.GetResult<Prisma.$CompartmentStatusPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CompartmentStatus.
     * @param {CompartmentStatusUpdateArgs} args - Arguments to update one CompartmentStatus.
     * @example
     * // Update one CompartmentStatus
     * const compartmentStatus = await prisma.compartmentStatus.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompartmentStatusUpdateArgs>(args: SelectSubset<T, CompartmentStatusUpdateArgs<ExtArgs>>): Prisma__CompartmentStatusClient<$Result.GetResult<Prisma.$CompartmentStatusPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CompartmentStatuses.
     * @param {CompartmentStatusDeleteManyArgs} args - Arguments to filter CompartmentStatuses to delete.
     * @example
     * // Delete a few CompartmentStatuses
     * const { count } = await prisma.compartmentStatus.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompartmentStatusDeleteManyArgs>(args?: SelectSubset<T, CompartmentStatusDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CompartmentStatuses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompartmentStatusUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CompartmentStatuses
     * const compartmentStatus = await prisma.compartmentStatus.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompartmentStatusUpdateManyArgs>(args: SelectSubset<T, CompartmentStatusUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CompartmentStatus.
     * @param {CompartmentStatusUpsertArgs} args - Arguments to update or create a CompartmentStatus.
     * @example
     * // Update or create a CompartmentStatus
     * const compartmentStatus = await prisma.compartmentStatus.upsert({
     *   create: {
     *     // ... data to create a CompartmentStatus
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CompartmentStatus we want to update
     *   }
     * })
     */
    upsert<T extends CompartmentStatusUpsertArgs>(args: SelectSubset<T, CompartmentStatusUpsertArgs<ExtArgs>>): Prisma__CompartmentStatusClient<$Result.GetResult<Prisma.$CompartmentStatusPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CompartmentStatuses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompartmentStatusCountArgs} args - Arguments to filter CompartmentStatuses to count.
     * @example
     * // Count the number of CompartmentStatuses
     * const count = await prisma.compartmentStatus.count({
     *   where: {
     *     // ... the filter for the CompartmentStatuses we want to count
     *   }
     * })
    **/
    count<T extends CompartmentStatusCountArgs>(
      args?: Subset<T, CompartmentStatusCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompartmentStatusCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CompartmentStatus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompartmentStatusAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CompartmentStatusAggregateArgs>(args: Subset<T, CompartmentStatusAggregateArgs>): Prisma.PrismaPromise<GetCompartmentStatusAggregateType<T>>

    /**
     * Group by CompartmentStatus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompartmentStatusGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CompartmentStatusGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompartmentStatusGroupByArgs['orderBy'] }
        : { orderBy?: CompartmentStatusGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CompartmentStatusGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompartmentStatusGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CompartmentStatus model
   */
  readonly fields: CompartmentStatusFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CompartmentStatus.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompartmentStatusClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    compartment<T extends CompartmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompartmentDefaultArgs<ExtArgs>>): Prisma__CompartmentClient<$Result.GetResult<Prisma.$CompartmentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CompartmentStatus model
   */ 
  interface CompartmentStatusFieldRefs {
    readonly id: FieldRef<"CompartmentStatus", 'String'>
    readonly compartmentId: FieldRef<"CompartmentStatus", 'String'>
    readonly lockStatus: FieldRef<"CompartmentStatus", 'LockStatus'>
    readonly doorStatus: FieldRef<"CompartmentStatus", 'DoorStatus'>
    readonly lastUpdatedAt: FieldRef<"CompartmentStatus", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CompartmentStatus findUnique
   */
  export type CompartmentStatusFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompartmentStatus
     */
    select?: CompartmentStatusSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentStatusInclude<ExtArgs> | null
    /**
     * Filter, which CompartmentStatus to fetch.
     */
    where: CompartmentStatusWhereUniqueInput
  }

  /**
   * CompartmentStatus findUniqueOrThrow
   */
  export type CompartmentStatusFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompartmentStatus
     */
    select?: CompartmentStatusSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentStatusInclude<ExtArgs> | null
    /**
     * Filter, which CompartmentStatus to fetch.
     */
    where: CompartmentStatusWhereUniqueInput
  }

  /**
   * CompartmentStatus findFirst
   */
  export type CompartmentStatusFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompartmentStatus
     */
    select?: CompartmentStatusSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentStatusInclude<ExtArgs> | null
    /**
     * Filter, which CompartmentStatus to fetch.
     */
    where?: CompartmentStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompartmentStatuses to fetch.
     */
    orderBy?: CompartmentStatusOrderByWithRelationInput | CompartmentStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CompartmentStatuses.
     */
    cursor?: CompartmentStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompartmentStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompartmentStatuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompartmentStatuses.
     */
    distinct?: CompartmentStatusScalarFieldEnum | CompartmentStatusScalarFieldEnum[]
  }

  /**
   * CompartmentStatus findFirstOrThrow
   */
  export type CompartmentStatusFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompartmentStatus
     */
    select?: CompartmentStatusSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentStatusInclude<ExtArgs> | null
    /**
     * Filter, which CompartmentStatus to fetch.
     */
    where?: CompartmentStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompartmentStatuses to fetch.
     */
    orderBy?: CompartmentStatusOrderByWithRelationInput | CompartmentStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CompartmentStatuses.
     */
    cursor?: CompartmentStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompartmentStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompartmentStatuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompartmentStatuses.
     */
    distinct?: CompartmentStatusScalarFieldEnum | CompartmentStatusScalarFieldEnum[]
  }

  /**
   * CompartmentStatus findMany
   */
  export type CompartmentStatusFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompartmentStatus
     */
    select?: CompartmentStatusSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentStatusInclude<ExtArgs> | null
    /**
     * Filter, which CompartmentStatuses to fetch.
     */
    where?: CompartmentStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompartmentStatuses to fetch.
     */
    orderBy?: CompartmentStatusOrderByWithRelationInput | CompartmentStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CompartmentStatuses.
     */
    cursor?: CompartmentStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompartmentStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompartmentStatuses.
     */
    skip?: number
    distinct?: CompartmentStatusScalarFieldEnum | CompartmentStatusScalarFieldEnum[]
  }

  /**
   * CompartmentStatus create
   */
  export type CompartmentStatusCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompartmentStatus
     */
    select?: CompartmentStatusSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentStatusInclude<ExtArgs> | null
    /**
     * The data needed to create a CompartmentStatus.
     */
    data: XOR<CompartmentStatusCreateInput, CompartmentStatusUncheckedCreateInput>
  }

  /**
   * CompartmentStatus createMany
   */
  export type CompartmentStatusCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CompartmentStatuses.
     */
    data: CompartmentStatusCreateManyInput | CompartmentStatusCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CompartmentStatus createManyAndReturn
   */
  export type CompartmentStatusCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompartmentStatus
     */
    select?: CompartmentStatusSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CompartmentStatuses.
     */
    data: CompartmentStatusCreateManyInput | CompartmentStatusCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentStatusIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CompartmentStatus update
   */
  export type CompartmentStatusUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompartmentStatus
     */
    select?: CompartmentStatusSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentStatusInclude<ExtArgs> | null
    /**
     * The data needed to update a CompartmentStatus.
     */
    data: XOR<CompartmentStatusUpdateInput, CompartmentStatusUncheckedUpdateInput>
    /**
     * Choose, which CompartmentStatus to update.
     */
    where: CompartmentStatusWhereUniqueInput
  }

  /**
   * CompartmentStatus updateMany
   */
  export type CompartmentStatusUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CompartmentStatuses.
     */
    data: XOR<CompartmentStatusUpdateManyMutationInput, CompartmentStatusUncheckedUpdateManyInput>
    /**
     * Filter which CompartmentStatuses to update
     */
    where?: CompartmentStatusWhereInput
  }

  /**
   * CompartmentStatus upsert
   */
  export type CompartmentStatusUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompartmentStatus
     */
    select?: CompartmentStatusSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentStatusInclude<ExtArgs> | null
    /**
     * The filter to search for the CompartmentStatus to update in case it exists.
     */
    where: CompartmentStatusWhereUniqueInput
    /**
     * In case the CompartmentStatus found by the `where` argument doesn't exist, create a new CompartmentStatus with this data.
     */
    create: XOR<CompartmentStatusCreateInput, CompartmentStatusUncheckedCreateInput>
    /**
     * In case the CompartmentStatus was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompartmentStatusUpdateInput, CompartmentStatusUncheckedUpdateInput>
  }

  /**
   * CompartmentStatus delete
   */
  export type CompartmentStatusDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompartmentStatus
     */
    select?: CompartmentStatusSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentStatusInclude<ExtArgs> | null
    /**
     * Filter which CompartmentStatus to delete.
     */
    where: CompartmentStatusWhereUniqueInput
  }

  /**
   * CompartmentStatus deleteMany
   */
  export type CompartmentStatusDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CompartmentStatuses to delete
     */
    where?: CompartmentStatusWhereInput
  }

  /**
   * CompartmentStatus without action
   */
  export type CompartmentStatusDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompartmentStatus
     */
    select?: CompartmentStatusSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentStatusInclude<ExtArgs> | null
  }


  /**
   * Model PricePlan
   */

  export type AggregatePricePlan = {
    _count: PricePlanCountAggregateOutputType | null
    _avg: PricePlanAvgAggregateOutputType | null
    _sum: PricePlanSumAggregateOutputType | null
    _min: PricePlanMinAggregateOutputType | null
    _max: PricePlanMaxAggregateOutputType | null
  }

  export type PricePlanAvgAggregateOutputType = {
    price: number | null
    maxOpens: number | null
    durationDays: number | null
  }

  export type PricePlanSumAggregateOutputType = {
    price: number | null
    maxOpens: number | null
    durationDays: number | null
  }

  export type PricePlanMinAggregateOutputType = {
    id: string | null
    name: string | null
    size: $Enums.CompartmentSize | null
    rentalType: $Enums.RentalType | null
    price: number | null
    maxOpens: number | null
    durationDays: number | null
    description: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PricePlanMaxAggregateOutputType = {
    id: string | null
    name: string | null
    size: $Enums.CompartmentSize | null
    rentalType: $Enums.RentalType | null
    price: number | null
    maxOpens: number | null
    durationDays: number | null
    description: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PricePlanCountAggregateOutputType = {
    id: number
    name: number
    size: number
    rentalType: number
    price: number
    maxOpens: number
    durationDays: number
    description: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PricePlanAvgAggregateInputType = {
    price?: true
    maxOpens?: true
    durationDays?: true
  }

  export type PricePlanSumAggregateInputType = {
    price?: true
    maxOpens?: true
    durationDays?: true
  }

  export type PricePlanMinAggregateInputType = {
    id?: true
    name?: true
    size?: true
    rentalType?: true
    price?: true
    maxOpens?: true
    durationDays?: true
    description?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PricePlanMaxAggregateInputType = {
    id?: true
    name?: true
    size?: true
    rentalType?: true
    price?: true
    maxOpens?: true
    durationDays?: true
    description?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PricePlanCountAggregateInputType = {
    id?: true
    name?: true
    size?: true
    rentalType?: true
    price?: true
    maxOpens?: true
    durationDays?: true
    description?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PricePlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PricePlan to aggregate.
     */
    where?: PricePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PricePlans to fetch.
     */
    orderBy?: PricePlanOrderByWithRelationInput | PricePlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PricePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PricePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PricePlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PricePlans
    **/
    _count?: true | PricePlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PricePlanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PricePlanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PricePlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PricePlanMaxAggregateInputType
  }

  export type GetPricePlanAggregateType<T extends PricePlanAggregateArgs> = {
        [P in keyof T & keyof AggregatePricePlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePricePlan[P]>
      : GetScalarType<T[P], AggregatePricePlan[P]>
  }




  export type PricePlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PricePlanWhereInput
    orderBy?: PricePlanOrderByWithAggregationInput | PricePlanOrderByWithAggregationInput[]
    by: PricePlanScalarFieldEnum[] | PricePlanScalarFieldEnum
    having?: PricePlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PricePlanCountAggregateInputType | true
    _avg?: PricePlanAvgAggregateInputType
    _sum?: PricePlanSumAggregateInputType
    _min?: PricePlanMinAggregateInputType
    _max?: PricePlanMaxAggregateInputType
  }

  export type PricePlanGroupByOutputType = {
    id: string
    name: string
    size: $Enums.CompartmentSize
    rentalType: $Enums.RentalType
    price: number
    maxOpens: number | null
    durationDays: number
    description: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: PricePlanCountAggregateOutputType | null
    _avg: PricePlanAvgAggregateOutputType | null
    _sum: PricePlanSumAggregateOutputType | null
    _min: PricePlanMinAggregateOutputType | null
    _max: PricePlanMaxAggregateOutputType | null
  }

  type GetPricePlanGroupByPayload<T extends PricePlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PricePlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PricePlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PricePlanGroupByOutputType[P]>
            : GetScalarType<T[P], PricePlanGroupByOutputType[P]>
        }
      >
    >


  export type PricePlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    size?: boolean
    rentalType?: boolean
    price?: boolean
    maxOpens?: boolean
    durationDays?: boolean
    description?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    rentals?: boolean | PricePlan$rentalsArgs<ExtArgs>
    _count?: boolean | PricePlanCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pricePlan"]>

  export type PricePlanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    size?: boolean
    rentalType?: boolean
    price?: boolean
    maxOpens?: boolean
    durationDays?: boolean
    description?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["pricePlan"]>

  export type PricePlanSelectScalar = {
    id?: boolean
    name?: boolean
    size?: boolean
    rentalType?: boolean
    price?: boolean
    maxOpens?: boolean
    durationDays?: boolean
    description?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PricePlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rentals?: boolean | PricePlan$rentalsArgs<ExtArgs>
    _count?: boolean | PricePlanCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PricePlanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PricePlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PricePlan"
    objects: {
      rentals: Prisma.$RentalPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      size: $Enums.CompartmentSize
      rentalType: $Enums.RentalType
      price: number
      maxOpens: number | null
      durationDays: number
      description: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["pricePlan"]>
    composites: {}
  }

  type PricePlanGetPayload<S extends boolean | null | undefined | PricePlanDefaultArgs> = $Result.GetResult<Prisma.$PricePlanPayload, S>

  type PricePlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PricePlanFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PricePlanCountAggregateInputType | true
    }

  export interface PricePlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PricePlan'], meta: { name: 'PricePlan' } }
    /**
     * Find zero or one PricePlan that matches the filter.
     * @param {PricePlanFindUniqueArgs} args - Arguments to find a PricePlan
     * @example
     * // Get one PricePlan
     * const pricePlan = await prisma.pricePlan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PricePlanFindUniqueArgs>(args: SelectSubset<T, PricePlanFindUniqueArgs<ExtArgs>>): Prisma__PricePlanClient<$Result.GetResult<Prisma.$PricePlanPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PricePlan that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PricePlanFindUniqueOrThrowArgs} args - Arguments to find a PricePlan
     * @example
     * // Get one PricePlan
     * const pricePlan = await prisma.pricePlan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PricePlanFindUniqueOrThrowArgs>(args: SelectSubset<T, PricePlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PricePlanClient<$Result.GetResult<Prisma.$PricePlanPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PricePlan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricePlanFindFirstArgs} args - Arguments to find a PricePlan
     * @example
     * // Get one PricePlan
     * const pricePlan = await prisma.pricePlan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PricePlanFindFirstArgs>(args?: SelectSubset<T, PricePlanFindFirstArgs<ExtArgs>>): Prisma__PricePlanClient<$Result.GetResult<Prisma.$PricePlanPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PricePlan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricePlanFindFirstOrThrowArgs} args - Arguments to find a PricePlan
     * @example
     * // Get one PricePlan
     * const pricePlan = await prisma.pricePlan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PricePlanFindFirstOrThrowArgs>(args?: SelectSubset<T, PricePlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__PricePlanClient<$Result.GetResult<Prisma.$PricePlanPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PricePlans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricePlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PricePlans
     * const pricePlans = await prisma.pricePlan.findMany()
     * 
     * // Get first 10 PricePlans
     * const pricePlans = await prisma.pricePlan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pricePlanWithIdOnly = await prisma.pricePlan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PricePlanFindManyArgs>(args?: SelectSubset<T, PricePlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PricePlanPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PricePlan.
     * @param {PricePlanCreateArgs} args - Arguments to create a PricePlan.
     * @example
     * // Create one PricePlan
     * const PricePlan = await prisma.pricePlan.create({
     *   data: {
     *     // ... data to create a PricePlan
     *   }
     * })
     * 
     */
    create<T extends PricePlanCreateArgs>(args: SelectSubset<T, PricePlanCreateArgs<ExtArgs>>): Prisma__PricePlanClient<$Result.GetResult<Prisma.$PricePlanPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PricePlans.
     * @param {PricePlanCreateManyArgs} args - Arguments to create many PricePlans.
     * @example
     * // Create many PricePlans
     * const pricePlan = await prisma.pricePlan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PricePlanCreateManyArgs>(args?: SelectSubset<T, PricePlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PricePlans and returns the data saved in the database.
     * @param {PricePlanCreateManyAndReturnArgs} args - Arguments to create many PricePlans.
     * @example
     * // Create many PricePlans
     * const pricePlan = await prisma.pricePlan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PricePlans and only return the `id`
     * const pricePlanWithIdOnly = await prisma.pricePlan.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PricePlanCreateManyAndReturnArgs>(args?: SelectSubset<T, PricePlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PricePlanPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PricePlan.
     * @param {PricePlanDeleteArgs} args - Arguments to delete one PricePlan.
     * @example
     * // Delete one PricePlan
     * const PricePlan = await prisma.pricePlan.delete({
     *   where: {
     *     // ... filter to delete one PricePlan
     *   }
     * })
     * 
     */
    delete<T extends PricePlanDeleteArgs>(args: SelectSubset<T, PricePlanDeleteArgs<ExtArgs>>): Prisma__PricePlanClient<$Result.GetResult<Prisma.$PricePlanPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PricePlan.
     * @param {PricePlanUpdateArgs} args - Arguments to update one PricePlan.
     * @example
     * // Update one PricePlan
     * const pricePlan = await prisma.pricePlan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PricePlanUpdateArgs>(args: SelectSubset<T, PricePlanUpdateArgs<ExtArgs>>): Prisma__PricePlanClient<$Result.GetResult<Prisma.$PricePlanPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PricePlans.
     * @param {PricePlanDeleteManyArgs} args - Arguments to filter PricePlans to delete.
     * @example
     * // Delete a few PricePlans
     * const { count } = await prisma.pricePlan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PricePlanDeleteManyArgs>(args?: SelectSubset<T, PricePlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PricePlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricePlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PricePlans
     * const pricePlan = await prisma.pricePlan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PricePlanUpdateManyArgs>(args: SelectSubset<T, PricePlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PricePlan.
     * @param {PricePlanUpsertArgs} args - Arguments to update or create a PricePlan.
     * @example
     * // Update or create a PricePlan
     * const pricePlan = await prisma.pricePlan.upsert({
     *   create: {
     *     // ... data to create a PricePlan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PricePlan we want to update
     *   }
     * })
     */
    upsert<T extends PricePlanUpsertArgs>(args: SelectSubset<T, PricePlanUpsertArgs<ExtArgs>>): Prisma__PricePlanClient<$Result.GetResult<Prisma.$PricePlanPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PricePlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricePlanCountArgs} args - Arguments to filter PricePlans to count.
     * @example
     * // Count the number of PricePlans
     * const count = await prisma.pricePlan.count({
     *   where: {
     *     // ... the filter for the PricePlans we want to count
     *   }
     * })
    **/
    count<T extends PricePlanCountArgs>(
      args?: Subset<T, PricePlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PricePlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PricePlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricePlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PricePlanAggregateArgs>(args: Subset<T, PricePlanAggregateArgs>): Prisma.PrismaPromise<GetPricePlanAggregateType<T>>

    /**
     * Group by PricePlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricePlanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PricePlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PricePlanGroupByArgs['orderBy'] }
        : { orderBy?: PricePlanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PricePlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPricePlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PricePlan model
   */
  readonly fields: PricePlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PricePlan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PricePlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rentals<T extends PricePlan$rentalsArgs<ExtArgs> = {}>(args?: Subset<T, PricePlan$rentalsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PricePlan model
   */ 
  interface PricePlanFieldRefs {
    readonly id: FieldRef<"PricePlan", 'String'>
    readonly name: FieldRef<"PricePlan", 'String'>
    readonly size: FieldRef<"PricePlan", 'CompartmentSize'>
    readonly rentalType: FieldRef<"PricePlan", 'RentalType'>
    readonly price: FieldRef<"PricePlan", 'Int'>
    readonly maxOpens: FieldRef<"PricePlan", 'Int'>
    readonly durationDays: FieldRef<"PricePlan", 'Int'>
    readonly description: FieldRef<"PricePlan", 'String'>
    readonly isActive: FieldRef<"PricePlan", 'Boolean'>
    readonly createdAt: FieldRef<"PricePlan", 'DateTime'>
    readonly updatedAt: FieldRef<"PricePlan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PricePlan findUnique
   */
  export type PricePlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricePlan
     */
    select?: PricePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PricePlanInclude<ExtArgs> | null
    /**
     * Filter, which PricePlan to fetch.
     */
    where: PricePlanWhereUniqueInput
  }

  /**
   * PricePlan findUniqueOrThrow
   */
  export type PricePlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricePlan
     */
    select?: PricePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PricePlanInclude<ExtArgs> | null
    /**
     * Filter, which PricePlan to fetch.
     */
    where: PricePlanWhereUniqueInput
  }

  /**
   * PricePlan findFirst
   */
  export type PricePlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricePlan
     */
    select?: PricePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PricePlanInclude<ExtArgs> | null
    /**
     * Filter, which PricePlan to fetch.
     */
    where?: PricePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PricePlans to fetch.
     */
    orderBy?: PricePlanOrderByWithRelationInput | PricePlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PricePlans.
     */
    cursor?: PricePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PricePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PricePlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PricePlans.
     */
    distinct?: PricePlanScalarFieldEnum | PricePlanScalarFieldEnum[]
  }

  /**
   * PricePlan findFirstOrThrow
   */
  export type PricePlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricePlan
     */
    select?: PricePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PricePlanInclude<ExtArgs> | null
    /**
     * Filter, which PricePlan to fetch.
     */
    where?: PricePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PricePlans to fetch.
     */
    orderBy?: PricePlanOrderByWithRelationInput | PricePlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PricePlans.
     */
    cursor?: PricePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PricePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PricePlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PricePlans.
     */
    distinct?: PricePlanScalarFieldEnum | PricePlanScalarFieldEnum[]
  }

  /**
   * PricePlan findMany
   */
  export type PricePlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricePlan
     */
    select?: PricePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PricePlanInclude<ExtArgs> | null
    /**
     * Filter, which PricePlans to fetch.
     */
    where?: PricePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PricePlans to fetch.
     */
    orderBy?: PricePlanOrderByWithRelationInput | PricePlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PricePlans.
     */
    cursor?: PricePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PricePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PricePlans.
     */
    skip?: number
    distinct?: PricePlanScalarFieldEnum | PricePlanScalarFieldEnum[]
  }

  /**
   * PricePlan create
   */
  export type PricePlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricePlan
     */
    select?: PricePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PricePlanInclude<ExtArgs> | null
    /**
     * The data needed to create a PricePlan.
     */
    data: XOR<PricePlanCreateInput, PricePlanUncheckedCreateInput>
  }

  /**
   * PricePlan createMany
   */
  export type PricePlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PricePlans.
     */
    data: PricePlanCreateManyInput | PricePlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PricePlan createManyAndReturn
   */
  export type PricePlanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricePlan
     */
    select?: PricePlanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PricePlans.
     */
    data: PricePlanCreateManyInput | PricePlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PricePlan update
   */
  export type PricePlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricePlan
     */
    select?: PricePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PricePlanInclude<ExtArgs> | null
    /**
     * The data needed to update a PricePlan.
     */
    data: XOR<PricePlanUpdateInput, PricePlanUncheckedUpdateInput>
    /**
     * Choose, which PricePlan to update.
     */
    where: PricePlanWhereUniqueInput
  }

  /**
   * PricePlan updateMany
   */
  export type PricePlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PricePlans.
     */
    data: XOR<PricePlanUpdateManyMutationInput, PricePlanUncheckedUpdateManyInput>
    /**
     * Filter which PricePlans to update
     */
    where?: PricePlanWhereInput
  }

  /**
   * PricePlan upsert
   */
  export type PricePlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricePlan
     */
    select?: PricePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PricePlanInclude<ExtArgs> | null
    /**
     * The filter to search for the PricePlan to update in case it exists.
     */
    where: PricePlanWhereUniqueInput
    /**
     * In case the PricePlan found by the `where` argument doesn't exist, create a new PricePlan with this data.
     */
    create: XOR<PricePlanCreateInput, PricePlanUncheckedCreateInput>
    /**
     * In case the PricePlan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PricePlanUpdateInput, PricePlanUncheckedUpdateInput>
  }

  /**
   * PricePlan delete
   */
  export type PricePlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricePlan
     */
    select?: PricePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PricePlanInclude<ExtArgs> | null
    /**
     * Filter which PricePlan to delete.
     */
    where: PricePlanWhereUniqueInput
  }

  /**
   * PricePlan deleteMany
   */
  export type PricePlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PricePlans to delete
     */
    where?: PricePlanWhereInput
  }

  /**
   * PricePlan.rentals
   */
  export type PricePlan$rentalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    where?: RentalWhereInput
    orderBy?: RentalOrderByWithRelationInput | RentalOrderByWithRelationInput[]
    cursor?: RentalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RentalScalarFieldEnum | RentalScalarFieldEnum[]
  }

  /**
   * PricePlan without action
   */
  export type PricePlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricePlan
     */
    select?: PricePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PricePlanInclude<ExtArgs> | null
  }


  /**
   * Model Rental
   */

  export type AggregateRental = {
    _count: RentalCountAggregateOutputType | null
    _avg: RentalAvgAggregateOutputType | null
    _sum: RentalSumAggregateOutputType | null
    _min: RentalMinAggregateOutputType | null
    _max: RentalMaxAggregateOutputType | null
  }

  export type RentalAvgAggregateOutputType = {
    openCount: number | null
    maxOpens: number | null
  }

  export type RentalSumAggregateOutputType = {
    openCount: number | null
    maxOpens: number | null
  }

  export type RentalMinAggregateOutputType = {
    id: string | null
    userId: string | null
    compartmentId: string | null
    pricePlanId: string | null
    code: string | null
    codeHash: string | null
    qrToken: string | null
    openCount: number | null
    maxOpens: number | null
    expiresAt: Date | null
    paymentStatus: $Enums.PaymentStatus | null
    paymentMethod: $Enums.PaymentMethod | null
    paidAt: Date | null
    status: $Enums.RentalStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RentalMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    compartmentId: string | null
    pricePlanId: string | null
    code: string | null
    codeHash: string | null
    qrToken: string | null
    openCount: number | null
    maxOpens: number | null
    expiresAt: Date | null
    paymentStatus: $Enums.PaymentStatus | null
    paymentMethod: $Enums.PaymentMethod | null
    paidAt: Date | null
    status: $Enums.RentalStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RentalCountAggregateOutputType = {
    id: number
    userId: number
    compartmentId: number
    pricePlanId: number
    code: number
    codeHash: number
    qrToken: number
    openCount: number
    maxOpens: number
    expiresAt: number
    paymentStatus: number
    paymentMethod: number
    paidAt: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RentalAvgAggregateInputType = {
    openCount?: true
    maxOpens?: true
  }

  export type RentalSumAggregateInputType = {
    openCount?: true
    maxOpens?: true
  }

  export type RentalMinAggregateInputType = {
    id?: true
    userId?: true
    compartmentId?: true
    pricePlanId?: true
    code?: true
    codeHash?: true
    qrToken?: true
    openCount?: true
    maxOpens?: true
    expiresAt?: true
    paymentStatus?: true
    paymentMethod?: true
    paidAt?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RentalMaxAggregateInputType = {
    id?: true
    userId?: true
    compartmentId?: true
    pricePlanId?: true
    code?: true
    codeHash?: true
    qrToken?: true
    openCount?: true
    maxOpens?: true
    expiresAt?: true
    paymentStatus?: true
    paymentMethod?: true
    paidAt?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RentalCountAggregateInputType = {
    id?: true
    userId?: true
    compartmentId?: true
    pricePlanId?: true
    code?: true
    codeHash?: true
    qrToken?: true
    openCount?: true
    maxOpens?: true
    expiresAt?: true
    paymentStatus?: true
    paymentMethod?: true
    paidAt?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RentalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rental to aggregate.
     */
    where?: RentalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rentals to fetch.
     */
    orderBy?: RentalOrderByWithRelationInput | RentalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RentalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rentals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rentals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Rentals
    **/
    _count?: true | RentalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RentalAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RentalSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RentalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RentalMaxAggregateInputType
  }

  export type GetRentalAggregateType<T extends RentalAggregateArgs> = {
        [P in keyof T & keyof AggregateRental]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRental[P]>
      : GetScalarType<T[P], AggregateRental[P]>
  }




  export type RentalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RentalWhereInput
    orderBy?: RentalOrderByWithAggregationInput | RentalOrderByWithAggregationInput[]
    by: RentalScalarFieldEnum[] | RentalScalarFieldEnum
    having?: RentalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RentalCountAggregateInputType | true
    _avg?: RentalAvgAggregateInputType
    _sum?: RentalSumAggregateInputType
    _min?: RentalMinAggregateInputType
    _max?: RentalMaxAggregateInputType
  }

  export type RentalGroupByOutputType = {
    id: string
    userId: string | null
    compartmentId: string
    pricePlanId: string
    code: string
    codeHash: string
    qrToken: string
    openCount: number
    maxOpens: number
    expiresAt: Date
    paymentStatus: $Enums.PaymentStatus
    paymentMethod: $Enums.PaymentMethod
    paidAt: Date | null
    status: $Enums.RentalStatus
    createdAt: Date
    updatedAt: Date
    _count: RentalCountAggregateOutputType | null
    _avg: RentalAvgAggregateOutputType | null
    _sum: RentalSumAggregateOutputType | null
    _min: RentalMinAggregateOutputType | null
    _max: RentalMaxAggregateOutputType | null
  }

  type GetRentalGroupByPayload<T extends RentalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RentalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RentalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RentalGroupByOutputType[P]>
            : GetScalarType<T[P], RentalGroupByOutputType[P]>
        }
      >
    >


  export type RentalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    compartmentId?: boolean
    pricePlanId?: boolean
    code?: boolean
    codeHash?: boolean
    qrToken?: boolean
    openCount?: boolean
    maxOpens?: boolean
    expiresAt?: boolean
    paymentStatus?: boolean
    paymentMethod?: boolean
    paidAt?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Rental$userArgs<ExtArgs>
    compartment?: boolean | CompartmentDefaultArgs<ExtArgs>
    pricePlan?: boolean | PricePlanDefaultArgs<ExtArgs>
    logs?: boolean | Rental$logsArgs<ExtArgs>
    _count?: boolean | RentalCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rental"]>

  export type RentalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    compartmentId?: boolean
    pricePlanId?: boolean
    code?: boolean
    codeHash?: boolean
    qrToken?: boolean
    openCount?: boolean
    maxOpens?: boolean
    expiresAt?: boolean
    paymentStatus?: boolean
    paymentMethod?: boolean
    paidAt?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Rental$userArgs<ExtArgs>
    compartment?: boolean | CompartmentDefaultArgs<ExtArgs>
    pricePlan?: boolean | PricePlanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rental"]>

  export type RentalSelectScalar = {
    id?: boolean
    userId?: boolean
    compartmentId?: boolean
    pricePlanId?: boolean
    code?: boolean
    codeHash?: boolean
    qrToken?: boolean
    openCount?: boolean
    maxOpens?: boolean
    expiresAt?: boolean
    paymentStatus?: boolean
    paymentMethod?: boolean
    paidAt?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RentalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Rental$userArgs<ExtArgs>
    compartment?: boolean | CompartmentDefaultArgs<ExtArgs>
    pricePlan?: boolean | PricePlanDefaultArgs<ExtArgs>
    logs?: boolean | Rental$logsArgs<ExtArgs>
    _count?: boolean | RentalCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RentalIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Rental$userArgs<ExtArgs>
    compartment?: boolean | CompartmentDefaultArgs<ExtArgs>
    pricePlan?: boolean | PricePlanDefaultArgs<ExtArgs>
  }

  export type $RentalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Rental"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      compartment: Prisma.$CompartmentPayload<ExtArgs>
      pricePlan: Prisma.$PricePlanPayload<ExtArgs>
      logs: Prisma.$LockerLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      compartmentId: string
      pricePlanId: string
      code: string
      codeHash: string
      qrToken: string
      openCount: number
      maxOpens: number
      expiresAt: Date
      paymentStatus: $Enums.PaymentStatus
      paymentMethod: $Enums.PaymentMethod
      paidAt: Date | null
      status: $Enums.RentalStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["rental"]>
    composites: {}
  }

  type RentalGetPayload<S extends boolean | null | undefined | RentalDefaultArgs> = $Result.GetResult<Prisma.$RentalPayload, S>

  type RentalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RentalFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RentalCountAggregateInputType | true
    }

  export interface RentalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Rental'], meta: { name: 'Rental' } }
    /**
     * Find zero or one Rental that matches the filter.
     * @param {RentalFindUniqueArgs} args - Arguments to find a Rental
     * @example
     * // Get one Rental
     * const rental = await prisma.rental.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RentalFindUniqueArgs>(args: SelectSubset<T, RentalFindUniqueArgs<ExtArgs>>): Prisma__RentalClient<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Rental that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RentalFindUniqueOrThrowArgs} args - Arguments to find a Rental
     * @example
     * // Get one Rental
     * const rental = await prisma.rental.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RentalFindUniqueOrThrowArgs>(args: SelectSubset<T, RentalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RentalClient<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Rental that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentalFindFirstArgs} args - Arguments to find a Rental
     * @example
     * // Get one Rental
     * const rental = await prisma.rental.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RentalFindFirstArgs>(args?: SelectSubset<T, RentalFindFirstArgs<ExtArgs>>): Prisma__RentalClient<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Rental that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentalFindFirstOrThrowArgs} args - Arguments to find a Rental
     * @example
     * // Get one Rental
     * const rental = await prisma.rental.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RentalFindFirstOrThrowArgs>(args?: SelectSubset<T, RentalFindFirstOrThrowArgs<ExtArgs>>): Prisma__RentalClient<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Rentals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rentals
     * const rentals = await prisma.rental.findMany()
     * 
     * // Get first 10 Rentals
     * const rentals = await prisma.rental.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rentalWithIdOnly = await prisma.rental.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RentalFindManyArgs>(args?: SelectSubset<T, RentalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Rental.
     * @param {RentalCreateArgs} args - Arguments to create a Rental.
     * @example
     * // Create one Rental
     * const Rental = await prisma.rental.create({
     *   data: {
     *     // ... data to create a Rental
     *   }
     * })
     * 
     */
    create<T extends RentalCreateArgs>(args: SelectSubset<T, RentalCreateArgs<ExtArgs>>): Prisma__RentalClient<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Rentals.
     * @param {RentalCreateManyArgs} args - Arguments to create many Rentals.
     * @example
     * // Create many Rentals
     * const rental = await prisma.rental.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RentalCreateManyArgs>(args?: SelectSubset<T, RentalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Rentals and returns the data saved in the database.
     * @param {RentalCreateManyAndReturnArgs} args - Arguments to create many Rentals.
     * @example
     * // Create many Rentals
     * const rental = await prisma.rental.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Rentals and only return the `id`
     * const rentalWithIdOnly = await prisma.rental.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RentalCreateManyAndReturnArgs>(args?: SelectSubset<T, RentalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Rental.
     * @param {RentalDeleteArgs} args - Arguments to delete one Rental.
     * @example
     * // Delete one Rental
     * const Rental = await prisma.rental.delete({
     *   where: {
     *     // ... filter to delete one Rental
     *   }
     * })
     * 
     */
    delete<T extends RentalDeleteArgs>(args: SelectSubset<T, RentalDeleteArgs<ExtArgs>>): Prisma__RentalClient<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Rental.
     * @param {RentalUpdateArgs} args - Arguments to update one Rental.
     * @example
     * // Update one Rental
     * const rental = await prisma.rental.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RentalUpdateArgs>(args: SelectSubset<T, RentalUpdateArgs<ExtArgs>>): Prisma__RentalClient<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Rentals.
     * @param {RentalDeleteManyArgs} args - Arguments to filter Rentals to delete.
     * @example
     * // Delete a few Rentals
     * const { count } = await prisma.rental.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RentalDeleteManyArgs>(args?: SelectSubset<T, RentalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rentals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rentals
     * const rental = await prisma.rental.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RentalUpdateManyArgs>(args: SelectSubset<T, RentalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Rental.
     * @param {RentalUpsertArgs} args - Arguments to update or create a Rental.
     * @example
     * // Update or create a Rental
     * const rental = await prisma.rental.upsert({
     *   create: {
     *     // ... data to create a Rental
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Rental we want to update
     *   }
     * })
     */
    upsert<T extends RentalUpsertArgs>(args: SelectSubset<T, RentalUpsertArgs<ExtArgs>>): Prisma__RentalClient<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Rentals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentalCountArgs} args - Arguments to filter Rentals to count.
     * @example
     * // Count the number of Rentals
     * const count = await prisma.rental.count({
     *   where: {
     *     // ... the filter for the Rentals we want to count
     *   }
     * })
    **/
    count<T extends RentalCountArgs>(
      args?: Subset<T, RentalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RentalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Rental.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RentalAggregateArgs>(args: Subset<T, RentalAggregateArgs>): Prisma.PrismaPromise<GetRentalAggregateType<T>>

    /**
     * Group by Rental.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RentalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RentalGroupByArgs['orderBy'] }
        : { orderBy?: RentalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RentalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRentalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Rental model
   */
  readonly fields: RentalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Rental.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RentalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Rental$userArgs<ExtArgs> = {}>(args?: Subset<T, Rental$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    compartment<T extends CompartmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompartmentDefaultArgs<ExtArgs>>): Prisma__CompartmentClient<$Result.GetResult<Prisma.$CompartmentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    pricePlan<T extends PricePlanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PricePlanDefaultArgs<ExtArgs>>): Prisma__PricePlanClient<$Result.GetResult<Prisma.$PricePlanPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    logs<T extends Rental$logsArgs<ExtArgs> = {}>(args?: Subset<T, Rental$logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LockerLogPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Rental model
   */ 
  interface RentalFieldRefs {
    readonly id: FieldRef<"Rental", 'String'>
    readonly userId: FieldRef<"Rental", 'String'>
    readonly compartmentId: FieldRef<"Rental", 'String'>
    readonly pricePlanId: FieldRef<"Rental", 'String'>
    readonly code: FieldRef<"Rental", 'String'>
    readonly codeHash: FieldRef<"Rental", 'String'>
    readonly qrToken: FieldRef<"Rental", 'String'>
    readonly openCount: FieldRef<"Rental", 'Int'>
    readonly maxOpens: FieldRef<"Rental", 'Int'>
    readonly expiresAt: FieldRef<"Rental", 'DateTime'>
    readonly paymentStatus: FieldRef<"Rental", 'PaymentStatus'>
    readonly paymentMethod: FieldRef<"Rental", 'PaymentMethod'>
    readonly paidAt: FieldRef<"Rental", 'DateTime'>
    readonly status: FieldRef<"Rental", 'RentalStatus'>
    readonly createdAt: FieldRef<"Rental", 'DateTime'>
    readonly updatedAt: FieldRef<"Rental", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Rental findUnique
   */
  export type RentalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    /**
     * Filter, which Rental to fetch.
     */
    where: RentalWhereUniqueInput
  }

  /**
   * Rental findUniqueOrThrow
   */
  export type RentalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    /**
     * Filter, which Rental to fetch.
     */
    where: RentalWhereUniqueInput
  }

  /**
   * Rental findFirst
   */
  export type RentalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    /**
     * Filter, which Rental to fetch.
     */
    where?: RentalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rentals to fetch.
     */
    orderBy?: RentalOrderByWithRelationInput | RentalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rentals.
     */
    cursor?: RentalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rentals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rentals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rentals.
     */
    distinct?: RentalScalarFieldEnum | RentalScalarFieldEnum[]
  }

  /**
   * Rental findFirstOrThrow
   */
  export type RentalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    /**
     * Filter, which Rental to fetch.
     */
    where?: RentalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rentals to fetch.
     */
    orderBy?: RentalOrderByWithRelationInput | RentalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rentals.
     */
    cursor?: RentalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rentals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rentals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rentals.
     */
    distinct?: RentalScalarFieldEnum | RentalScalarFieldEnum[]
  }

  /**
   * Rental findMany
   */
  export type RentalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    /**
     * Filter, which Rentals to fetch.
     */
    where?: RentalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rentals to fetch.
     */
    orderBy?: RentalOrderByWithRelationInput | RentalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Rentals.
     */
    cursor?: RentalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rentals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rentals.
     */
    skip?: number
    distinct?: RentalScalarFieldEnum | RentalScalarFieldEnum[]
  }

  /**
   * Rental create
   */
  export type RentalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    /**
     * The data needed to create a Rental.
     */
    data: XOR<RentalCreateInput, RentalUncheckedCreateInput>
  }

  /**
   * Rental createMany
   */
  export type RentalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Rentals.
     */
    data: RentalCreateManyInput | RentalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Rental createManyAndReturn
   */
  export type RentalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Rentals.
     */
    data: RentalCreateManyInput | RentalCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Rental update
   */
  export type RentalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    /**
     * The data needed to update a Rental.
     */
    data: XOR<RentalUpdateInput, RentalUncheckedUpdateInput>
    /**
     * Choose, which Rental to update.
     */
    where: RentalWhereUniqueInput
  }

  /**
   * Rental updateMany
   */
  export type RentalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Rentals.
     */
    data: XOR<RentalUpdateManyMutationInput, RentalUncheckedUpdateManyInput>
    /**
     * Filter which Rentals to update
     */
    where?: RentalWhereInput
  }

  /**
   * Rental upsert
   */
  export type RentalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    /**
     * The filter to search for the Rental to update in case it exists.
     */
    where: RentalWhereUniqueInput
    /**
     * In case the Rental found by the `where` argument doesn't exist, create a new Rental with this data.
     */
    create: XOR<RentalCreateInput, RentalUncheckedCreateInput>
    /**
     * In case the Rental was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RentalUpdateInput, RentalUncheckedUpdateInput>
  }

  /**
   * Rental delete
   */
  export type RentalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    /**
     * Filter which Rental to delete.
     */
    where: RentalWhereUniqueInput
  }

  /**
   * Rental deleteMany
   */
  export type RentalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rentals to delete
     */
    where?: RentalWhereInput
  }

  /**
   * Rental.user
   */
  export type Rental$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Rental.logs
   */
  export type Rental$logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LockerLog
     */
    select?: LockerLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LockerLogInclude<ExtArgs> | null
    where?: LockerLogWhereInput
    orderBy?: LockerLogOrderByWithRelationInput | LockerLogOrderByWithRelationInput[]
    cursor?: LockerLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LockerLogScalarFieldEnum | LockerLogScalarFieldEnum[]
  }

  /**
   * Rental without action
   */
  export type RentalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
  }


  /**
   * Model LockerLog
   */

  export type AggregateLockerLog = {
    _count: LockerLogCountAggregateOutputType | null
    _avg: LockerLogAvgAggregateOutputType | null
    _sum: LockerLogSumAggregateOutputType | null
    _min: LockerLogMinAggregateOutputType | null
    _max: LockerLogMaxAggregateOutputType | null
  }

  export type LockerLogAvgAggregateOutputType = {
    attemptCount: number | null
  }

  export type LockerLogSumAggregateOutputType = {
    attemptCount: number | null
  }

  export type LockerLogMinAggregateOutputType = {
    id: string | null
    cabinetId: string | null
    compartmentId: string | null
    rentalId: string | null
    action: $Enums.LockerAction | null
    attemptCount: number | null
    success: boolean | null
    ipAddress: string | null
    deviceInfo: string | null
    note: string | null
    createdAt: Date | null
  }

  export type LockerLogMaxAggregateOutputType = {
    id: string | null
    cabinetId: string | null
    compartmentId: string | null
    rentalId: string | null
    action: $Enums.LockerAction | null
    attemptCount: number | null
    success: boolean | null
    ipAddress: string | null
    deviceInfo: string | null
    note: string | null
    createdAt: Date | null
  }

  export type LockerLogCountAggregateOutputType = {
    id: number
    cabinetId: number
    compartmentId: number
    rentalId: number
    action: number
    attemptCount: number
    success: number
    ipAddress: number
    deviceInfo: number
    note: number
    createdAt: number
    _all: number
  }


  export type LockerLogAvgAggregateInputType = {
    attemptCount?: true
  }

  export type LockerLogSumAggregateInputType = {
    attemptCount?: true
  }

  export type LockerLogMinAggregateInputType = {
    id?: true
    cabinetId?: true
    compartmentId?: true
    rentalId?: true
    action?: true
    attemptCount?: true
    success?: true
    ipAddress?: true
    deviceInfo?: true
    note?: true
    createdAt?: true
  }

  export type LockerLogMaxAggregateInputType = {
    id?: true
    cabinetId?: true
    compartmentId?: true
    rentalId?: true
    action?: true
    attemptCount?: true
    success?: true
    ipAddress?: true
    deviceInfo?: true
    note?: true
    createdAt?: true
  }

  export type LockerLogCountAggregateInputType = {
    id?: true
    cabinetId?: true
    compartmentId?: true
    rentalId?: true
    action?: true
    attemptCount?: true
    success?: true
    ipAddress?: true
    deviceInfo?: true
    note?: true
    createdAt?: true
    _all?: true
  }

  export type LockerLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LockerLog to aggregate.
     */
    where?: LockerLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LockerLogs to fetch.
     */
    orderBy?: LockerLogOrderByWithRelationInput | LockerLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LockerLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LockerLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LockerLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LockerLogs
    **/
    _count?: true | LockerLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LockerLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LockerLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LockerLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LockerLogMaxAggregateInputType
  }

  export type GetLockerLogAggregateType<T extends LockerLogAggregateArgs> = {
        [P in keyof T & keyof AggregateLockerLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLockerLog[P]>
      : GetScalarType<T[P], AggregateLockerLog[P]>
  }




  export type LockerLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LockerLogWhereInput
    orderBy?: LockerLogOrderByWithAggregationInput | LockerLogOrderByWithAggregationInput[]
    by: LockerLogScalarFieldEnum[] | LockerLogScalarFieldEnum
    having?: LockerLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LockerLogCountAggregateInputType | true
    _avg?: LockerLogAvgAggregateInputType
    _sum?: LockerLogSumAggregateInputType
    _min?: LockerLogMinAggregateInputType
    _max?: LockerLogMaxAggregateInputType
  }

  export type LockerLogGroupByOutputType = {
    id: string
    cabinetId: string | null
    compartmentId: string | null
    rentalId: string | null
    action: $Enums.LockerAction
    attemptCount: number
    success: boolean
    ipAddress: string | null
    deviceInfo: string | null
    note: string | null
    createdAt: Date
    _count: LockerLogCountAggregateOutputType | null
    _avg: LockerLogAvgAggregateOutputType | null
    _sum: LockerLogSumAggregateOutputType | null
    _min: LockerLogMinAggregateOutputType | null
    _max: LockerLogMaxAggregateOutputType | null
  }

  type GetLockerLogGroupByPayload<T extends LockerLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LockerLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LockerLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LockerLogGroupByOutputType[P]>
            : GetScalarType<T[P], LockerLogGroupByOutputType[P]>
        }
      >
    >


  export type LockerLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cabinetId?: boolean
    compartmentId?: boolean
    rentalId?: boolean
    action?: boolean
    attemptCount?: boolean
    success?: boolean
    ipAddress?: boolean
    deviceInfo?: boolean
    note?: boolean
    createdAt?: boolean
    cabinet?: boolean | LockerLog$cabinetArgs<ExtArgs>
    compartment?: boolean | LockerLog$compartmentArgs<ExtArgs>
    rental?: boolean | LockerLog$rentalArgs<ExtArgs>
  }, ExtArgs["result"]["lockerLog"]>

  export type LockerLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cabinetId?: boolean
    compartmentId?: boolean
    rentalId?: boolean
    action?: boolean
    attemptCount?: boolean
    success?: boolean
    ipAddress?: boolean
    deviceInfo?: boolean
    note?: boolean
    createdAt?: boolean
    cabinet?: boolean | LockerLog$cabinetArgs<ExtArgs>
    compartment?: boolean | LockerLog$compartmentArgs<ExtArgs>
    rental?: boolean | LockerLog$rentalArgs<ExtArgs>
  }, ExtArgs["result"]["lockerLog"]>

  export type LockerLogSelectScalar = {
    id?: boolean
    cabinetId?: boolean
    compartmentId?: boolean
    rentalId?: boolean
    action?: boolean
    attemptCount?: boolean
    success?: boolean
    ipAddress?: boolean
    deviceInfo?: boolean
    note?: boolean
    createdAt?: boolean
  }

  export type LockerLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cabinet?: boolean | LockerLog$cabinetArgs<ExtArgs>
    compartment?: boolean | LockerLog$compartmentArgs<ExtArgs>
    rental?: boolean | LockerLog$rentalArgs<ExtArgs>
  }
  export type LockerLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cabinet?: boolean | LockerLog$cabinetArgs<ExtArgs>
    compartment?: boolean | LockerLog$compartmentArgs<ExtArgs>
    rental?: boolean | LockerLog$rentalArgs<ExtArgs>
  }

  export type $LockerLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LockerLog"
    objects: {
      cabinet: Prisma.$CabinetPayload<ExtArgs> | null
      compartment: Prisma.$CompartmentPayload<ExtArgs> | null
      rental: Prisma.$RentalPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cabinetId: string | null
      compartmentId: string | null
      rentalId: string | null
      action: $Enums.LockerAction
      attemptCount: number
      success: boolean
      ipAddress: string | null
      deviceInfo: string | null
      note: string | null
      createdAt: Date
    }, ExtArgs["result"]["lockerLog"]>
    composites: {}
  }

  type LockerLogGetPayload<S extends boolean | null | undefined | LockerLogDefaultArgs> = $Result.GetResult<Prisma.$LockerLogPayload, S>

  type LockerLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LockerLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LockerLogCountAggregateInputType | true
    }

  export interface LockerLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LockerLog'], meta: { name: 'LockerLog' } }
    /**
     * Find zero or one LockerLog that matches the filter.
     * @param {LockerLogFindUniqueArgs} args - Arguments to find a LockerLog
     * @example
     * // Get one LockerLog
     * const lockerLog = await prisma.lockerLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LockerLogFindUniqueArgs>(args: SelectSubset<T, LockerLogFindUniqueArgs<ExtArgs>>): Prisma__LockerLogClient<$Result.GetResult<Prisma.$LockerLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one LockerLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LockerLogFindUniqueOrThrowArgs} args - Arguments to find a LockerLog
     * @example
     * // Get one LockerLog
     * const lockerLog = await prisma.lockerLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LockerLogFindUniqueOrThrowArgs>(args: SelectSubset<T, LockerLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LockerLogClient<$Result.GetResult<Prisma.$LockerLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first LockerLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LockerLogFindFirstArgs} args - Arguments to find a LockerLog
     * @example
     * // Get one LockerLog
     * const lockerLog = await prisma.lockerLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LockerLogFindFirstArgs>(args?: SelectSubset<T, LockerLogFindFirstArgs<ExtArgs>>): Prisma__LockerLogClient<$Result.GetResult<Prisma.$LockerLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first LockerLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LockerLogFindFirstOrThrowArgs} args - Arguments to find a LockerLog
     * @example
     * // Get one LockerLog
     * const lockerLog = await prisma.lockerLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LockerLogFindFirstOrThrowArgs>(args?: SelectSubset<T, LockerLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__LockerLogClient<$Result.GetResult<Prisma.$LockerLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more LockerLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LockerLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LockerLogs
     * const lockerLogs = await prisma.lockerLog.findMany()
     * 
     * // Get first 10 LockerLogs
     * const lockerLogs = await prisma.lockerLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lockerLogWithIdOnly = await prisma.lockerLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LockerLogFindManyArgs>(args?: SelectSubset<T, LockerLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LockerLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a LockerLog.
     * @param {LockerLogCreateArgs} args - Arguments to create a LockerLog.
     * @example
     * // Create one LockerLog
     * const LockerLog = await prisma.lockerLog.create({
     *   data: {
     *     // ... data to create a LockerLog
     *   }
     * })
     * 
     */
    create<T extends LockerLogCreateArgs>(args: SelectSubset<T, LockerLogCreateArgs<ExtArgs>>): Prisma__LockerLogClient<$Result.GetResult<Prisma.$LockerLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many LockerLogs.
     * @param {LockerLogCreateManyArgs} args - Arguments to create many LockerLogs.
     * @example
     * // Create many LockerLogs
     * const lockerLog = await prisma.lockerLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LockerLogCreateManyArgs>(args?: SelectSubset<T, LockerLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LockerLogs and returns the data saved in the database.
     * @param {LockerLogCreateManyAndReturnArgs} args - Arguments to create many LockerLogs.
     * @example
     * // Create many LockerLogs
     * const lockerLog = await prisma.lockerLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LockerLogs and only return the `id`
     * const lockerLogWithIdOnly = await prisma.lockerLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LockerLogCreateManyAndReturnArgs>(args?: SelectSubset<T, LockerLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LockerLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a LockerLog.
     * @param {LockerLogDeleteArgs} args - Arguments to delete one LockerLog.
     * @example
     * // Delete one LockerLog
     * const LockerLog = await prisma.lockerLog.delete({
     *   where: {
     *     // ... filter to delete one LockerLog
     *   }
     * })
     * 
     */
    delete<T extends LockerLogDeleteArgs>(args: SelectSubset<T, LockerLogDeleteArgs<ExtArgs>>): Prisma__LockerLogClient<$Result.GetResult<Prisma.$LockerLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one LockerLog.
     * @param {LockerLogUpdateArgs} args - Arguments to update one LockerLog.
     * @example
     * // Update one LockerLog
     * const lockerLog = await prisma.lockerLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LockerLogUpdateArgs>(args: SelectSubset<T, LockerLogUpdateArgs<ExtArgs>>): Prisma__LockerLogClient<$Result.GetResult<Prisma.$LockerLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more LockerLogs.
     * @param {LockerLogDeleteManyArgs} args - Arguments to filter LockerLogs to delete.
     * @example
     * // Delete a few LockerLogs
     * const { count } = await prisma.lockerLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LockerLogDeleteManyArgs>(args?: SelectSubset<T, LockerLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LockerLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LockerLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LockerLogs
     * const lockerLog = await prisma.lockerLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LockerLogUpdateManyArgs>(args: SelectSubset<T, LockerLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LockerLog.
     * @param {LockerLogUpsertArgs} args - Arguments to update or create a LockerLog.
     * @example
     * // Update or create a LockerLog
     * const lockerLog = await prisma.lockerLog.upsert({
     *   create: {
     *     // ... data to create a LockerLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LockerLog we want to update
     *   }
     * })
     */
    upsert<T extends LockerLogUpsertArgs>(args: SelectSubset<T, LockerLogUpsertArgs<ExtArgs>>): Prisma__LockerLogClient<$Result.GetResult<Prisma.$LockerLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of LockerLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LockerLogCountArgs} args - Arguments to filter LockerLogs to count.
     * @example
     * // Count the number of LockerLogs
     * const count = await prisma.lockerLog.count({
     *   where: {
     *     // ... the filter for the LockerLogs we want to count
     *   }
     * })
    **/
    count<T extends LockerLogCountArgs>(
      args?: Subset<T, LockerLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LockerLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LockerLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LockerLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LockerLogAggregateArgs>(args: Subset<T, LockerLogAggregateArgs>): Prisma.PrismaPromise<GetLockerLogAggregateType<T>>

    /**
     * Group by LockerLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LockerLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LockerLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LockerLogGroupByArgs['orderBy'] }
        : { orderBy?: LockerLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LockerLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLockerLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LockerLog model
   */
  readonly fields: LockerLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LockerLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LockerLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cabinet<T extends LockerLog$cabinetArgs<ExtArgs> = {}>(args?: Subset<T, LockerLog$cabinetArgs<ExtArgs>>): Prisma__CabinetClient<$Result.GetResult<Prisma.$CabinetPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    compartment<T extends LockerLog$compartmentArgs<ExtArgs> = {}>(args?: Subset<T, LockerLog$compartmentArgs<ExtArgs>>): Prisma__CompartmentClient<$Result.GetResult<Prisma.$CompartmentPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    rental<T extends LockerLog$rentalArgs<ExtArgs> = {}>(args?: Subset<T, LockerLog$rentalArgs<ExtArgs>>): Prisma__RentalClient<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LockerLog model
   */ 
  interface LockerLogFieldRefs {
    readonly id: FieldRef<"LockerLog", 'String'>
    readonly cabinetId: FieldRef<"LockerLog", 'String'>
    readonly compartmentId: FieldRef<"LockerLog", 'String'>
    readonly rentalId: FieldRef<"LockerLog", 'String'>
    readonly action: FieldRef<"LockerLog", 'LockerAction'>
    readonly attemptCount: FieldRef<"LockerLog", 'Int'>
    readonly success: FieldRef<"LockerLog", 'Boolean'>
    readonly ipAddress: FieldRef<"LockerLog", 'String'>
    readonly deviceInfo: FieldRef<"LockerLog", 'String'>
    readonly note: FieldRef<"LockerLog", 'String'>
    readonly createdAt: FieldRef<"LockerLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LockerLog findUnique
   */
  export type LockerLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LockerLog
     */
    select?: LockerLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LockerLogInclude<ExtArgs> | null
    /**
     * Filter, which LockerLog to fetch.
     */
    where: LockerLogWhereUniqueInput
  }

  /**
   * LockerLog findUniqueOrThrow
   */
  export type LockerLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LockerLog
     */
    select?: LockerLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LockerLogInclude<ExtArgs> | null
    /**
     * Filter, which LockerLog to fetch.
     */
    where: LockerLogWhereUniqueInput
  }

  /**
   * LockerLog findFirst
   */
  export type LockerLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LockerLog
     */
    select?: LockerLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LockerLogInclude<ExtArgs> | null
    /**
     * Filter, which LockerLog to fetch.
     */
    where?: LockerLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LockerLogs to fetch.
     */
    orderBy?: LockerLogOrderByWithRelationInput | LockerLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LockerLogs.
     */
    cursor?: LockerLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LockerLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LockerLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LockerLogs.
     */
    distinct?: LockerLogScalarFieldEnum | LockerLogScalarFieldEnum[]
  }

  /**
   * LockerLog findFirstOrThrow
   */
  export type LockerLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LockerLog
     */
    select?: LockerLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LockerLogInclude<ExtArgs> | null
    /**
     * Filter, which LockerLog to fetch.
     */
    where?: LockerLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LockerLogs to fetch.
     */
    orderBy?: LockerLogOrderByWithRelationInput | LockerLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LockerLogs.
     */
    cursor?: LockerLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LockerLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LockerLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LockerLogs.
     */
    distinct?: LockerLogScalarFieldEnum | LockerLogScalarFieldEnum[]
  }

  /**
   * LockerLog findMany
   */
  export type LockerLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LockerLog
     */
    select?: LockerLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LockerLogInclude<ExtArgs> | null
    /**
     * Filter, which LockerLogs to fetch.
     */
    where?: LockerLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LockerLogs to fetch.
     */
    orderBy?: LockerLogOrderByWithRelationInput | LockerLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LockerLogs.
     */
    cursor?: LockerLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LockerLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LockerLogs.
     */
    skip?: number
    distinct?: LockerLogScalarFieldEnum | LockerLogScalarFieldEnum[]
  }

  /**
   * LockerLog create
   */
  export type LockerLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LockerLog
     */
    select?: LockerLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LockerLogInclude<ExtArgs> | null
    /**
     * The data needed to create a LockerLog.
     */
    data: XOR<LockerLogCreateInput, LockerLogUncheckedCreateInput>
  }

  /**
   * LockerLog createMany
   */
  export type LockerLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LockerLogs.
     */
    data: LockerLogCreateManyInput | LockerLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LockerLog createManyAndReturn
   */
  export type LockerLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LockerLog
     */
    select?: LockerLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many LockerLogs.
     */
    data: LockerLogCreateManyInput | LockerLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LockerLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LockerLog update
   */
  export type LockerLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LockerLog
     */
    select?: LockerLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LockerLogInclude<ExtArgs> | null
    /**
     * The data needed to update a LockerLog.
     */
    data: XOR<LockerLogUpdateInput, LockerLogUncheckedUpdateInput>
    /**
     * Choose, which LockerLog to update.
     */
    where: LockerLogWhereUniqueInput
  }

  /**
   * LockerLog updateMany
   */
  export type LockerLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LockerLogs.
     */
    data: XOR<LockerLogUpdateManyMutationInput, LockerLogUncheckedUpdateManyInput>
    /**
     * Filter which LockerLogs to update
     */
    where?: LockerLogWhereInput
  }

  /**
   * LockerLog upsert
   */
  export type LockerLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LockerLog
     */
    select?: LockerLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LockerLogInclude<ExtArgs> | null
    /**
     * The filter to search for the LockerLog to update in case it exists.
     */
    where: LockerLogWhereUniqueInput
    /**
     * In case the LockerLog found by the `where` argument doesn't exist, create a new LockerLog with this data.
     */
    create: XOR<LockerLogCreateInput, LockerLogUncheckedCreateInput>
    /**
     * In case the LockerLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LockerLogUpdateInput, LockerLogUncheckedUpdateInput>
  }

  /**
   * LockerLog delete
   */
  export type LockerLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LockerLog
     */
    select?: LockerLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LockerLogInclude<ExtArgs> | null
    /**
     * Filter which LockerLog to delete.
     */
    where: LockerLogWhereUniqueInput
  }

  /**
   * LockerLog deleteMany
   */
  export type LockerLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LockerLogs to delete
     */
    where?: LockerLogWhereInput
  }

  /**
   * LockerLog.cabinet
   */
  export type LockerLog$cabinetArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cabinet
     */
    select?: CabinetSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CabinetInclude<ExtArgs> | null
    where?: CabinetWhereInput
  }

  /**
   * LockerLog.compartment
   */
  export type LockerLog$compartmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Compartment
     */
    select?: CompartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompartmentInclude<ExtArgs> | null
    where?: CompartmentWhereInput
  }

  /**
   * LockerLog.rental
   */
  export type LockerLog$rentalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    where?: RentalWhereInput
  }

  /**
   * LockerLog without action
   */
  export type LockerLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LockerLog
     */
    select?: LockerLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LockerLogInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    body: string | null
    type: $Enums.NotificationType | null
    isRead: boolean | null
    sentAt: Date | null
    createdAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    body: string | null
    type: $Enums.NotificationType | null
    isRead: boolean | null
    sentAt: Date | null
    createdAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    body: number
    type: number
    data: number
    isRead: number
    sentAt: number
    createdAt: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    body?: true
    type?: true
    isRead?: true
    sentAt?: true
    createdAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    body?: true
    type?: true
    isRead?: true
    sentAt?: true
    createdAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    body?: true
    type?: true
    data?: true
    isRead?: true
    sentAt?: true
    createdAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    userId: string | null
    title: string
    body: string
    type: $Enums.NotificationType
    data: JsonValue | null
    isRead: boolean
    sentAt: Date
    createdAt: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    body?: boolean
    type?: boolean
    data?: boolean
    isRead?: boolean
    sentAt?: boolean
    createdAt?: boolean
    user?: boolean | Notification$userArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    body?: boolean
    type?: boolean
    data?: boolean
    isRead?: boolean
    sentAt?: boolean
    createdAt?: boolean
    user?: boolean | Notification$userArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    body?: boolean
    type?: boolean
    data?: boolean
    isRead?: boolean
    sentAt?: boolean
    createdAt?: boolean
  }

  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Notification$userArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Notification$userArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      title: string
      body: string
      type: $Enums.NotificationType
      data: Prisma.JsonValue | null
      isRead: boolean
      sentAt: Date
      createdAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Notification$userArgs<ExtArgs> = {}>(args?: Subset<T, Notification$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */ 
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly userId: FieldRef<"Notification", 'String'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly body: FieldRef<"Notification", 'String'>
    readonly type: FieldRef<"Notification", 'NotificationType'>
    readonly data: FieldRef<"Notification", 'Json'>
    readonly isRead: FieldRef<"Notification", 'Boolean'>
    readonly sentAt: FieldRef<"Notification", 'DateTime'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
  }

  /**
   * Notification.user
   */
  export type Notification$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Model UserSession
   */

  export type AggregateUserSession = {
    _count: UserSessionCountAggregateOutputType | null
    _min: UserSessionMinAggregateOutputType | null
    _max: UserSessionMaxAggregateOutputType | null
  }

  export type UserSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    socketId: string | null
    deviceType: $Enums.DeviceType | null
    deviceInfo: string | null
    connectedAt: Date | null
    disconnectedAt: Date | null
    isActive: boolean | null
  }

  export type UserSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    socketId: string | null
    deviceType: $Enums.DeviceType | null
    deviceInfo: string | null
    connectedAt: Date | null
    disconnectedAt: Date | null
    isActive: boolean | null
  }

  export type UserSessionCountAggregateOutputType = {
    id: number
    userId: number
    socketId: number
    deviceType: number
    deviceInfo: number
    connectedAt: number
    disconnectedAt: number
    isActive: number
    _all: number
  }


  export type UserSessionMinAggregateInputType = {
    id?: true
    userId?: true
    socketId?: true
    deviceType?: true
    deviceInfo?: true
    connectedAt?: true
    disconnectedAt?: true
    isActive?: true
  }

  export type UserSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    socketId?: true
    deviceType?: true
    deviceInfo?: true
    connectedAt?: true
    disconnectedAt?: true
    isActive?: true
  }

  export type UserSessionCountAggregateInputType = {
    id?: true
    userId?: true
    socketId?: true
    deviceType?: true
    deviceInfo?: true
    connectedAt?: true
    disconnectedAt?: true
    isActive?: true
    _all?: true
  }

  export type UserSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSession to aggregate.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserSessions
    **/
    _count?: true | UserSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserSessionMaxAggregateInputType
  }

  export type GetUserSessionAggregateType<T extends UserSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateUserSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserSession[P]>
      : GetScalarType<T[P], AggregateUserSession[P]>
  }




  export type UserSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSessionWhereInput
    orderBy?: UserSessionOrderByWithAggregationInput | UserSessionOrderByWithAggregationInput[]
    by: UserSessionScalarFieldEnum[] | UserSessionScalarFieldEnum
    having?: UserSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserSessionCountAggregateInputType | true
    _min?: UserSessionMinAggregateInputType
    _max?: UserSessionMaxAggregateInputType
  }

  export type UserSessionGroupByOutputType = {
    id: string
    userId: string
    socketId: string
    deviceType: $Enums.DeviceType
    deviceInfo: string | null
    connectedAt: Date
    disconnectedAt: Date | null
    isActive: boolean
    _count: UserSessionCountAggregateOutputType | null
    _min: UserSessionMinAggregateOutputType | null
    _max: UserSessionMaxAggregateOutputType | null
  }

  type GetUserSessionGroupByPayload<T extends UserSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserSessionGroupByOutputType[P]>
            : GetScalarType<T[P], UserSessionGroupByOutputType[P]>
        }
      >
    >


  export type UserSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    socketId?: boolean
    deviceType?: boolean
    deviceInfo?: boolean
    connectedAt?: boolean
    disconnectedAt?: boolean
    isActive?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    socketId?: boolean
    deviceType?: boolean
    deviceInfo?: boolean
    connectedAt?: boolean
    disconnectedAt?: boolean
    isActive?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    socketId?: boolean
    deviceType?: boolean
    deviceInfo?: boolean
    connectedAt?: boolean
    disconnectedAt?: boolean
    isActive?: boolean
  }

  export type UserSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      socketId: string
      deviceType: $Enums.DeviceType
      deviceInfo: string | null
      connectedAt: Date
      disconnectedAt: Date | null
      isActive: boolean
    }, ExtArgs["result"]["userSession"]>
    composites: {}
  }

  type UserSessionGetPayload<S extends boolean | null | undefined | UserSessionDefaultArgs> = $Result.GetResult<Prisma.$UserSessionPayload, S>

  type UserSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserSessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserSessionCountAggregateInputType | true
    }

  export interface UserSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserSession'], meta: { name: 'UserSession' } }
    /**
     * Find zero or one UserSession that matches the filter.
     * @param {UserSessionFindUniqueArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserSessionFindUniqueArgs>(args: SelectSubset<T, UserSessionFindUniqueArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserSession that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserSessionFindUniqueOrThrowArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, UserSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindFirstArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserSessionFindFirstArgs>(args?: SelectSubset<T, UserSessionFindFirstArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindFirstOrThrowArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, UserSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserSessions
     * const userSessions = await prisma.userSession.findMany()
     * 
     * // Get first 10 UserSessions
     * const userSessions = await prisma.userSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userSessionWithIdOnly = await prisma.userSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserSessionFindManyArgs>(args?: SelectSubset<T, UserSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserSession.
     * @param {UserSessionCreateArgs} args - Arguments to create a UserSession.
     * @example
     * // Create one UserSession
     * const UserSession = await prisma.userSession.create({
     *   data: {
     *     // ... data to create a UserSession
     *   }
     * })
     * 
     */
    create<T extends UserSessionCreateArgs>(args: SelectSubset<T, UserSessionCreateArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserSessions.
     * @param {UserSessionCreateManyArgs} args - Arguments to create many UserSessions.
     * @example
     * // Create many UserSessions
     * const userSession = await prisma.userSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserSessionCreateManyArgs>(args?: SelectSubset<T, UserSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserSessions and returns the data saved in the database.
     * @param {UserSessionCreateManyAndReturnArgs} args - Arguments to create many UserSessions.
     * @example
     * // Create many UserSessions
     * const userSession = await prisma.userSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserSessions and only return the `id`
     * const userSessionWithIdOnly = await prisma.userSession.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, UserSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UserSession.
     * @param {UserSessionDeleteArgs} args - Arguments to delete one UserSession.
     * @example
     * // Delete one UserSession
     * const UserSession = await prisma.userSession.delete({
     *   where: {
     *     // ... filter to delete one UserSession
     *   }
     * })
     * 
     */
    delete<T extends UserSessionDeleteArgs>(args: SelectSubset<T, UserSessionDeleteArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserSession.
     * @param {UserSessionUpdateArgs} args - Arguments to update one UserSession.
     * @example
     * // Update one UserSession
     * const userSession = await prisma.userSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserSessionUpdateArgs>(args: SelectSubset<T, UserSessionUpdateArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserSessions.
     * @param {UserSessionDeleteManyArgs} args - Arguments to filter UserSessions to delete.
     * @example
     * // Delete a few UserSessions
     * const { count } = await prisma.userSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserSessionDeleteManyArgs>(args?: SelectSubset<T, UserSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserSessions
     * const userSession = await prisma.userSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserSessionUpdateManyArgs>(args: SelectSubset<T, UserSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserSession.
     * @param {UserSessionUpsertArgs} args - Arguments to update or create a UserSession.
     * @example
     * // Update or create a UserSession
     * const userSession = await prisma.userSession.upsert({
     *   create: {
     *     // ... data to create a UserSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserSession we want to update
     *   }
     * })
     */
    upsert<T extends UserSessionUpsertArgs>(args: SelectSubset<T, UserSessionUpsertArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UserSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionCountArgs} args - Arguments to filter UserSessions to count.
     * @example
     * // Count the number of UserSessions
     * const count = await prisma.userSession.count({
     *   where: {
     *     // ... the filter for the UserSessions we want to count
     *   }
     * })
    **/
    count<T extends UserSessionCountArgs>(
      args?: Subset<T, UserSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserSessionAggregateArgs>(args: Subset<T, UserSessionAggregateArgs>): Prisma.PrismaPromise<GetUserSessionAggregateType<T>>

    /**
     * Group by UserSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserSessionGroupByArgs['orderBy'] }
        : { orderBy?: UserSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserSession model
   */
  readonly fields: UserSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserSession model
   */ 
  interface UserSessionFieldRefs {
    readonly id: FieldRef<"UserSession", 'String'>
    readonly userId: FieldRef<"UserSession", 'String'>
    readonly socketId: FieldRef<"UserSession", 'String'>
    readonly deviceType: FieldRef<"UserSession", 'DeviceType'>
    readonly deviceInfo: FieldRef<"UserSession", 'String'>
    readonly connectedAt: FieldRef<"UserSession", 'DateTime'>
    readonly disconnectedAt: FieldRef<"UserSession", 'DateTime'>
    readonly isActive: FieldRef<"UserSession", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * UserSession findUnique
   */
  export type UserSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession findUniqueOrThrow
   */
  export type UserSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession findFirst
   */
  export type UserSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSessions.
     */
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession findFirstOrThrow
   */
  export type UserSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSessions.
     */
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession findMany
   */
  export type UserSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSessions to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession create
   */
  export type UserSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a UserSession.
     */
    data: XOR<UserSessionCreateInput, UserSessionUncheckedCreateInput>
  }

  /**
   * UserSession createMany
   */
  export type UserSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserSessions.
     */
    data: UserSessionCreateManyInput | UserSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserSession createManyAndReturn
   */
  export type UserSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UserSessions.
     */
    data: UserSessionCreateManyInput | UserSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserSession update
   */
  export type UserSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a UserSession.
     */
    data: XOR<UserSessionUpdateInput, UserSessionUncheckedUpdateInput>
    /**
     * Choose, which UserSession to update.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession updateMany
   */
  export type UserSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserSessions.
     */
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyInput>
    /**
     * Filter which UserSessions to update
     */
    where?: UserSessionWhereInput
  }

  /**
   * UserSession upsert
   */
  export type UserSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the UserSession to update in case it exists.
     */
    where: UserSessionWhereUniqueInput
    /**
     * In case the UserSession found by the `where` argument doesn't exist, create a new UserSession with this data.
     */
    create: XOR<UserSessionCreateInput, UserSessionUncheckedCreateInput>
    /**
     * In case the UserSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserSessionUpdateInput, UserSessionUncheckedUpdateInput>
  }

  /**
   * UserSession delete
   */
  export type UserSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter which UserSession to delete.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession deleteMany
   */
  export type UserSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSessions to delete
     */
    where?: UserSessionWhereInput
  }

  /**
   * UserSession without action
   */
  export type UserSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AdminScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    name: 'name',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AdminScalarFieldEnum = (typeof AdminScalarFieldEnum)[keyof typeof AdminScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    phone: 'phone',
    passwordHash: 'passwordHash',
    name: 'name',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const LocationScalarFieldEnum: {
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

  export type LocationScalarFieldEnum = (typeof LocationScalarFieldEnum)[keyof typeof LocationScalarFieldEnum]


  export const CabinetScalarFieldEnum: {
    id: 'id',
    locationId: 'locationId',
    name: 'name',
    status: 'status',
    lastHeartbeatAt: 'lastHeartbeatAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CabinetScalarFieldEnum = (typeof CabinetScalarFieldEnum)[keyof typeof CabinetScalarFieldEnum]


  export const McpDeviceScalarFieldEnum: {
    id: 'id',
    cabinetId: 'cabinetId',
    bus: 'bus',
    address: 'address',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type McpDeviceScalarFieldEnum = (typeof McpDeviceScalarFieldEnum)[keyof typeof McpDeviceScalarFieldEnum]


  export const CompartmentScalarFieldEnum: {
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

  export type CompartmentScalarFieldEnum = (typeof CompartmentScalarFieldEnum)[keyof typeof CompartmentScalarFieldEnum]


  export const CompartmentStatusScalarFieldEnum: {
    id: 'id',
    compartmentId: 'compartmentId',
    lockStatus: 'lockStatus',
    doorStatus: 'doorStatus',
    lastUpdatedAt: 'lastUpdatedAt'
  };

  export type CompartmentStatusScalarFieldEnum = (typeof CompartmentStatusScalarFieldEnum)[keyof typeof CompartmentStatusScalarFieldEnum]


  export const PricePlanScalarFieldEnum: {
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

  export type PricePlanScalarFieldEnum = (typeof PricePlanScalarFieldEnum)[keyof typeof PricePlanScalarFieldEnum]


  export const RentalScalarFieldEnum: {
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

  export type RentalScalarFieldEnum = (typeof RentalScalarFieldEnum)[keyof typeof RentalScalarFieldEnum]


  export const LockerLogScalarFieldEnum: {
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

  export type LockerLogScalarFieldEnum = (typeof LockerLogScalarFieldEnum)[keyof typeof LockerLogScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
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

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const UserSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    socketId: 'socketId',
    deviceType: 'deviceType',
    deviceInfo: 'deviceInfo',
    connectedAt: 'connectedAt',
    disconnectedAt: 'disconnectedAt',
    isActive: 'isActive'
  };

  export type UserSessionScalarFieldEnum = (typeof UserSessionScalarFieldEnum)[keyof typeof UserSessionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'AdminRole'
   */
  export type EnumAdminRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AdminRole'>
    


  /**
   * Reference to a field of type 'AdminRole[]'
   */
  export type ListEnumAdminRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AdminRole[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'UserStatus'
   */
  export type EnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus'>
    


  /**
   * Reference to a field of type 'UserStatus[]'
   */
  export type ListEnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'LocationStatus'
   */
  export type EnumLocationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LocationStatus'>
    


  /**
   * Reference to a field of type 'LocationStatus[]'
   */
  export type ListEnumLocationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LocationStatus[]'>
    


  /**
   * Reference to a field of type 'CabinetStatus'
   */
  export type EnumCabinetStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CabinetStatus'>
    


  /**
   * Reference to a field of type 'CabinetStatus[]'
   */
  export type ListEnumCabinetStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CabinetStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'CompartmentSize'
   */
  export type EnumCompartmentSizeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CompartmentSize'>
    


  /**
   * Reference to a field of type 'CompartmentSize[]'
   */
  export type ListEnumCompartmentSizeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CompartmentSize[]'>
    


  /**
   * Reference to a field of type 'CompartmentAvailability'
   */
  export type EnumCompartmentAvailabilityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CompartmentAvailability'>
    


  /**
   * Reference to a field of type 'CompartmentAvailability[]'
   */
  export type ListEnumCompartmentAvailabilityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CompartmentAvailability[]'>
    


  /**
   * Reference to a field of type 'LockStatus'
   */
  export type EnumLockStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LockStatus'>
    


  /**
   * Reference to a field of type 'LockStatus[]'
   */
  export type ListEnumLockStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LockStatus[]'>
    


  /**
   * Reference to a field of type 'DoorStatus'
   */
  export type EnumDoorStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DoorStatus'>
    


  /**
   * Reference to a field of type 'DoorStatus[]'
   */
  export type ListEnumDoorStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DoorStatus[]'>
    


  /**
   * Reference to a field of type 'RentalType'
   */
  export type EnumRentalTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RentalType'>
    


  /**
   * Reference to a field of type 'RentalType[]'
   */
  export type ListEnumRentalTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RentalType[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'PaymentStatus'
   */
  export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus'>
    


  /**
   * Reference to a field of type 'PaymentStatus[]'
   */
  export type ListEnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus[]'>
    


  /**
   * Reference to a field of type 'PaymentMethod'
   */
  export type EnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod'>
    


  /**
   * Reference to a field of type 'PaymentMethod[]'
   */
  export type ListEnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod[]'>
    


  /**
   * Reference to a field of type 'RentalStatus'
   */
  export type EnumRentalStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RentalStatus'>
    


  /**
   * Reference to a field of type 'RentalStatus[]'
   */
  export type ListEnumRentalStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RentalStatus[]'>
    


  /**
   * Reference to a field of type 'LockerAction'
   */
  export type EnumLockerActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LockerAction'>
    


  /**
   * Reference to a field of type 'LockerAction[]'
   */
  export type ListEnumLockerActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LockerAction[]'>
    


  /**
   * Reference to a field of type 'NotificationType'
   */
  export type EnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType'>
    


  /**
   * Reference to a field of type 'NotificationType[]'
   */
  export type ListEnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'DeviceType'
   */
  export type EnumDeviceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeviceType'>
    


  /**
   * Reference to a field of type 'DeviceType[]'
   */
  export type ListEnumDeviceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeviceType[]'>
    
  /**
   * Deep Input Types
   */


  export type AdminWhereInput = {
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    id?: StringFilter<"Admin"> | string
    email?: StringFilter<"Admin"> | string
    passwordHash?: StringFilter<"Admin"> | string
    name?: StringFilter<"Admin"> | string
    role?: EnumAdminRoleFilter<"Admin"> | $Enums.AdminRole
    createdAt?: DateTimeFilter<"Admin"> | Date | string
    updatedAt?: DateTimeFilter<"Admin"> | Date | string
  }

  export type AdminOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    passwordHash?: StringFilter<"Admin"> | string
    name?: StringFilter<"Admin"> | string
    role?: EnumAdminRoleFilter<"Admin"> | $Enums.AdminRole
    createdAt?: DateTimeFilter<"Admin"> | Date | string
    updatedAt?: DateTimeFilter<"Admin"> | Date | string
  }, "id" | "email">

  export type AdminOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AdminCountOrderByAggregateInput
    _max?: AdminMaxOrderByAggregateInput
    _min?: AdminMinOrderByAggregateInput
  }

  export type AdminScalarWhereWithAggregatesInput = {
    AND?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    OR?: AdminScalarWhereWithAggregatesInput[]
    NOT?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Admin"> | string
    email?: StringWithAggregatesFilter<"Admin"> | string
    passwordHash?: StringWithAggregatesFilter<"Admin"> | string
    name?: StringWithAggregatesFilter<"Admin"> | string
    role?: EnumAdminRoleWithAggregatesFilter<"Admin"> | $Enums.AdminRole
    createdAt?: DateTimeWithAggregatesFilter<"Admin"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Admin"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    phone?: StringFilter<"User"> | string
    passwordHash?: StringNullableFilter<"User"> | string | null
    name?: StringNullableFilter<"User"> | string | null
    status?: EnumUserStatusFilter<"User"> | $Enums.UserStatus
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    rentals?: RentalListRelationFilter
    notifications?: NotificationListRelationFilter
    sessions?: UserSessionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    rentals?: RentalOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
    sessions?: UserSessionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    phone?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringNullableFilter<"User"> | string | null
    name?: StringNullableFilter<"User"> | string | null
    status?: EnumUserStatusFilter<"User"> | $Enums.UserStatus
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    rentals?: RentalListRelationFilter
    notifications?: NotificationListRelationFilter
    sessions?: UserSessionListRelationFilter
  }, "id" | "email" | "phone">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    phone?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringNullableWithAggregatesFilter<"User"> | string | null
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    status?: EnumUserStatusWithAggregatesFilter<"User"> | $Enums.UserStatus
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type LocationWhereInput = {
    AND?: LocationWhereInput | LocationWhereInput[]
    OR?: LocationWhereInput[]
    NOT?: LocationWhereInput | LocationWhereInput[]
    id?: StringFilter<"Location"> | string
    name?: StringFilter<"Location"> | string
    address?: StringFilter<"Location"> | string
    latitude?: FloatNullableFilter<"Location"> | number | null
    longitude?: FloatNullableFilter<"Location"> | number | null
    googlePlaceId?: StringNullableFilter<"Location"> | string | null
    mapImageUrl?: StringNullableFilter<"Location"> | string | null
    status?: EnumLocationStatusFilter<"Location"> | $Enums.LocationStatus
    createdAt?: DateTimeFilter<"Location"> | Date | string
    updatedAt?: DateTimeFilter<"Location"> | Date | string
    cabinets?: CabinetListRelationFilter
  }

  export type LocationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    googlePlaceId?: SortOrderInput | SortOrder
    mapImageUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cabinets?: CabinetOrderByRelationAggregateInput
  }

  export type LocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    googlePlaceId?: string
    AND?: LocationWhereInput | LocationWhereInput[]
    OR?: LocationWhereInput[]
    NOT?: LocationWhereInput | LocationWhereInput[]
    name?: StringFilter<"Location"> | string
    address?: StringFilter<"Location"> | string
    latitude?: FloatNullableFilter<"Location"> | number | null
    longitude?: FloatNullableFilter<"Location"> | number | null
    mapImageUrl?: StringNullableFilter<"Location"> | string | null
    status?: EnumLocationStatusFilter<"Location"> | $Enums.LocationStatus
    createdAt?: DateTimeFilter<"Location"> | Date | string
    updatedAt?: DateTimeFilter<"Location"> | Date | string
    cabinets?: CabinetListRelationFilter
  }, "id" | "googlePlaceId">

  export type LocationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    googlePlaceId?: SortOrderInput | SortOrder
    mapImageUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LocationCountOrderByAggregateInput
    _avg?: LocationAvgOrderByAggregateInput
    _max?: LocationMaxOrderByAggregateInput
    _min?: LocationMinOrderByAggregateInput
    _sum?: LocationSumOrderByAggregateInput
  }

  export type LocationScalarWhereWithAggregatesInput = {
    AND?: LocationScalarWhereWithAggregatesInput | LocationScalarWhereWithAggregatesInput[]
    OR?: LocationScalarWhereWithAggregatesInput[]
    NOT?: LocationScalarWhereWithAggregatesInput | LocationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Location"> | string
    name?: StringWithAggregatesFilter<"Location"> | string
    address?: StringWithAggregatesFilter<"Location"> | string
    latitude?: FloatNullableWithAggregatesFilter<"Location"> | number | null
    longitude?: FloatNullableWithAggregatesFilter<"Location"> | number | null
    googlePlaceId?: StringNullableWithAggregatesFilter<"Location"> | string | null
    mapImageUrl?: StringNullableWithAggregatesFilter<"Location"> | string | null
    status?: EnumLocationStatusWithAggregatesFilter<"Location"> | $Enums.LocationStatus
    createdAt?: DateTimeWithAggregatesFilter<"Location"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Location"> | Date | string
  }

  export type CabinetWhereInput = {
    AND?: CabinetWhereInput | CabinetWhereInput[]
    OR?: CabinetWhereInput[]
    NOT?: CabinetWhereInput | CabinetWhereInput[]
    id?: StringFilter<"Cabinet"> | string
    locationId?: StringFilter<"Cabinet"> | string
    name?: StringFilter<"Cabinet"> | string
    status?: EnumCabinetStatusFilter<"Cabinet"> | $Enums.CabinetStatus
    lastHeartbeatAt?: DateTimeNullableFilter<"Cabinet"> | Date | string | null
    createdAt?: DateTimeFilter<"Cabinet"> | Date | string
    updatedAt?: DateTimeFilter<"Cabinet"> | Date | string
    location?: XOR<LocationRelationFilter, LocationWhereInput>
    compartments?: CompartmentListRelationFilter
    mcpDevices?: McpDeviceListRelationFilter
    logs?: LockerLogListRelationFilter
  }

  export type CabinetOrderByWithRelationInput = {
    id?: SortOrder
    locationId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    lastHeartbeatAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    location?: LocationOrderByWithRelationInput
    compartments?: CompartmentOrderByRelationAggregateInput
    mcpDevices?: McpDeviceOrderByRelationAggregateInput
    logs?: LockerLogOrderByRelationAggregateInput
  }

  export type CabinetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CabinetWhereInput | CabinetWhereInput[]
    OR?: CabinetWhereInput[]
    NOT?: CabinetWhereInput | CabinetWhereInput[]
    locationId?: StringFilter<"Cabinet"> | string
    name?: StringFilter<"Cabinet"> | string
    status?: EnumCabinetStatusFilter<"Cabinet"> | $Enums.CabinetStatus
    lastHeartbeatAt?: DateTimeNullableFilter<"Cabinet"> | Date | string | null
    createdAt?: DateTimeFilter<"Cabinet"> | Date | string
    updatedAt?: DateTimeFilter<"Cabinet"> | Date | string
    location?: XOR<LocationRelationFilter, LocationWhereInput>
    compartments?: CompartmentListRelationFilter
    mcpDevices?: McpDeviceListRelationFilter
    logs?: LockerLogListRelationFilter
  }, "id">

  export type CabinetOrderByWithAggregationInput = {
    id?: SortOrder
    locationId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    lastHeartbeatAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CabinetCountOrderByAggregateInput
    _max?: CabinetMaxOrderByAggregateInput
    _min?: CabinetMinOrderByAggregateInput
  }

  export type CabinetScalarWhereWithAggregatesInput = {
    AND?: CabinetScalarWhereWithAggregatesInput | CabinetScalarWhereWithAggregatesInput[]
    OR?: CabinetScalarWhereWithAggregatesInput[]
    NOT?: CabinetScalarWhereWithAggregatesInput | CabinetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Cabinet"> | string
    locationId?: StringWithAggregatesFilter<"Cabinet"> | string
    name?: StringWithAggregatesFilter<"Cabinet"> | string
    status?: EnumCabinetStatusWithAggregatesFilter<"Cabinet"> | $Enums.CabinetStatus
    lastHeartbeatAt?: DateTimeNullableWithAggregatesFilter<"Cabinet"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Cabinet"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Cabinet"> | Date | string
  }

  export type McpDeviceWhereInput = {
    AND?: McpDeviceWhereInput | McpDeviceWhereInput[]
    OR?: McpDeviceWhereInput[]
    NOT?: McpDeviceWhereInput | McpDeviceWhereInput[]
    id?: StringFilter<"McpDevice"> | string
    cabinetId?: StringFilter<"McpDevice"> | string
    bus?: IntFilter<"McpDevice"> | number
    address?: IntFilter<"McpDevice"> | number
    name?: StringNullableFilter<"McpDevice"> | string | null
    createdAt?: DateTimeFilter<"McpDevice"> | Date | string
    updatedAt?: DateTimeFilter<"McpDevice"> | Date | string
    cabinet?: XOR<CabinetRelationFilter, CabinetWhereInput>
    lockCompartments?: CompartmentListRelationFilter
    sensorCompartments?: CompartmentListRelationFilter
  }

  export type McpDeviceOrderByWithRelationInput = {
    id?: SortOrder
    cabinetId?: SortOrder
    bus?: SortOrder
    address?: SortOrder
    name?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cabinet?: CabinetOrderByWithRelationInput
    lockCompartments?: CompartmentOrderByRelationAggregateInput
    sensorCompartments?: CompartmentOrderByRelationAggregateInput
  }

  export type McpDeviceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    cabinetId_bus_address?: McpDeviceCabinetIdBusAddressCompoundUniqueInput
    AND?: McpDeviceWhereInput | McpDeviceWhereInput[]
    OR?: McpDeviceWhereInput[]
    NOT?: McpDeviceWhereInput | McpDeviceWhereInput[]
    cabinetId?: StringFilter<"McpDevice"> | string
    bus?: IntFilter<"McpDevice"> | number
    address?: IntFilter<"McpDevice"> | number
    name?: StringNullableFilter<"McpDevice"> | string | null
    createdAt?: DateTimeFilter<"McpDevice"> | Date | string
    updatedAt?: DateTimeFilter<"McpDevice"> | Date | string
    cabinet?: XOR<CabinetRelationFilter, CabinetWhereInput>
    lockCompartments?: CompartmentListRelationFilter
    sensorCompartments?: CompartmentListRelationFilter
  }, "id" | "cabinetId_bus_address">

  export type McpDeviceOrderByWithAggregationInput = {
    id?: SortOrder
    cabinetId?: SortOrder
    bus?: SortOrder
    address?: SortOrder
    name?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: McpDeviceCountOrderByAggregateInput
    _avg?: McpDeviceAvgOrderByAggregateInput
    _max?: McpDeviceMaxOrderByAggregateInput
    _min?: McpDeviceMinOrderByAggregateInput
    _sum?: McpDeviceSumOrderByAggregateInput
  }

  export type McpDeviceScalarWhereWithAggregatesInput = {
    AND?: McpDeviceScalarWhereWithAggregatesInput | McpDeviceScalarWhereWithAggregatesInput[]
    OR?: McpDeviceScalarWhereWithAggregatesInput[]
    NOT?: McpDeviceScalarWhereWithAggregatesInput | McpDeviceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"McpDevice"> | string
    cabinetId?: StringWithAggregatesFilter<"McpDevice"> | string
    bus?: IntWithAggregatesFilter<"McpDevice"> | number
    address?: IntWithAggregatesFilter<"McpDevice"> | number
    name?: StringNullableWithAggregatesFilter<"McpDevice"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"McpDevice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"McpDevice"> | Date | string
  }

  export type CompartmentWhereInput = {
    AND?: CompartmentWhereInput | CompartmentWhereInput[]
    OR?: CompartmentWhereInput[]
    NOT?: CompartmentWhereInput | CompartmentWhereInput[]
    id?: StringFilter<"Compartment"> | string
    cabinetId?: StringFilter<"Compartment"> | string
    name?: StringFilter<"Compartment"> | string
    size?: EnumCompartmentSizeFilter<"Compartment"> | $Enums.CompartmentSize
    mcp23017PinLock?: IntFilter<"Compartment"> | number
    mcp23017PinSensor?: IntFilter<"Compartment"> | number
    lockMcpDeviceId?: StringNullableFilter<"Compartment"> | string | null
    sensorMcpDeviceId?: StringNullableFilter<"Compartment"> | string | null
    status?: EnumCompartmentAvailabilityFilter<"Compartment"> | $Enums.CompartmentAvailability
    createdAt?: DateTimeFilter<"Compartment"> | Date | string
    updatedAt?: DateTimeFilter<"Compartment"> | Date | string
    cabinet?: XOR<CabinetRelationFilter, CabinetWhereInput>
    lockMcpDevice?: XOR<McpDeviceNullableRelationFilter, McpDeviceWhereInput> | null
    sensorMcpDevice?: XOR<McpDeviceNullableRelationFilter, McpDeviceWhereInput> | null
    rentals?: RentalListRelationFilter
    logs?: LockerLogListRelationFilter
    realtimeStatus?: XOR<CompartmentStatusNullableRelationFilter, CompartmentStatusWhereInput> | null
  }

  export type CompartmentOrderByWithRelationInput = {
    id?: SortOrder
    cabinetId?: SortOrder
    name?: SortOrder
    size?: SortOrder
    mcp23017PinLock?: SortOrder
    mcp23017PinSensor?: SortOrder
    lockMcpDeviceId?: SortOrderInput | SortOrder
    sensorMcpDeviceId?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cabinet?: CabinetOrderByWithRelationInput
    lockMcpDevice?: McpDeviceOrderByWithRelationInput
    sensorMcpDevice?: McpDeviceOrderByWithRelationInput
    rentals?: RentalOrderByRelationAggregateInput
    logs?: LockerLogOrderByRelationAggregateInput
    realtimeStatus?: CompartmentStatusOrderByWithRelationInput
  }

  export type CompartmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    cabinetId_name?: CompartmentCabinetIdNameCompoundUniqueInput
    AND?: CompartmentWhereInput | CompartmentWhereInput[]
    OR?: CompartmentWhereInput[]
    NOT?: CompartmentWhereInput | CompartmentWhereInput[]
    cabinetId?: StringFilter<"Compartment"> | string
    name?: StringFilter<"Compartment"> | string
    size?: EnumCompartmentSizeFilter<"Compartment"> | $Enums.CompartmentSize
    mcp23017PinLock?: IntFilter<"Compartment"> | number
    mcp23017PinSensor?: IntFilter<"Compartment"> | number
    lockMcpDeviceId?: StringNullableFilter<"Compartment"> | string | null
    sensorMcpDeviceId?: StringNullableFilter<"Compartment"> | string | null
    status?: EnumCompartmentAvailabilityFilter<"Compartment"> | $Enums.CompartmentAvailability
    createdAt?: DateTimeFilter<"Compartment"> | Date | string
    updatedAt?: DateTimeFilter<"Compartment"> | Date | string
    cabinet?: XOR<CabinetRelationFilter, CabinetWhereInput>
    lockMcpDevice?: XOR<McpDeviceNullableRelationFilter, McpDeviceWhereInput> | null
    sensorMcpDevice?: XOR<McpDeviceNullableRelationFilter, McpDeviceWhereInput> | null
    rentals?: RentalListRelationFilter
    logs?: LockerLogListRelationFilter
    realtimeStatus?: XOR<CompartmentStatusNullableRelationFilter, CompartmentStatusWhereInput> | null
  }, "id" | "cabinetId_name">

  export type CompartmentOrderByWithAggregationInput = {
    id?: SortOrder
    cabinetId?: SortOrder
    name?: SortOrder
    size?: SortOrder
    mcp23017PinLock?: SortOrder
    mcp23017PinSensor?: SortOrder
    lockMcpDeviceId?: SortOrderInput | SortOrder
    sensorMcpDeviceId?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CompartmentCountOrderByAggregateInput
    _avg?: CompartmentAvgOrderByAggregateInput
    _max?: CompartmentMaxOrderByAggregateInput
    _min?: CompartmentMinOrderByAggregateInput
    _sum?: CompartmentSumOrderByAggregateInput
  }

  export type CompartmentScalarWhereWithAggregatesInput = {
    AND?: CompartmentScalarWhereWithAggregatesInput | CompartmentScalarWhereWithAggregatesInput[]
    OR?: CompartmentScalarWhereWithAggregatesInput[]
    NOT?: CompartmentScalarWhereWithAggregatesInput | CompartmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Compartment"> | string
    cabinetId?: StringWithAggregatesFilter<"Compartment"> | string
    name?: StringWithAggregatesFilter<"Compartment"> | string
    size?: EnumCompartmentSizeWithAggregatesFilter<"Compartment"> | $Enums.CompartmentSize
    mcp23017PinLock?: IntWithAggregatesFilter<"Compartment"> | number
    mcp23017PinSensor?: IntWithAggregatesFilter<"Compartment"> | number
    lockMcpDeviceId?: StringNullableWithAggregatesFilter<"Compartment"> | string | null
    sensorMcpDeviceId?: StringNullableWithAggregatesFilter<"Compartment"> | string | null
    status?: EnumCompartmentAvailabilityWithAggregatesFilter<"Compartment"> | $Enums.CompartmentAvailability
    createdAt?: DateTimeWithAggregatesFilter<"Compartment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Compartment"> | Date | string
  }

  export type CompartmentStatusWhereInput = {
    AND?: CompartmentStatusWhereInput | CompartmentStatusWhereInput[]
    OR?: CompartmentStatusWhereInput[]
    NOT?: CompartmentStatusWhereInput | CompartmentStatusWhereInput[]
    id?: StringFilter<"CompartmentStatus"> | string
    compartmentId?: StringFilter<"CompartmentStatus"> | string
    lockStatus?: EnumLockStatusFilter<"CompartmentStatus"> | $Enums.LockStatus
    doorStatus?: EnumDoorStatusFilter<"CompartmentStatus"> | $Enums.DoorStatus
    lastUpdatedAt?: DateTimeFilter<"CompartmentStatus"> | Date | string
    compartment?: XOR<CompartmentRelationFilter, CompartmentWhereInput>
  }

  export type CompartmentStatusOrderByWithRelationInput = {
    id?: SortOrder
    compartmentId?: SortOrder
    lockStatus?: SortOrder
    doorStatus?: SortOrder
    lastUpdatedAt?: SortOrder
    compartment?: CompartmentOrderByWithRelationInput
  }

  export type CompartmentStatusWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    compartmentId?: string
    AND?: CompartmentStatusWhereInput | CompartmentStatusWhereInput[]
    OR?: CompartmentStatusWhereInput[]
    NOT?: CompartmentStatusWhereInput | CompartmentStatusWhereInput[]
    lockStatus?: EnumLockStatusFilter<"CompartmentStatus"> | $Enums.LockStatus
    doorStatus?: EnumDoorStatusFilter<"CompartmentStatus"> | $Enums.DoorStatus
    lastUpdatedAt?: DateTimeFilter<"CompartmentStatus"> | Date | string
    compartment?: XOR<CompartmentRelationFilter, CompartmentWhereInput>
  }, "id" | "compartmentId">

  export type CompartmentStatusOrderByWithAggregationInput = {
    id?: SortOrder
    compartmentId?: SortOrder
    lockStatus?: SortOrder
    doorStatus?: SortOrder
    lastUpdatedAt?: SortOrder
    _count?: CompartmentStatusCountOrderByAggregateInput
    _max?: CompartmentStatusMaxOrderByAggregateInput
    _min?: CompartmentStatusMinOrderByAggregateInput
  }

  export type CompartmentStatusScalarWhereWithAggregatesInput = {
    AND?: CompartmentStatusScalarWhereWithAggregatesInput | CompartmentStatusScalarWhereWithAggregatesInput[]
    OR?: CompartmentStatusScalarWhereWithAggregatesInput[]
    NOT?: CompartmentStatusScalarWhereWithAggregatesInput | CompartmentStatusScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CompartmentStatus"> | string
    compartmentId?: StringWithAggregatesFilter<"CompartmentStatus"> | string
    lockStatus?: EnumLockStatusWithAggregatesFilter<"CompartmentStatus"> | $Enums.LockStatus
    doorStatus?: EnumDoorStatusWithAggregatesFilter<"CompartmentStatus"> | $Enums.DoorStatus
    lastUpdatedAt?: DateTimeWithAggregatesFilter<"CompartmentStatus"> | Date | string
  }

  export type PricePlanWhereInput = {
    AND?: PricePlanWhereInput | PricePlanWhereInput[]
    OR?: PricePlanWhereInput[]
    NOT?: PricePlanWhereInput | PricePlanWhereInput[]
    id?: StringFilter<"PricePlan"> | string
    name?: StringFilter<"PricePlan"> | string
    size?: EnumCompartmentSizeFilter<"PricePlan"> | $Enums.CompartmentSize
    rentalType?: EnumRentalTypeFilter<"PricePlan"> | $Enums.RentalType
    price?: IntFilter<"PricePlan"> | number
    maxOpens?: IntNullableFilter<"PricePlan"> | number | null
    durationDays?: IntFilter<"PricePlan"> | number
    description?: StringNullableFilter<"PricePlan"> | string | null
    isActive?: BoolFilter<"PricePlan"> | boolean
    createdAt?: DateTimeFilter<"PricePlan"> | Date | string
    updatedAt?: DateTimeFilter<"PricePlan"> | Date | string
    rentals?: RentalListRelationFilter
  }

  export type PricePlanOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    size?: SortOrder
    rentalType?: SortOrder
    price?: SortOrder
    maxOpens?: SortOrderInput | SortOrder
    durationDays?: SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    rentals?: RentalOrderByRelationAggregateInput
  }

  export type PricePlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PricePlanWhereInput | PricePlanWhereInput[]
    OR?: PricePlanWhereInput[]
    NOT?: PricePlanWhereInput | PricePlanWhereInput[]
    name?: StringFilter<"PricePlan"> | string
    size?: EnumCompartmentSizeFilter<"PricePlan"> | $Enums.CompartmentSize
    rentalType?: EnumRentalTypeFilter<"PricePlan"> | $Enums.RentalType
    price?: IntFilter<"PricePlan"> | number
    maxOpens?: IntNullableFilter<"PricePlan"> | number | null
    durationDays?: IntFilter<"PricePlan"> | number
    description?: StringNullableFilter<"PricePlan"> | string | null
    isActive?: BoolFilter<"PricePlan"> | boolean
    createdAt?: DateTimeFilter<"PricePlan"> | Date | string
    updatedAt?: DateTimeFilter<"PricePlan"> | Date | string
    rentals?: RentalListRelationFilter
  }, "id">

  export type PricePlanOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    size?: SortOrder
    rentalType?: SortOrder
    price?: SortOrder
    maxOpens?: SortOrderInput | SortOrder
    durationDays?: SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PricePlanCountOrderByAggregateInput
    _avg?: PricePlanAvgOrderByAggregateInput
    _max?: PricePlanMaxOrderByAggregateInput
    _min?: PricePlanMinOrderByAggregateInput
    _sum?: PricePlanSumOrderByAggregateInput
  }

  export type PricePlanScalarWhereWithAggregatesInput = {
    AND?: PricePlanScalarWhereWithAggregatesInput | PricePlanScalarWhereWithAggregatesInput[]
    OR?: PricePlanScalarWhereWithAggregatesInput[]
    NOT?: PricePlanScalarWhereWithAggregatesInput | PricePlanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PricePlan"> | string
    name?: StringWithAggregatesFilter<"PricePlan"> | string
    size?: EnumCompartmentSizeWithAggregatesFilter<"PricePlan"> | $Enums.CompartmentSize
    rentalType?: EnumRentalTypeWithAggregatesFilter<"PricePlan"> | $Enums.RentalType
    price?: IntWithAggregatesFilter<"PricePlan"> | number
    maxOpens?: IntNullableWithAggregatesFilter<"PricePlan"> | number | null
    durationDays?: IntWithAggregatesFilter<"PricePlan"> | number
    description?: StringNullableWithAggregatesFilter<"PricePlan"> | string | null
    isActive?: BoolWithAggregatesFilter<"PricePlan"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"PricePlan"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PricePlan"> | Date | string
  }

  export type RentalWhereInput = {
    AND?: RentalWhereInput | RentalWhereInput[]
    OR?: RentalWhereInput[]
    NOT?: RentalWhereInput | RentalWhereInput[]
    id?: StringFilter<"Rental"> | string
    userId?: StringNullableFilter<"Rental"> | string | null
    compartmentId?: StringFilter<"Rental"> | string
    pricePlanId?: StringFilter<"Rental"> | string
    code?: StringFilter<"Rental"> | string
    codeHash?: StringFilter<"Rental"> | string
    qrToken?: StringFilter<"Rental"> | string
    openCount?: IntFilter<"Rental"> | number
    maxOpens?: IntFilter<"Rental"> | number
    expiresAt?: DateTimeFilter<"Rental"> | Date | string
    paymentStatus?: EnumPaymentStatusFilter<"Rental"> | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFilter<"Rental"> | $Enums.PaymentMethod
    paidAt?: DateTimeNullableFilter<"Rental"> | Date | string | null
    status?: EnumRentalStatusFilter<"Rental"> | $Enums.RentalStatus
    createdAt?: DateTimeFilter<"Rental"> | Date | string
    updatedAt?: DateTimeFilter<"Rental"> | Date | string
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    compartment?: XOR<CompartmentRelationFilter, CompartmentWhereInput>
    pricePlan?: XOR<PricePlanRelationFilter, PricePlanWhereInput>
    logs?: LockerLogListRelationFilter
  }

  export type RentalOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    compartmentId?: SortOrder
    pricePlanId?: SortOrder
    code?: SortOrder
    codeHash?: SortOrder
    qrToken?: SortOrder
    openCount?: SortOrder
    maxOpens?: SortOrder
    expiresAt?: SortOrder
    paymentStatus?: SortOrder
    paymentMethod?: SortOrder
    paidAt?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    compartment?: CompartmentOrderByWithRelationInput
    pricePlan?: PricePlanOrderByWithRelationInput
    logs?: LockerLogOrderByRelationAggregateInput
  }

  export type RentalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    qrToken?: string
    AND?: RentalWhereInput | RentalWhereInput[]
    OR?: RentalWhereInput[]
    NOT?: RentalWhereInput | RentalWhereInput[]
    userId?: StringNullableFilter<"Rental"> | string | null
    compartmentId?: StringFilter<"Rental"> | string
    pricePlanId?: StringFilter<"Rental"> | string
    codeHash?: StringFilter<"Rental"> | string
    openCount?: IntFilter<"Rental"> | number
    maxOpens?: IntFilter<"Rental"> | number
    expiresAt?: DateTimeFilter<"Rental"> | Date | string
    paymentStatus?: EnumPaymentStatusFilter<"Rental"> | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFilter<"Rental"> | $Enums.PaymentMethod
    paidAt?: DateTimeNullableFilter<"Rental"> | Date | string | null
    status?: EnumRentalStatusFilter<"Rental"> | $Enums.RentalStatus
    createdAt?: DateTimeFilter<"Rental"> | Date | string
    updatedAt?: DateTimeFilter<"Rental"> | Date | string
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    compartment?: XOR<CompartmentRelationFilter, CompartmentWhereInput>
    pricePlan?: XOR<PricePlanRelationFilter, PricePlanWhereInput>
    logs?: LockerLogListRelationFilter
  }, "id" | "code" | "qrToken">

  export type RentalOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    compartmentId?: SortOrder
    pricePlanId?: SortOrder
    code?: SortOrder
    codeHash?: SortOrder
    qrToken?: SortOrder
    openCount?: SortOrder
    maxOpens?: SortOrder
    expiresAt?: SortOrder
    paymentStatus?: SortOrder
    paymentMethod?: SortOrder
    paidAt?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RentalCountOrderByAggregateInput
    _avg?: RentalAvgOrderByAggregateInput
    _max?: RentalMaxOrderByAggregateInput
    _min?: RentalMinOrderByAggregateInput
    _sum?: RentalSumOrderByAggregateInput
  }

  export type RentalScalarWhereWithAggregatesInput = {
    AND?: RentalScalarWhereWithAggregatesInput | RentalScalarWhereWithAggregatesInput[]
    OR?: RentalScalarWhereWithAggregatesInput[]
    NOT?: RentalScalarWhereWithAggregatesInput | RentalScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Rental"> | string
    userId?: StringNullableWithAggregatesFilter<"Rental"> | string | null
    compartmentId?: StringWithAggregatesFilter<"Rental"> | string
    pricePlanId?: StringWithAggregatesFilter<"Rental"> | string
    code?: StringWithAggregatesFilter<"Rental"> | string
    codeHash?: StringWithAggregatesFilter<"Rental"> | string
    qrToken?: StringWithAggregatesFilter<"Rental"> | string
    openCount?: IntWithAggregatesFilter<"Rental"> | number
    maxOpens?: IntWithAggregatesFilter<"Rental"> | number
    expiresAt?: DateTimeWithAggregatesFilter<"Rental"> | Date | string
    paymentStatus?: EnumPaymentStatusWithAggregatesFilter<"Rental"> | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodWithAggregatesFilter<"Rental"> | $Enums.PaymentMethod
    paidAt?: DateTimeNullableWithAggregatesFilter<"Rental"> | Date | string | null
    status?: EnumRentalStatusWithAggregatesFilter<"Rental"> | $Enums.RentalStatus
    createdAt?: DateTimeWithAggregatesFilter<"Rental"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Rental"> | Date | string
  }

  export type LockerLogWhereInput = {
    AND?: LockerLogWhereInput | LockerLogWhereInput[]
    OR?: LockerLogWhereInput[]
    NOT?: LockerLogWhereInput | LockerLogWhereInput[]
    id?: StringFilter<"LockerLog"> | string
    cabinetId?: StringNullableFilter<"LockerLog"> | string | null
    compartmentId?: StringNullableFilter<"LockerLog"> | string | null
    rentalId?: StringNullableFilter<"LockerLog"> | string | null
    action?: EnumLockerActionFilter<"LockerLog"> | $Enums.LockerAction
    attemptCount?: IntFilter<"LockerLog"> | number
    success?: BoolFilter<"LockerLog"> | boolean
    ipAddress?: StringNullableFilter<"LockerLog"> | string | null
    deviceInfo?: StringNullableFilter<"LockerLog"> | string | null
    note?: StringNullableFilter<"LockerLog"> | string | null
    createdAt?: DateTimeFilter<"LockerLog"> | Date | string
    cabinet?: XOR<CabinetNullableRelationFilter, CabinetWhereInput> | null
    compartment?: XOR<CompartmentNullableRelationFilter, CompartmentWhereInput> | null
    rental?: XOR<RentalNullableRelationFilter, RentalWhereInput> | null
  }

  export type LockerLogOrderByWithRelationInput = {
    id?: SortOrder
    cabinetId?: SortOrderInput | SortOrder
    compartmentId?: SortOrderInput | SortOrder
    rentalId?: SortOrderInput | SortOrder
    action?: SortOrder
    attemptCount?: SortOrder
    success?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    deviceInfo?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    cabinet?: CabinetOrderByWithRelationInput
    compartment?: CompartmentOrderByWithRelationInput
    rental?: RentalOrderByWithRelationInput
  }

  export type LockerLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LockerLogWhereInput | LockerLogWhereInput[]
    OR?: LockerLogWhereInput[]
    NOT?: LockerLogWhereInput | LockerLogWhereInput[]
    cabinetId?: StringNullableFilter<"LockerLog"> | string | null
    compartmentId?: StringNullableFilter<"LockerLog"> | string | null
    rentalId?: StringNullableFilter<"LockerLog"> | string | null
    action?: EnumLockerActionFilter<"LockerLog"> | $Enums.LockerAction
    attemptCount?: IntFilter<"LockerLog"> | number
    success?: BoolFilter<"LockerLog"> | boolean
    ipAddress?: StringNullableFilter<"LockerLog"> | string | null
    deviceInfo?: StringNullableFilter<"LockerLog"> | string | null
    note?: StringNullableFilter<"LockerLog"> | string | null
    createdAt?: DateTimeFilter<"LockerLog"> | Date | string
    cabinet?: XOR<CabinetNullableRelationFilter, CabinetWhereInput> | null
    compartment?: XOR<CompartmentNullableRelationFilter, CompartmentWhereInput> | null
    rental?: XOR<RentalNullableRelationFilter, RentalWhereInput> | null
  }, "id">

  export type LockerLogOrderByWithAggregationInput = {
    id?: SortOrder
    cabinetId?: SortOrderInput | SortOrder
    compartmentId?: SortOrderInput | SortOrder
    rentalId?: SortOrderInput | SortOrder
    action?: SortOrder
    attemptCount?: SortOrder
    success?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    deviceInfo?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: LockerLogCountOrderByAggregateInput
    _avg?: LockerLogAvgOrderByAggregateInput
    _max?: LockerLogMaxOrderByAggregateInput
    _min?: LockerLogMinOrderByAggregateInput
    _sum?: LockerLogSumOrderByAggregateInput
  }

  export type LockerLogScalarWhereWithAggregatesInput = {
    AND?: LockerLogScalarWhereWithAggregatesInput | LockerLogScalarWhereWithAggregatesInput[]
    OR?: LockerLogScalarWhereWithAggregatesInput[]
    NOT?: LockerLogScalarWhereWithAggregatesInput | LockerLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LockerLog"> | string
    cabinetId?: StringNullableWithAggregatesFilter<"LockerLog"> | string | null
    compartmentId?: StringNullableWithAggregatesFilter<"LockerLog"> | string | null
    rentalId?: StringNullableWithAggregatesFilter<"LockerLog"> | string | null
    action?: EnumLockerActionWithAggregatesFilter<"LockerLog"> | $Enums.LockerAction
    attemptCount?: IntWithAggregatesFilter<"LockerLog"> | number
    success?: BoolWithAggregatesFilter<"LockerLog"> | boolean
    ipAddress?: StringNullableWithAggregatesFilter<"LockerLog"> | string | null
    deviceInfo?: StringNullableWithAggregatesFilter<"LockerLog"> | string | null
    note?: StringNullableWithAggregatesFilter<"LockerLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LockerLog"> | Date | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringNullableFilter<"Notification"> | string | null
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    data?: JsonNullableFilter<"Notification">
    isRead?: BoolFilter<"Notification"> | boolean
    sentAt?: DateTimeFilter<"Notification"> | Date | string
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    title?: SortOrder
    body?: SortOrder
    type?: SortOrder
    data?: SortOrderInput | SortOrder
    isRead?: SortOrder
    sentAt?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    userId?: StringNullableFilter<"Notification"> | string | null
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    data?: JsonNullableFilter<"Notification">
    isRead?: BoolFilter<"Notification"> | boolean
    sentAt?: DateTimeFilter<"Notification"> | Date | string
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    title?: SortOrder
    body?: SortOrder
    type?: SortOrder
    data?: SortOrderInput | SortOrder
    isRead?: SortOrder
    sentAt?: SortOrder
    createdAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    userId?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    title?: StringWithAggregatesFilter<"Notification"> | string
    body?: StringWithAggregatesFilter<"Notification"> | string
    type?: EnumNotificationTypeWithAggregatesFilter<"Notification"> | $Enums.NotificationType
    data?: JsonNullableWithAggregatesFilter<"Notification">
    isRead?: BoolWithAggregatesFilter<"Notification"> | boolean
    sentAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type UserSessionWhereInput = {
    AND?: UserSessionWhereInput | UserSessionWhereInput[]
    OR?: UserSessionWhereInput[]
    NOT?: UserSessionWhereInput | UserSessionWhereInput[]
    id?: StringFilter<"UserSession"> | string
    userId?: StringFilter<"UserSession"> | string
    socketId?: StringFilter<"UserSession"> | string
    deviceType?: EnumDeviceTypeFilter<"UserSession"> | $Enums.DeviceType
    deviceInfo?: StringNullableFilter<"UserSession"> | string | null
    connectedAt?: DateTimeFilter<"UserSession"> | Date | string
    disconnectedAt?: DateTimeNullableFilter<"UserSession"> | Date | string | null
    isActive?: BoolFilter<"UserSession"> | boolean
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type UserSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    socketId?: SortOrder
    deviceType?: SortOrder
    deviceInfo?: SortOrderInput | SortOrder
    connectedAt?: SortOrder
    disconnectedAt?: SortOrderInput | SortOrder
    isActive?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    socketId?: string
    AND?: UserSessionWhereInput | UserSessionWhereInput[]
    OR?: UserSessionWhereInput[]
    NOT?: UserSessionWhereInput | UserSessionWhereInput[]
    userId?: StringFilter<"UserSession"> | string
    deviceType?: EnumDeviceTypeFilter<"UserSession"> | $Enums.DeviceType
    deviceInfo?: StringNullableFilter<"UserSession"> | string | null
    connectedAt?: DateTimeFilter<"UserSession"> | Date | string
    disconnectedAt?: DateTimeNullableFilter<"UserSession"> | Date | string | null
    isActive?: BoolFilter<"UserSession"> | boolean
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "socketId">

  export type UserSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    socketId?: SortOrder
    deviceType?: SortOrder
    deviceInfo?: SortOrderInput | SortOrder
    connectedAt?: SortOrder
    disconnectedAt?: SortOrderInput | SortOrder
    isActive?: SortOrder
    _count?: UserSessionCountOrderByAggregateInput
    _max?: UserSessionMaxOrderByAggregateInput
    _min?: UserSessionMinOrderByAggregateInput
  }

  export type UserSessionScalarWhereWithAggregatesInput = {
    AND?: UserSessionScalarWhereWithAggregatesInput | UserSessionScalarWhereWithAggregatesInput[]
    OR?: UserSessionScalarWhereWithAggregatesInput[]
    NOT?: UserSessionScalarWhereWithAggregatesInput | UserSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserSession"> | string
    userId?: StringWithAggregatesFilter<"UserSession"> | string
    socketId?: StringWithAggregatesFilter<"UserSession"> | string
    deviceType?: EnumDeviceTypeWithAggregatesFilter<"UserSession"> | $Enums.DeviceType
    deviceInfo?: StringNullableWithAggregatesFilter<"UserSession"> | string | null
    connectedAt?: DateTimeWithAggregatesFilter<"UserSession"> | Date | string
    disconnectedAt?: DateTimeNullableWithAggregatesFilter<"UserSession"> | Date | string | null
    isActive?: BoolWithAggregatesFilter<"UserSession"> | boolean
  }

  export type AdminCreateInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    role?: $Enums.AdminRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    role?: $Enums.AdminRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumAdminRoleFieldUpdateOperationsInput | $Enums.AdminRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumAdminRoleFieldUpdateOperationsInput | $Enums.AdminRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    name: string
    role?: $Enums.AdminRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumAdminRoleFieldUpdateOperationsInput | $Enums.AdminRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumAdminRoleFieldUpdateOperationsInput | $Enums.AdminRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email?: string | null
    phone: string
    passwordHash?: string | null
    name?: string | null
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email?: string | null
    phone: string
    passwordHash?: string | null
    name?: string | null
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email?: string | null
    phone: string
    passwordHash?: string | null
    name?: string | null
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationCreateInput = {
    id?: string
    name: string
    address: string
    latitude?: number | null
    longitude?: number | null
    googlePlaceId?: string | null
    mapImageUrl?: string | null
    status?: $Enums.LocationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    cabinets?: CabinetCreateNestedManyWithoutLocationInput
  }

  export type LocationUncheckedCreateInput = {
    id?: string
    name: string
    address: string
    latitude?: number | null
    longitude?: number | null
    googlePlaceId?: string | null
    mapImageUrl?: string | null
    status?: $Enums.LocationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    cabinets?: CabinetUncheckedCreateNestedManyWithoutLocationInput
  }

  export type LocationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    googlePlaceId?: NullableStringFieldUpdateOperationsInput | string | null
    mapImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLocationStatusFieldUpdateOperationsInput | $Enums.LocationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cabinets?: CabinetUpdateManyWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    googlePlaceId?: NullableStringFieldUpdateOperationsInput | string | null
    mapImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLocationStatusFieldUpdateOperationsInput | $Enums.LocationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cabinets?: CabinetUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type LocationCreateManyInput = {
    id?: string
    name: string
    address: string
    latitude?: number | null
    longitude?: number | null
    googlePlaceId?: string | null
    mapImageUrl?: string | null
    status?: $Enums.LocationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    googlePlaceId?: NullableStringFieldUpdateOperationsInput | string | null
    mapImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLocationStatusFieldUpdateOperationsInput | $Enums.LocationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    googlePlaceId?: NullableStringFieldUpdateOperationsInput | string | null
    mapImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLocationStatusFieldUpdateOperationsInput | $Enums.LocationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CabinetCreateInput = {
    id?: string
    name: string
    status?: $Enums.CabinetStatus
    lastHeartbeatAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    location: LocationCreateNestedOneWithoutCabinetsInput
    compartments?: CompartmentCreateNestedManyWithoutCabinetInput
    mcpDevices?: McpDeviceCreateNestedManyWithoutCabinetInput
    logs?: LockerLogCreateNestedManyWithoutCabinetInput
  }

  export type CabinetUncheckedCreateInput = {
    id?: string
    locationId: string
    name: string
    status?: $Enums.CabinetStatus
    lastHeartbeatAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    compartments?: CompartmentUncheckedCreateNestedManyWithoutCabinetInput
    mcpDevices?: McpDeviceUncheckedCreateNestedManyWithoutCabinetInput
    logs?: LockerLogUncheckedCreateNestedManyWithoutCabinetInput
  }

  export type CabinetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumCabinetStatusFieldUpdateOperationsInput | $Enums.CabinetStatus
    lastHeartbeatAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: LocationUpdateOneRequiredWithoutCabinetsNestedInput
    compartments?: CompartmentUpdateManyWithoutCabinetNestedInput
    mcpDevices?: McpDeviceUpdateManyWithoutCabinetNestedInput
    logs?: LockerLogUpdateManyWithoutCabinetNestedInput
  }

  export type CabinetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    locationId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumCabinetStatusFieldUpdateOperationsInput | $Enums.CabinetStatus
    lastHeartbeatAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    compartments?: CompartmentUncheckedUpdateManyWithoutCabinetNestedInput
    mcpDevices?: McpDeviceUncheckedUpdateManyWithoutCabinetNestedInput
    logs?: LockerLogUncheckedUpdateManyWithoutCabinetNestedInput
  }

  export type CabinetCreateManyInput = {
    id?: string
    locationId: string
    name: string
    status?: $Enums.CabinetStatus
    lastHeartbeatAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CabinetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumCabinetStatusFieldUpdateOperationsInput | $Enums.CabinetStatus
    lastHeartbeatAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CabinetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    locationId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumCabinetStatusFieldUpdateOperationsInput | $Enums.CabinetStatus
    lastHeartbeatAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type McpDeviceCreateInput = {
    id?: string
    bus?: number
    address?: number
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cabinet: CabinetCreateNestedOneWithoutMcpDevicesInput
    lockCompartments?: CompartmentCreateNestedManyWithoutLockMcpDeviceInput
    sensorCompartments?: CompartmentCreateNestedManyWithoutSensorMcpDeviceInput
  }

  export type McpDeviceUncheckedCreateInput = {
    id?: string
    cabinetId: string
    bus?: number
    address?: number
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lockCompartments?: CompartmentUncheckedCreateNestedManyWithoutLockMcpDeviceInput
    sensorCompartments?: CompartmentUncheckedCreateNestedManyWithoutSensorMcpDeviceInput
  }

  export type McpDeviceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bus?: IntFieldUpdateOperationsInput | number
    address?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cabinet?: CabinetUpdateOneRequiredWithoutMcpDevicesNestedInput
    lockCompartments?: CompartmentUpdateManyWithoutLockMcpDeviceNestedInput
    sensorCompartments?: CompartmentUpdateManyWithoutSensorMcpDeviceNestedInput
  }

  export type McpDeviceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: StringFieldUpdateOperationsInput | string
    bus?: IntFieldUpdateOperationsInput | number
    address?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lockCompartments?: CompartmentUncheckedUpdateManyWithoutLockMcpDeviceNestedInput
    sensorCompartments?: CompartmentUncheckedUpdateManyWithoutSensorMcpDeviceNestedInput
  }

  export type McpDeviceCreateManyInput = {
    id?: string
    cabinetId: string
    bus?: number
    address?: number
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type McpDeviceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    bus?: IntFieldUpdateOperationsInput | number
    address?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type McpDeviceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: StringFieldUpdateOperationsInput | string
    bus?: IntFieldUpdateOperationsInput | number
    address?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompartmentCreateInput = {
    id?: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    status?: $Enums.CompartmentAvailability
    createdAt?: Date | string
    updatedAt?: Date | string
    cabinet: CabinetCreateNestedOneWithoutCompartmentsInput
    lockMcpDevice?: McpDeviceCreateNestedOneWithoutLockCompartmentsInput
    sensorMcpDevice?: McpDeviceCreateNestedOneWithoutSensorCompartmentsInput
    rentals?: RentalCreateNestedManyWithoutCompartmentInput
    logs?: LockerLogCreateNestedManyWithoutCompartmentInput
    realtimeStatus?: CompartmentStatusCreateNestedOneWithoutCompartmentInput
  }

  export type CompartmentUncheckedCreateInput = {
    id?: string
    cabinetId: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    lockMcpDeviceId?: string | null
    sensorMcpDeviceId?: string | null
    status?: $Enums.CompartmentAvailability
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalUncheckedCreateNestedManyWithoutCompartmentInput
    logs?: LockerLogUncheckedCreateNestedManyWithoutCompartmentInput
    realtimeStatus?: CompartmentStatusUncheckedCreateNestedOneWithoutCompartmentInput
  }

  export type CompartmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cabinet?: CabinetUpdateOneRequiredWithoutCompartmentsNestedInput
    lockMcpDevice?: McpDeviceUpdateOneWithoutLockCompartmentsNestedInput
    sensorMcpDevice?: McpDeviceUpdateOneWithoutSensorCompartmentsNestedInput
    rentals?: RentalUpdateManyWithoutCompartmentNestedInput
    logs?: LockerLogUpdateManyWithoutCompartmentNestedInput
    realtimeStatus?: CompartmentStatusUpdateOneWithoutCompartmentNestedInput
  }

  export type CompartmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    lockMcpDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    sensorMcpDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUncheckedUpdateManyWithoutCompartmentNestedInput
    logs?: LockerLogUncheckedUpdateManyWithoutCompartmentNestedInput
    realtimeStatus?: CompartmentStatusUncheckedUpdateOneWithoutCompartmentNestedInput
  }

  export type CompartmentCreateManyInput = {
    id?: string
    cabinetId: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    lockMcpDeviceId?: string | null
    sensorMcpDeviceId?: string | null
    status?: $Enums.CompartmentAvailability
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CompartmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompartmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    lockMcpDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    sensorMcpDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompartmentStatusCreateInput = {
    id?: string
    lockStatus?: $Enums.LockStatus
    doorStatus?: $Enums.DoorStatus
    lastUpdatedAt?: Date | string
    compartment: CompartmentCreateNestedOneWithoutRealtimeStatusInput
  }

  export type CompartmentStatusUncheckedCreateInput = {
    id?: string
    compartmentId: string
    lockStatus?: $Enums.LockStatus
    doorStatus?: $Enums.DoorStatus
    lastUpdatedAt?: Date | string
  }

  export type CompartmentStatusUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lockStatus?: EnumLockStatusFieldUpdateOperationsInput | $Enums.LockStatus
    doorStatus?: EnumDoorStatusFieldUpdateOperationsInput | $Enums.DoorStatus
    lastUpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    compartment?: CompartmentUpdateOneRequiredWithoutRealtimeStatusNestedInput
  }

  export type CompartmentStatusUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    compartmentId?: StringFieldUpdateOperationsInput | string
    lockStatus?: EnumLockStatusFieldUpdateOperationsInput | $Enums.LockStatus
    doorStatus?: EnumDoorStatusFieldUpdateOperationsInput | $Enums.DoorStatus
    lastUpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompartmentStatusCreateManyInput = {
    id?: string
    compartmentId: string
    lockStatus?: $Enums.LockStatus
    doorStatus?: $Enums.DoorStatus
    lastUpdatedAt?: Date | string
  }

  export type CompartmentStatusUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    lockStatus?: EnumLockStatusFieldUpdateOperationsInput | $Enums.LockStatus
    doorStatus?: EnumDoorStatusFieldUpdateOperationsInput | $Enums.DoorStatus
    lastUpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompartmentStatusUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    compartmentId?: StringFieldUpdateOperationsInput | string
    lockStatus?: EnumLockStatusFieldUpdateOperationsInput | $Enums.LockStatus
    doorStatus?: EnumDoorStatusFieldUpdateOperationsInput | $Enums.DoorStatus
    lastUpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PricePlanCreateInput = {
    id?: string
    name: string
    size: $Enums.CompartmentSize
    rentalType: $Enums.RentalType
    price: number
    maxOpens?: number | null
    durationDays: number
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalCreateNestedManyWithoutPricePlanInput
  }

  export type PricePlanUncheckedCreateInput = {
    id?: string
    name: string
    size: $Enums.CompartmentSize
    rentalType: $Enums.RentalType
    price: number
    maxOpens?: number | null
    durationDays: number
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalUncheckedCreateNestedManyWithoutPricePlanInput
  }

  export type PricePlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    rentalType?: EnumRentalTypeFieldUpdateOperationsInput | $Enums.RentalType
    price?: IntFieldUpdateOperationsInput | number
    maxOpens?: NullableIntFieldUpdateOperationsInput | number | null
    durationDays?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUpdateManyWithoutPricePlanNestedInput
  }

  export type PricePlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    rentalType?: EnumRentalTypeFieldUpdateOperationsInput | $Enums.RentalType
    price?: IntFieldUpdateOperationsInput | number
    maxOpens?: NullableIntFieldUpdateOperationsInput | number | null
    durationDays?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUncheckedUpdateManyWithoutPricePlanNestedInput
  }

  export type PricePlanCreateManyInput = {
    id?: string
    name: string
    size: $Enums.CompartmentSize
    rentalType: $Enums.RentalType
    price: number
    maxOpens?: number | null
    durationDays: number
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PricePlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    rentalType?: EnumRentalTypeFieldUpdateOperationsInput | $Enums.RentalType
    price?: IntFieldUpdateOperationsInput | number
    maxOpens?: NullableIntFieldUpdateOperationsInput | number | null
    durationDays?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PricePlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    rentalType?: EnumRentalTypeFieldUpdateOperationsInput | $Enums.RentalType
    price?: IntFieldUpdateOperationsInput | number
    maxOpens?: NullableIntFieldUpdateOperationsInput | number | null
    durationDays?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RentalCreateInput = {
    id?: string
    code: string
    codeHash: string
    qrToken: string
    openCount?: number
    maxOpens: number
    expiresAt: Date | string
    paymentStatus?: $Enums.PaymentStatus
    paymentMethod?: $Enums.PaymentMethod
    paidAt?: Date | string | null
    status?: $Enums.RentalStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutRentalsInput
    compartment: CompartmentCreateNestedOneWithoutRentalsInput
    pricePlan: PricePlanCreateNestedOneWithoutRentalsInput
    logs?: LockerLogCreateNestedManyWithoutRentalInput
  }

  export type RentalUncheckedCreateInput = {
    id?: string
    userId?: string | null
    compartmentId: string
    pricePlanId: string
    code: string
    codeHash: string
    qrToken: string
    openCount?: number
    maxOpens: number
    expiresAt: Date | string
    paymentStatus?: $Enums.PaymentStatus
    paymentMethod?: $Enums.PaymentMethod
    paidAt?: Date | string | null
    status?: $Enums.RentalStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    logs?: LockerLogUncheckedCreateNestedManyWithoutRentalInput
  }

  export type RentalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    qrToken?: StringFieldUpdateOperationsInput | string
    openCount?: IntFieldUpdateOperationsInput | number
    maxOpens?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRentalStatusFieldUpdateOperationsInput | $Enums.RentalStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutRentalsNestedInput
    compartment?: CompartmentUpdateOneRequiredWithoutRentalsNestedInput
    pricePlan?: PricePlanUpdateOneRequiredWithoutRentalsNestedInput
    logs?: LockerLogUpdateManyWithoutRentalNestedInput
  }

  export type RentalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    compartmentId?: StringFieldUpdateOperationsInput | string
    pricePlanId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    qrToken?: StringFieldUpdateOperationsInput | string
    openCount?: IntFieldUpdateOperationsInput | number
    maxOpens?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRentalStatusFieldUpdateOperationsInput | $Enums.RentalStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    logs?: LockerLogUncheckedUpdateManyWithoutRentalNestedInput
  }

  export type RentalCreateManyInput = {
    id?: string
    userId?: string | null
    compartmentId: string
    pricePlanId: string
    code: string
    codeHash: string
    qrToken: string
    openCount?: number
    maxOpens: number
    expiresAt: Date | string
    paymentStatus?: $Enums.PaymentStatus
    paymentMethod?: $Enums.PaymentMethod
    paidAt?: Date | string | null
    status?: $Enums.RentalStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RentalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    qrToken?: StringFieldUpdateOperationsInput | string
    openCount?: IntFieldUpdateOperationsInput | number
    maxOpens?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRentalStatusFieldUpdateOperationsInput | $Enums.RentalStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RentalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    compartmentId?: StringFieldUpdateOperationsInput | string
    pricePlanId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    qrToken?: StringFieldUpdateOperationsInput | string
    openCount?: IntFieldUpdateOperationsInput | number
    maxOpens?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRentalStatusFieldUpdateOperationsInput | $Enums.RentalStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LockerLogCreateInput = {
    id?: string
    action: $Enums.LockerAction
    attemptCount?: number
    success: boolean
    ipAddress?: string | null
    deviceInfo?: string | null
    note?: string | null
    createdAt?: Date | string
    cabinet?: CabinetCreateNestedOneWithoutLogsInput
    compartment?: CompartmentCreateNestedOneWithoutLogsInput
    rental?: RentalCreateNestedOneWithoutLogsInput
  }

  export type LockerLogUncheckedCreateInput = {
    id?: string
    cabinetId?: string | null
    compartmentId?: string | null
    rentalId?: string | null
    action: $Enums.LockerAction
    attemptCount?: number
    success: boolean
    ipAddress?: string | null
    deviceInfo?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type LockerLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumLockerActionFieldUpdateOperationsInput | $Enums.LockerAction
    attemptCount?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cabinet?: CabinetUpdateOneWithoutLogsNestedInput
    compartment?: CompartmentUpdateOneWithoutLogsNestedInput
    rental?: RentalUpdateOneWithoutLogsNestedInput
  }

  export type LockerLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: NullableStringFieldUpdateOperationsInput | string | null
    compartmentId?: NullableStringFieldUpdateOperationsInput | string | null
    rentalId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: EnumLockerActionFieldUpdateOperationsInput | $Enums.LockerAction
    attemptCount?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LockerLogCreateManyInput = {
    id?: string
    cabinetId?: string | null
    compartmentId?: string | null
    rentalId?: string | null
    action: $Enums.LockerAction
    attemptCount?: number
    success: boolean
    ipAddress?: string | null
    deviceInfo?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type LockerLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumLockerActionFieldUpdateOperationsInput | $Enums.LockerAction
    attemptCount?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LockerLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: NullableStringFieldUpdateOperationsInput | string | null
    compartmentId?: NullableStringFieldUpdateOperationsInput | string | null
    rentalId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: EnumLockerActionFieldUpdateOperationsInput | $Enums.LockerAction
    attemptCount?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateInput = {
    id?: string
    title: string
    body: string
    type: $Enums.NotificationType
    data?: NullableJsonNullValueInput | InputJsonValue
    isRead?: boolean
    sentAt?: Date | string
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    userId?: string | null
    title: string
    body: string
    type: $Enums.NotificationType
    data?: NullableJsonNullValueInput | InputJsonValue
    isRead?: boolean
    sentAt?: Date | string
    createdAt?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    data?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    data?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    userId?: string | null
    title: string
    body: string
    type: $Enums.NotificationType
    data?: NullableJsonNullValueInput | InputJsonValue
    isRead?: boolean
    sentAt?: Date | string
    createdAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    data?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    data?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionCreateInput = {
    id?: string
    socketId: string
    deviceType: $Enums.DeviceType
    deviceInfo?: string | null
    connectedAt?: Date | string
    disconnectedAt?: Date | string | null
    isActive?: boolean
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type UserSessionUncheckedCreateInput = {
    id?: string
    userId: string
    socketId: string
    deviceType: $Enums.DeviceType
    deviceInfo?: string | null
    connectedAt?: Date | string
    disconnectedAt?: Date | string | null
    isActive?: boolean
  }

  export type UserSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    socketId?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    connectedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disconnectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type UserSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    socketId?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    connectedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disconnectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserSessionCreateManyInput = {
    id?: string
    userId: string
    socketId: string
    deviceType: $Enums.DeviceType
    deviceInfo?: string | null
    connectedAt?: Date | string
    disconnectedAt?: Date | string | null
    isActive?: boolean
  }

  export type UserSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    socketId?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    connectedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disconnectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    socketId?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    connectedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disconnectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumAdminRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.AdminRole | EnumAdminRoleFieldRefInput<$PrismaModel>
    in?: $Enums.AdminRole[] | ListEnumAdminRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AdminRole[] | ListEnumAdminRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumAdminRoleFilter<$PrismaModel> | $Enums.AdminRole
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AdminCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumAdminRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AdminRole | EnumAdminRoleFieldRefInput<$PrismaModel>
    in?: $Enums.AdminRole[] | ListEnumAdminRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AdminRole[] | ListEnumAdminRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumAdminRoleWithAggregatesFilter<$PrismaModel> | $Enums.AdminRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAdminRoleFilter<$PrismaModel>
    _max?: NestedEnumAdminRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
  }

  export type RentalListRelationFilter = {
    every?: RentalWhereInput
    some?: RentalWhereInput
    none?: RentalWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type UserSessionListRelationFilter = {
    every?: UserSessionWhereInput
    some?: UserSessionWhereInput
    none?: UserSessionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RentalOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type EnumLocationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LocationStatus | EnumLocationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LocationStatus[] | ListEnumLocationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LocationStatus[] | ListEnumLocationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLocationStatusFilter<$PrismaModel> | $Enums.LocationStatus
  }

  export type CabinetListRelationFilter = {
    every?: CabinetWhereInput
    some?: CabinetWhereInput
    none?: CabinetWhereInput
  }

  export type CabinetOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LocationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    googlePlaceId?: SortOrder
    mapImageUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocationAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type LocationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    googlePlaceId?: SortOrder
    mapImageUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    googlePlaceId?: SortOrder
    mapImageUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocationSumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type EnumLocationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LocationStatus | EnumLocationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LocationStatus[] | ListEnumLocationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LocationStatus[] | ListEnumLocationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLocationStatusWithAggregatesFilter<$PrismaModel> | $Enums.LocationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLocationStatusFilter<$PrismaModel>
    _max?: NestedEnumLocationStatusFilter<$PrismaModel>
  }

  export type EnumCabinetStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CabinetStatus | EnumCabinetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CabinetStatus[] | ListEnumCabinetStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CabinetStatus[] | ListEnumCabinetStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCabinetStatusFilter<$PrismaModel> | $Enums.CabinetStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type LocationRelationFilter = {
    is?: LocationWhereInput
    isNot?: LocationWhereInput
  }

  export type CompartmentListRelationFilter = {
    every?: CompartmentWhereInput
    some?: CompartmentWhereInput
    none?: CompartmentWhereInput
  }

  export type McpDeviceListRelationFilter = {
    every?: McpDeviceWhereInput
    some?: McpDeviceWhereInput
    none?: McpDeviceWhereInput
  }

  export type LockerLogListRelationFilter = {
    every?: LockerLogWhereInput
    some?: LockerLogWhereInput
    none?: LockerLogWhereInput
  }

  export type CompartmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type McpDeviceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LockerLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CabinetCountOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    lastHeartbeatAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CabinetMaxOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    lastHeartbeatAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CabinetMinOrderByAggregateInput = {
    id?: SortOrder
    locationId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    lastHeartbeatAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumCabinetStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CabinetStatus | EnumCabinetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CabinetStatus[] | ListEnumCabinetStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CabinetStatus[] | ListEnumCabinetStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCabinetStatusWithAggregatesFilter<$PrismaModel> | $Enums.CabinetStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCabinetStatusFilter<$PrismaModel>
    _max?: NestedEnumCabinetStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type CabinetRelationFilter = {
    is?: CabinetWhereInput
    isNot?: CabinetWhereInput
  }

  export type McpDeviceCabinetIdBusAddressCompoundUniqueInput = {
    cabinetId: string
    bus: number
    address: number
  }

  export type McpDeviceCountOrderByAggregateInput = {
    id?: SortOrder
    cabinetId?: SortOrder
    bus?: SortOrder
    address?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type McpDeviceAvgOrderByAggregateInput = {
    bus?: SortOrder
    address?: SortOrder
  }

  export type McpDeviceMaxOrderByAggregateInput = {
    id?: SortOrder
    cabinetId?: SortOrder
    bus?: SortOrder
    address?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type McpDeviceMinOrderByAggregateInput = {
    id?: SortOrder
    cabinetId?: SortOrder
    bus?: SortOrder
    address?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type McpDeviceSumOrderByAggregateInput = {
    bus?: SortOrder
    address?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumCompartmentSizeFilter<$PrismaModel = never> = {
    equals?: $Enums.CompartmentSize | EnumCompartmentSizeFieldRefInput<$PrismaModel>
    in?: $Enums.CompartmentSize[] | ListEnumCompartmentSizeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CompartmentSize[] | ListEnumCompartmentSizeFieldRefInput<$PrismaModel>
    not?: NestedEnumCompartmentSizeFilter<$PrismaModel> | $Enums.CompartmentSize
  }

  export type EnumCompartmentAvailabilityFilter<$PrismaModel = never> = {
    equals?: $Enums.CompartmentAvailability | EnumCompartmentAvailabilityFieldRefInput<$PrismaModel>
    in?: $Enums.CompartmentAvailability[] | ListEnumCompartmentAvailabilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.CompartmentAvailability[] | ListEnumCompartmentAvailabilityFieldRefInput<$PrismaModel>
    not?: NestedEnumCompartmentAvailabilityFilter<$PrismaModel> | $Enums.CompartmentAvailability
  }

  export type McpDeviceNullableRelationFilter = {
    is?: McpDeviceWhereInput | null
    isNot?: McpDeviceWhereInput | null
  }

  export type CompartmentStatusNullableRelationFilter = {
    is?: CompartmentStatusWhereInput | null
    isNot?: CompartmentStatusWhereInput | null
  }

  export type CompartmentCabinetIdNameCompoundUniqueInput = {
    cabinetId: string
    name: string
  }

  export type CompartmentCountOrderByAggregateInput = {
    id?: SortOrder
    cabinetId?: SortOrder
    name?: SortOrder
    size?: SortOrder
    mcp23017PinLock?: SortOrder
    mcp23017PinSensor?: SortOrder
    lockMcpDeviceId?: SortOrder
    sensorMcpDeviceId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompartmentAvgOrderByAggregateInput = {
    mcp23017PinLock?: SortOrder
    mcp23017PinSensor?: SortOrder
  }

  export type CompartmentMaxOrderByAggregateInput = {
    id?: SortOrder
    cabinetId?: SortOrder
    name?: SortOrder
    size?: SortOrder
    mcp23017PinLock?: SortOrder
    mcp23017PinSensor?: SortOrder
    lockMcpDeviceId?: SortOrder
    sensorMcpDeviceId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompartmentMinOrderByAggregateInput = {
    id?: SortOrder
    cabinetId?: SortOrder
    name?: SortOrder
    size?: SortOrder
    mcp23017PinLock?: SortOrder
    mcp23017PinSensor?: SortOrder
    lockMcpDeviceId?: SortOrder
    sensorMcpDeviceId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompartmentSumOrderByAggregateInput = {
    mcp23017PinLock?: SortOrder
    mcp23017PinSensor?: SortOrder
  }

  export type EnumCompartmentSizeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CompartmentSize | EnumCompartmentSizeFieldRefInput<$PrismaModel>
    in?: $Enums.CompartmentSize[] | ListEnumCompartmentSizeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CompartmentSize[] | ListEnumCompartmentSizeFieldRefInput<$PrismaModel>
    not?: NestedEnumCompartmentSizeWithAggregatesFilter<$PrismaModel> | $Enums.CompartmentSize
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCompartmentSizeFilter<$PrismaModel>
    _max?: NestedEnumCompartmentSizeFilter<$PrismaModel>
  }

  export type EnumCompartmentAvailabilityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CompartmentAvailability | EnumCompartmentAvailabilityFieldRefInput<$PrismaModel>
    in?: $Enums.CompartmentAvailability[] | ListEnumCompartmentAvailabilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.CompartmentAvailability[] | ListEnumCompartmentAvailabilityFieldRefInput<$PrismaModel>
    not?: NestedEnumCompartmentAvailabilityWithAggregatesFilter<$PrismaModel> | $Enums.CompartmentAvailability
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCompartmentAvailabilityFilter<$PrismaModel>
    _max?: NestedEnumCompartmentAvailabilityFilter<$PrismaModel>
  }

  export type EnumLockStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LockStatus | EnumLockStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LockStatus[] | ListEnumLockStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LockStatus[] | ListEnumLockStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLockStatusFilter<$PrismaModel> | $Enums.LockStatus
  }

  export type EnumDoorStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DoorStatus | EnumDoorStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DoorStatus[] | ListEnumDoorStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DoorStatus[] | ListEnumDoorStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDoorStatusFilter<$PrismaModel> | $Enums.DoorStatus
  }

  export type CompartmentRelationFilter = {
    is?: CompartmentWhereInput
    isNot?: CompartmentWhereInput
  }

  export type CompartmentStatusCountOrderByAggregateInput = {
    id?: SortOrder
    compartmentId?: SortOrder
    lockStatus?: SortOrder
    doorStatus?: SortOrder
    lastUpdatedAt?: SortOrder
  }

  export type CompartmentStatusMaxOrderByAggregateInput = {
    id?: SortOrder
    compartmentId?: SortOrder
    lockStatus?: SortOrder
    doorStatus?: SortOrder
    lastUpdatedAt?: SortOrder
  }

  export type CompartmentStatusMinOrderByAggregateInput = {
    id?: SortOrder
    compartmentId?: SortOrder
    lockStatus?: SortOrder
    doorStatus?: SortOrder
    lastUpdatedAt?: SortOrder
  }

  export type EnumLockStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LockStatus | EnumLockStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LockStatus[] | ListEnumLockStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LockStatus[] | ListEnumLockStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLockStatusWithAggregatesFilter<$PrismaModel> | $Enums.LockStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLockStatusFilter<$PrismaModel>
    _max?: NestedEnumLockStatusFilter<$PrismaModel>
  }

  export type EnumDoorStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DoorStatus | EnumDoorStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DoorStatus[] | ListEnumDoorStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DoorStatus[] | ListEnumDoorStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDoorStatusWithAggregatesFilter<$PrismaModel> | $Enums.DoorStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDoorStatusFilter<$PrismaModel>
    _max?: NestedEnumDoorStatusFilter<$PrismaModel>
  }

  export type EnumRentalTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RentalType | EnumRentalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RentalType[] | ListEnumRentalTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RentalType[] | ListEnumRentalTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRentalTypeFilter<$PrismaModel> | $Enums.RentalType
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type PricePlanCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    size?: SortOrder
    rentalType?: SortOrder
    price?: SortOrder
    maxOpens?: SortOrder
    durationDays?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PricePlanAvgOrderByAggregateInput = {
    price?: SortOrder
    maxOpens?: SortOrder
    durationDays?: SortOrder
  }

  export type PricePlanMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    size?: SortOrder
    rentalType?: SortOrder
    price?: SortOrder
    maxOpens?: SortOrder
    durationDays?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PricePlanMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    size?: SortOrder
    rentalType?: SortOrder
    price?: SortOrder
    maxOpens?: SortOrder
    durationDays?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PricePlanSumOrderByAggregateInput = {
    price?: SortOrder
    maxOpens?: SortOrder
    durationDays?: SortOrder
  }

  export type EnumRentalTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RentalType | EnumRentalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RentalType[] | ListEnumRentalTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RentalType[] | ListEnumRentalTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRentalTypeWithAggregatesFilter<$PrismaModel> | $Enums.RentalType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRentalTypeFilter<$PrismaModel>
    _max?: NestedEnumRentalTypeFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type EnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod
  }

  export type EnumRentalStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RentalStatus | EnumRentalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RentalStatus[] | ListEnumRentalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RentalStatus[] | ListEnumRentalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRentalStatusFilter<$PrismaModel> | $Enums.RentalStatus
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type PricePlanRelationFilter = {
    is?: PricePlanWhereInput
    isNot?: PricePlanWhereInput
  }

  export type RentalCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    compartmentId?: SortOrder
    pricePlanId?: SortOrder
    code?: SortOrder
    codeHash?: SortOrder
    qrToken?: SortOrder
    openCount?: SortOrder
    maxOpens?: SortOrder
    expiresAt?: SortOrder
    paymentStatus?: SortOrder
    paymentMethod?: SortOrder
    paidAt?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RentalAvgOrderByAggregateInput = {
    openCount?: SortOrder
    maxOpens?: SortOrder
  }

  export type RentalMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    compartmentId?: SortOrder
    pricePlanId?: SortOrder
    code?: SortOrder
    codeHash?: SortOrder
    qrToken?: SortOrder
    openCount?: SortOrder
    maxOpens?: SortOrder
    expiresAt?: SortOrder
    paymentStatus?: SortOrder
    paymentMethod?: SortOrder
    paidAt?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RentalMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    compartmentId?: SortOrder
    pricePlanId?: SortOrder
    code?: SortOrder
    codeHash?: SortOrder
    qrToken?: SortOrder
    openCount?: SortOrder
    maxOpens?: SortOrder
    expiresAt?: SortOrder
    paymentStatus?: SortOrder
    paymentMethod?: SortOrder
    paidAt?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RentalSumOrderByAggregateInput = {
    openCount?: SortOrder
    maxOpens?: SortOrder
  }

  export type EnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type EnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodFilter<$PrismaModel>
  }

  export type EnumRentalStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RentalStatus | EnumRentalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RentalStatus[] | ListEnumRentalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RentalStatus[] | ListEnumRentalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRentalStatusWithAggregatesFilter<$PrismaModel> | $Enums.RentalStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRentalStatusFilter<$PrismaModel>
    _max?: NestedEnumRentalStatusFilter<$PrismaModel>
  }

  export type EnumLockerActionFilter<$PrismaModel = never> = {
    equals?: $Enums.LockerAction | EnumLockerActionFieldRefInput<$PrismaModel>
    in?: $Enums.LockerAction[] | ListEnumLockerActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.LockerAction[] | ListEnumLockerActionFieldRefInput<$PrismaModel>
    not?: NestedEnumLockerActionFilter<$PrismaModel> | $Enums.LockerAction
  }

  export type CabinetNullableRelationFilter = {
    is?: CabinetWhereInput | null
    isNot?: CabinetWhereInput | null
  }

  export type CompartmentNullableRelationFilter = {
    is?: CompartmentWhereInput | null
    isNot?: CompartmentWhereInput | null
  }

  export type RentalNullableRelationFilter = {
    is?: RentalWhereInput | null
    isNot?: RentalWhereInput | null
  }

  export type LockerLogCountOrderByAggregateInput = {
    id?: SortOrder
    cabinetId?: SortOrder
    compartmentId?: SortOrder
    rentalId?: SortOrder
    action?: SortOrder
    attemptCount?: SortOrder
    success?: SortOrder
    ipAddress?: SortOrder
    deviceInfo?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
  }

  export type LockerLogAvgOrderByAggregateInput = {
    attemptCount?: SortOrder
  }

  export type LockerLogMaxOrderByAggregateInput = {
    id?: SortOrder
    cabinetId?: SortOrder
    compartmentId?: SortOrder
    rentalId?: SortOrder
    action?: SortOrder
    attemptCount?: SortOrder
    success?: SortOrder
    ipAddress?: SortOrder
    deviceInfo?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
  }

  export type LockerLogMinOrderByAggregateInput = {
    id?: SortOrder
    cabinetId?: SortOrder
    compartmentId?: SortOrder
    rentalId?: SortOrder
    action?: SortOrder
    attemptCount?: SortOrder
    success?: SortOrder
    ipAddress?: SortOrder
    deviceInfo?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
  }

  export type LockerLogSumOrderByAggregateInput = {
    attemptCount?: SortOrder
  }

  export type EnumLockerActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LockerAction | EnumLockerActionFieldRefInput<$PrismaModel>
    in?: $Enums.LockerAction[] | ListEnumLockerActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.LockerAction[] | ListEnumLockerActionFieldRefInput<$PrismaModel>
    not?: NestedEnumLockerActionWithAggregatesFilter<$PrismaModel> | $Enums.LockerAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLockerActionFilter<$PrismaModel>
    _max?: NestedEnumLockerActionFilter<$PrismaModel>
  }

  export type EnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    type?: SortOrder
    data?: SortOrder
    isRead?: SortOrder
    sentAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    type?: SortOrder
    isRead?: SortOrder
    sentAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    body?: SortOrder
    type?: SortOrder
    isRead?: SortOrder
    sentAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumDeviceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceType | EnumDeviceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceType[] | ListEnumDeviceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeviceType[] | ListEnumDeviceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceTypeFilter<$PrismaModel> | $Enums.DeviceType
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    socketId?: SortOrder
    deviceType?: SortOrder
    deviceInfo?: SortOrder
    connectedAt?: SortOrder
    disconnectedAt?: SortOrder
    isActive?: SortOrder
  }

  export type UserSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    socketId?: SortOrder
    deviceType?: SortOrder
    deviceInfo?: SortOrder
    connectedAt?: SortOrder
    disconnectedAt?: SortOrder
    isActive?: SortOrder
  }

  export type UserSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    socketId?: SortOrder
    deviceType?: SortOrder
    deviceInfo?: SortOrder
    connectedAt?: SortOrder
    disconnectedAt?: SortOrder
    isActive?: SortOrder
  }

  export type EnumDeviceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceType | EnumDeviceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceType[] | ListEnumDeviceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeviceType[] | ListEnumDeviceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceTypeWithAggregatesFilter<$PrismaModel> | $Enums.DeviceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeviceTypeFilter<$PrismaModel>
    _max?: NestedEnumDeviceTypeFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumAdminRoleFieldUpdateOperationsInput = {
    set?: $Enums.AdminRole
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type RentalCreateNestedManyWithoutUserInput = {
    create?: XOR<RentalCreateWithoutUserInput, RentalUncheckedCreateWithoutUserInput> | RentalCreateWithoutUserInput[] | RentalUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutUserInput | RentalCreateOrConnectWithoutUserInput[]
    createMany?: RentalCreateManyUserInputEnvelope
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type UserSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
  }

  export type RentalUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RentalCreateWithoutUserInput, RentalUncheckedCreateWithoutUserInput> | RentalCreateWithoutUserInput[] | RentalUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutUserInput | RentalCreateOrConnectWithoutUserInput[]
    createMany?: RentalCreateManyUserInputEnvelope
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type UserSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserStatusFieldUpdateOperationsInput = {
    set?: $Enums.UserStatus
  }

  export type RentalUpdateManyWithoutUserNestedInput = {
    create?: XOR<RentalCreateWithoutUserInput, RentalUncheckedCreateWithoutUserInput> | RentalCreateWithoutUserInput[] | RentalUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutUserInput | RentalCreateOrConnectWithoutUserInput[]
    upsert?: RentalUpsertWithWhereUniqueWithoutUserInput | RentalUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RentalCreateManyUserInputEnvelope
    set?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    disconnect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    delete?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    update?: RentalUpdateWithWhereUniqueWithoutUserInput | RentalUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RentalUpdateManyWithWhereWithoutUserInput | RentalUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RentalScalarWhereInput | RentalScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    upsert?: UserSessionUpsertWithWhereUniqueWithoutUserInput | UserSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    set?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    disconnect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    delete?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    update?: UserSessionUpdateWithWhereUniqueWithoutUserInput | UserSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserSessionUpdateManyWithWhereWithoutUserInput | UserSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
  }

  export type RentalUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RentalCreateWithoutUserInput, RentalUncheckedCreateWithoutUserInput> | RentalCreateWithoutUserInput[] | RentalUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutUserInput | RentalCreateOrConnectWithoutUserInput[]
    upsert?: RentalUpsertWithWhereUniqueWithoutUserInput | RentalUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RentalCreateManyUserInputEnvelope
    set?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    disconnect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    delete?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    update?: RentalUpdateWithWhereUniqueWithoutUserInput | RentalUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RentalUpdateManyWithWhereWithoutUserInput | RentalUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RentalScalarWhereInput | RentalScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    upsert?: UserSessionUpsertWithWhereUniqueWithoutUserInput | UserSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    set?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    disconnect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    delete?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    update?: UserSessionUpdateWithWhereUniqueWithoutUserInput | UserSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserSessionUpdateManyWithWhereWithoutUserInput | UserSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
  }

  export type CabinetCreateNestedManyWithoutLocationInput = {
    create?: XOR<CabinetCreateWithoutLocationInput, CabinetUncheckedCreateWithoutLocationInput> | CabinetCreateWithoutLocationInput[] | CabinetUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: CabinetCreateOrConnectWithoutLocationInput | CabinetCreateOrConnectWithoutLocationInput[]
    createMany?: CabinetCreateManyLocationInputEnvelope
    connect?: CabinetWhereUniqueInput | CabinetWhereUniqueInput[]
  }

  export type CabinetUncheckedCreateNestedManyWithoutLocationInput = {
    create?: XOR<CabinetCreateWithoutLocationInput, CabinetUncheckedCreateWithoutLocationInput> | CabinetCreateWithoutLocationInput[] | CabinetUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: CabinetCreateOrConnectWithoutLocationInput | CabinetCreateOrConnectWithoutLocationInput[]
    createMany?: CabinetCreateManyLocationInputEnvelope
    connect?: CabinetWhereUniqueInput | CabinetWhereUniqueInput[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumLocationStatusFieldUpdateOperationsInput = {
    set?: $Enums.LocationStatus
  }

  export type CabinetUpdateManyWithoutLocationNestedInput = {
    create?: XOR<CabinetCreateWithoutLocationInput, CabinetUncheckedCreateWithoutLocationInput> | CabinetCreateWithoutLocationInput[] | CabinetUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: CabinetCreateOrConnectWithoutLocationInput | CabinetCreateOrConnectWithoutLocationInput[]
    upsert?: CabinetUpsertWithWhereUniqueWithoutLocationInput | CabinetUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: CabinetCreateManyLocationInputEnvelope
    set?: CabinetWhereUniqueInput | CabinetWhereUniqueInput[]
    disconnect?: CabinetWhereUniqueInput | CabinetWhereUniqueInput[]
    delete?: CabinetWhereUniqueInput | CabinetWhereUniqueInput[]
    connect?: CabinetWhereUniqueInput | CabinetWhereUniqueInput[]
    update?: CabinetUpdateWithWhereUniqueWithoutLocationInput | CabinetUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: CabinetUpdateManyWithWhereWithoutLocationInput | CabinetUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: CabinetScalarWhereInput | CabinetScalarWhereInput[]
  }

  export type CabinetUncheckedUpdateManyWithoutLocationNestedInput = {
    create?: XOR<CabinetCreateWithoutLocationInput, CabinetUncheckedCreateWithoutLocationInput> | CabinetCreateWithoutLocationInput[] | CabinetUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: CabinetCreateOrConnectWithoutLocationInput | CabinetCreateOrConnectWithoutLocationInput[]
    upsert?: CabinetUpsertWithWhereUniqueWithoutLocationInput | CabinetUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: CabinetCreateManyLocationInputEnvelope
    set?: CabinetWhereUniqueInput | CabinetWhereUniqueInput[]
    disconnect?: CabinetWhereUniqueInput | CabinetWhereUniqueInput[]
    delete?: CabinetWhereUniqueInput | CabinetWhereUniqueInput[]
    connect?: CabinetWhereUniqueInput | CabinetWhereUniqueInput[]
    update?: CabinetUpdateWithWhereUniqueWithoutLocationInput | CabinetUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: CabinetUpdateManyWithWhereWithoutLocationInput | CabinetUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: CabinetScalarWhereInput | CabinetScalarWhereInput[]
  }

  export type LocationCreateNestedOneWithoutCabinetsInput = {
    create?: XOR<LocationCreateWithoutCabinetsInput, LocationUncheckedCreateWithoutCabinetsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutCabinetsInput
    connect?: LocationWhereUniqueInput
  }

  export type CompartmentCreateNestedManyWithoutCabinetInput = {
    create?: XOR<CompartmentCreateWithoutCabinetInput, CompartmentUncheckedCreateWithoutCabinetInput> | CompartmentCreateWithoutCabinetInput[] | CompartmentUncheckedCreateWithoutCabinetInput[]
    connectOrCreate?: CompartmentCreateOrConnectWithoutCabinetInput | CompartmentCreateOrConnectWithoutCabinetInput[]
    createMany?: CompartmentCreateManyCabinetInputEnvelope
    connect?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
  }

  export type McpDeviceCreateNestedManyWithoutCabinetInput = {
    create?: XOR<McpDeviceCreateWithoutCabinetInput, McpDeviceUncheckedCreateWithoutCabinetInput> | McpDeviceCreateWithoutCabinetInput[] | McpDeviceUncheckedCreateWithoutCabinetInput[]
    connectOrCreate?: McpDeviceCreateOrConnectWithoutCabinetInput | McpDeviceCreateOrConnectWithoutCabinetInput[]
    createMany?: McpDeviceCreateManyCabinetInputEnvelope
    connect?: McpDeviceWhereUniqueInput | McpDeviceWhereUniqueInput[]
  }

  export type LockerLogCreateNestedManyWithoutCabinetInput = {
    create?: XOR<LockerLogCreateWithoutCabinetInput, LockerLogUncheckedCreateWithoutCabinetInput> | LockerLogCreateWithoutCabinetInput[] | LockerLogUncheckedCreateWithoutCabinetInput[]
    connectOrCreate?: LockerLogCreateOrConnectWithoutCabinetInput | LockerLogCreateOrConnectWithoutCabinetInput[]
    createMany?: LockerLogCreateManyCabinetInputEnvelope
    connect?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
  }

  export type CompartmentUncheckedCreateNestedManyWithoutCabinetInput = {
    create?: XOR<CompartmentCreateWithoutCabinetInput, CompartmentUncheckedCreateWithoutCabinetInput> | CompartmentCreateWithoutCabinetInput[] | CompartmentUncheckedCreateWithoutCabinetInput[]
    connectOrCreate?: CompartmentCreateOrConnectWithoutCabinetInput | CompartmentCreateOrConnectWithoutCabinetInput[]
    createMany?: CompartmentCreateManyCabinetInputEnvelope
    connect?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
  }

  export type McpDeviceUncheckedCreateNestedManyWithoutCabinetInput = {
    create?: XOR<McpDeviceCreateWithoutCabinetInput, McpDeviceUncheckedCreateWithoutCabinetInput> | McpDeviceCreateWithoutCabinetInput[] | McpDeviceUncheckedCreateWithoutCabinetInput[]
    connectOrCreate?: McpDeviceCreateOrConnectWithoutCabinetInput | McpDeviceCreateOrConnectWithoutCabinetInput[]
    createMany?: McpDeviceCreateManyCabinetInputEnvelope
    connect?: McpDeviceWhereUniqueInput | McpDeviceWhereUniqueInput[]
  }

  export type LockerLogUncheckedCreateNestedManyWithoutCabinetInput = {
    create?: XOR<LockerLogCreateWithoutCabinetInput, LockerLogUncheckedCreateWithoutCabinetInput> | LockerLogCreateWithoutCabinetInput[] | LockerLogUncheckedCreateWithoutCabinetInput[]
    connectOrCreate?: LockerLogCreateOrConnectWithoutCabinetInput | LockerLogCreateOrConnectWithoutCabinetInput[]
    createMany?: LockerLogCreateManyCabinetInputEnvelope
    connect?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
  }

  export type EnumCabinetStatusFieldUpdateOperationsInput = {
    set?: $Enums.CabinetStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type LocationUpdateOneRequiredWithoutCabinetsNestedInput = {
    create?: XOR<LocationCreateWithoutCabinetsInput, LocationUncheckedCreateWithoutCabinetsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutCabinetsInput
    upsert?: LocationUpsertWithoutCabinetsInput
    connect?: LocationWhereUniqueInput
    update?: XOR<XOR<LocationUpdateToOneWithWhereWithoutCabinetsInput, LocationUpdateWithoutCabinetsInput>, LocationUncheckedUpdateWithoutCabinetsInput>
  }

  export type CompartmentUpdateManyWithoutCabinetNestedInput = {
    create?: XOR<CompartmentCreateWithoutCabinetInput, CompartmentUncheckedCreateWithoutCabinetInput> | CompartmentCreateWithoutCabinetInput[] | CompartmentUncheckedCreateWithoutCabinetInput[]
    connectOrCreate?: CompartmentCreateOrConnectWithoutCabinetInput | CompartmentCreateOrConnectWithoutCabinetInput[]
    upsert?: CompartmentUpsertWithWhereUniqueWithoutCabinetInput | CompartmentUpsertWithWhereUniqueWithoutCabinetInput[]
    createMany?: CompartmentCreateManyCabinetInputEnvelope
    set?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    disconnect?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    delete?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    connect?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    update?: CompartmentUpdateWithWhereUniqueWithoutCabinetInput | CompartmentUpdateWithWhereUniqueWithoutCabinetInput[]
    updateMany?: CompartmentUpdateManyWithWhereWithoutCabinetInput | CompartmentUpdateManyWithWhereWithoutCabinetInput[]
    deleteMany?: CompartmentScalarWhereInput | CompartmentScalarWhereInput[]
  }

  export type McpDeviceUpdateManyWithoutCabinetNestedInput = {
    create?: XOR<McpDeviceCreateWithoutCabinetInput, McpDeviceUncheckedCreateWithoutCabinetInput> | McpDeviceCreateWithoutCabinetInput[] | McpDeviceUncheckedCreateWithoutCabinetInput[]
    connectOrCreate?: McpDeviceCreateOrConnectWithoutCabinetInput | McpDeviceCreateOrConnectWithoutCabinetInput[]
    upsert?: McpDeviceUpsertWithWhereUniqueWithoutCabinetInput | McpDeviceUpsertWithWhereUniqueWithoutCabinetInput[]
    createMany?: McpDeviceCreateManyCabinetInputEnvelope
    set?: McpDeviceWhereUniqueInput | McpDeviceWhereUniqueInput[]
    disconnect?: McpDeviceWhereUniqueInput | McpDeviceWhereUniqueInput[]
    delete?: McpDeviceWhereUniqueInput | McpDeviceWhereUniqueInput[]
    connect?: McpDeviceWhereUniqueInput | McpDeviceWhereUniqueInput[]
    update?: McpDeviceUpdateWithWhereUniqueWithoutCabinetInput | McpDeviceUpdateWithWhereUniqueWithoutCabinetInput[]
    updateMany?: McpDeviceUpdateManyWithWhereWithoutCabinetInput | McpDeviceUpdateManyWithWhereWithoutCabinetInput[]
    deleteMany?: McpDeviceScalarWhereInput | McpDeviceScalarWhereInput[]
  }

  export type LockerLogUpdateManyWithoutCabinetNestedInput = {
    create?: XOR<LockerLogCreateWithoutCabinetInput, LockerLogUncheckedCreateWithoutCabinetInput> | LockerLogCreateWithoutCabinetInput[] | LockerLogUncheckedCreateWithoutCabinetInput[]
    connectOrCreate?: LockerLogCreateOrConnectWithoutCabinetInput | LockerLogCreateOrConnectWithoutCabinetInput[]
    upsert?: LockerLogUpsertWithWhereUniqueWithoutCabinetInput | LockerLogUpsertWithWhereUniqueWithoutCabinetInput[]
    createMany?: LockerLogCreateManyCabinetInputEnvelope
    set?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    disconnect?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    delete?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    connect?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    update?: LockerLogUpdateWithWhereUniqueWithoutCabinetInput | LockerLogUpdateWithWhereUniqueWithoutCabinetInput[]
    updateMany?: LockerLogUpdateManyWithWhereWithoutCabinetInput | LockerLogUpdateManyWithWhereWithoutCabinetInput[]
    deleteMany?: LockerLogScalarWhereInput | LockerLogScalarWhereInput[]
  }

  export type CompartmentUncheckedUpdateManyWithoutCabinetNestedInput = {
    create?: XOR<CompartmentCreateWithoutCabinetInput, CompartmentUncheckedCreateWithoutCabinetInput> | CompartmentCreateWithoutCabinetInput[] | CompartmentUncheckedCreateWithoutCabinetInput[]
    connectOrCreate?: CompartmentCreateOrConnectWithoutCabinetInput | CompartmentCreateOrConnectWithoutCabinetInput[]
    upsert?: CompartmentUpsertWithWhereUniqueWithoutCabinetInput | CompartmentUpsertWithWhereUniqueWithoutCabinetInput[]
    createMany?: CompartmentCreateManyCabinetInputEnvelope
    set?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    disconnect?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    delete?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    connect?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    update?: CompartmentUpdateWithWhereUniqueWithoutCabinetInput | CompartmentUpdateWithWhereUniqueWithoutCabinetInput[]
    updateMany?: CompartmentUpdateManyWithWhereWithoutCabinetInput | CompartmentUpdateManyWithWhereWithoutCabinetInput[]
    deleteMany?: CompartmentScalarWhereInput | CompartmentScalarWhereInput[]
  }

  export type McpDeviceUncheckedUpdateManyWithoutCabinetNestedInput = {
    create?: XOR<McpDeviceCreateWithoutCabinetInput, McpDeviceUncheckedCreateWithoutCabinetInput> | McpDeviceCreateWithoutCabinetInput[] | McpDeviceUncheckedCreateWithoutCabinetInput[]
    connectOrCreate?: McpDeviceCreateOrConnectWithoutCabinetInput | McpDeviceCreateOrConnectWithoutCabinetInput[]
    upsert?: McpDeviceUpsertWithWhereUniqueWithoutCabinetInput | McpDeviceUpsertWithWhereUniqueWithoutCabinetInput[]
    createMany?: McpDeviceCreateManyCabinetInputEnvelope
    set?: McpDeviceWhereUniqueInput | McpDeviceWhereUniqueInput[]
    disconnect?: McpDeviceWhereUniqueInput | McpDeviceWhereUniqueInput[]
    delete?: McpDeviceWhereUniqueInput | McpDeviceWhereUniqueInput[]
    connect?: McpDeviceWhereUniqueInput | McpDeviceWhereUniqueInput[]
    update?: McpDeviceUpdateWithWhereUniqueWithoutCabinetInput | McpDeviceUpdateWithWhereUniqueWithoutCabinetInput[]
    updateMany?: McpDeviceUpdateManyWithWhereWithoutCabinetInput | McpDeviceUpdateManyWithWhereWithoutCabinetInput[]
    deleteMany?: McpDeviceScalarWhereInput | McpDeviceScalarWhereInput[]
  }

  export type LockerLogUncheckedUpdateManyWithoutCabinetNestedInput = {
    create?: XOR<LockerLogCreateWithoutCabinetInput, LockerLogUncheckedCreateWithoutCabinetInput> | LockerLogCreateWithoutCabinetInput[] | LockerLogUncheckedCreateWithoutCabinetInput[]
    connectOrCreate?: LockerLogCreateOrConnectWithoutCabinetInput | LockerLogCreateOrConnectWithoutCabinetInput[]
    upsert?: LockerLogUpsertWithWhereUniqueWithoutCabinetInput | LockerLogUpsertWithWhereUniqueWithoutCabinetInput[]
    createMany?: LockerLogCreateManyCabinetInputEnvelope
    set?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    disconnect?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    delete?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    connect?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    update?: LockerLogUpdateWithWhereUniqueWithoutCabinetInput | LockerLogUpdateWithWhereUniqueWithoutCabinetInput[]
    updateMany?: LockerLogUpdateManyWithWhereWithoutCabinetInput | LockerLogUpdateManyWithWhereWithoutCabinetInput[]
    deleteMany?: LockerLogScalarWhereInput | LockerLogScalarWhereInput[]
  }

  export type CabinetCreateNestedOneWithoutMcpDevicesInput = {
    create?: XOR<CabinetCreateWithoutMcpDevicesInput, CabinetUncheckedCreateWithoutMcpDevicesInput>
    connectOrCreate?: CabinetCreateOrConnectWithoutMcpDevicesInput
    connect?: CabinetWhereUniqueInput
  }

  export type CompartmentCreateNestedManyWithoutLockMcpDeviceInput = {
    create?: XOR<CompartmentCreateWithoutLockMcpDeviceInput, CompartmentUncheckedCreateWithoutLockMcpDeviceInput> | CompartmentCreateWithoutLockMcpDeviceInput[] | CompartmentUncheckedCreateWithoutLockMcpDeviceInput[]
    connectOrCreate?: CompartmentCreateOrConnectWithoutLockMcpDeviceInput | CompartmentCreateOrConnectWithoutLockMcpDeviceInput[]
    createMany?: CompartmentCreateManyLockMcpDeviceInputEnvelope
    connect?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
  }

  export type CompartmentCreateNestedManyWithoutSensorMcpDeviceInput = {
    create?: XOR<CompartmentCreateWithoutSensorMcpDeviceInput, CompartmentUncheckedCreateWithoutSensorMcpDeviceInput> | CompartmentCreateWithoutSensorMcpDeviceInput[] | CompartmentUncheckedCreateWithoutSensorMcpDeviceInput[]
    connectOrCreate?: CompartmentCreateOrConnectWithoutSensorMcpDeviceInput | CompartmentCreateOrConnectWithoutSensorMcpDeviceInput[]
    createMany?: CompartmentCreateManySensorMcpDeviceInputEnvelope
    connect?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
  }

  export type CompartmentUncheckedCreateNestedManyWithoutLockMcpDeviceInput = {
    create?: XOR<CompartmentCreateWithoutLockMcpDeviceInput, CompartmentUncheckedCreateWithoutLockMcpDeviceInput> | CompartmentCreateWithoutLockMcpDeviceInput[] | CompartmentUncheckedCreateWithoutLockMcpDeviceInput[]
    connectOrCreate?: CompartmentCreateOrConnectWithoutLockMcpDeviceInput | CompartmentCreateOrConnectWithoutLockMcpDeviceInput[]
    createMany?: CompartmentCreateManyLockMcpDeviceInputEnvelope
    connect?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
  }

  export type CompartmentUncheckedCreateNestedManyWithoutSensorMcpDeviceInput = {
    create?: XOR<CompartmentCreateWithoutSensorMcpDeviceInput, CompartmentUncheckedCreateWithoutSensorMcpDeviceInput> | CompartmentCreateWithoutSensorMcpDeviceInput[] | CompartmentUncheckedCreateWithoutSensorMcpDeviceInput[]
    connectOrCreate?: CompartmentCreateOrConnectWithoutSensorMcpDeviceInput | CompartmentCreateOrConnectWithoutSensorMcpDeviceInput[]
    createMany?: CompartmentCreateManySensorMcpDeviceInputEnvelope
    connect?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CabinetUpdateOneRequiredWithoutMcpDevicesNestedInput = {
    create?: XOR<CabinetCreateWithoutMcpDevicesInput, CabinetUncheckedCreateWithoutMcpDevicesInput>
    connectOrCreate?: CabinetCreateOrConnectWithoutMcpDevicesInput
    upsert?: CabinetUpsertWithoutMcpDevicesInput
    connect?: CabinetWhereUniqueInput
    update?: XOR<XOR<CabinetUpdateToOneWithWhereWithoutMcpDevicesInput, CabinetUpdateWithoutMcpDevicesInput>, CabinetUncheckedUpdateWithoutMcpDevicesInput>
  }

  export type CompartmentUpdateManyWithoutLockMcpDeviceNestedInput = {
    create?: XOR<CompartmentCreateWithoutLockMcpDeviceInput, CompartmentUncheckedCreateWithoutLockMcpDeviceInput> | CompartmentCreateWithoutLockMcpDeviceInput[] | CompartmentUncheckedCreateWithoutLockMcpDeviceInput[]
    connectOrCreate?: CompartmentCreateOrConnectWithoutLockMcpDeviceInput | CompartmentCreateOrConnectWithoutLockMcpDeviceInput[]
    upsert?: CompartmentUpsertWithWhereUniqueWithoutLockMcpDeviceInput | CompartmentUpsertWithWhereUniqueWithoutLockMcpDeviceInput[]
    createMany?: CompartmentCreateManyLockMcpDeviceInputEnvelope
    set?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    disconnect?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    delete?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    connect?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    update?: CompartmentUpdateWithWhereUniqueWithoutLockMcpDeviceInput | CompartmentUpdateWithWhereUniqueWithoutLockMcpDeviceInput[]
    updateMany?: CompartmentUpdateManyWithWhereWithoutLockMcpDeviceInput | CompartmentUpdateManyWithWhereWithoutLockMcpDeviceInput[]
    deleteMany?: CompartmentScalarWhereInput | CompartmentScalarWhereInput[]
  }

  export type CompartmentUpdateManyWithoutSensorMcpDeviceNestedInput = {
    create?: XOR<CompartmentCreateWithoutSensorMcpDeviceInput, CompartmentUncheckedCreateWithoutSensorMcpDeviceInput> | CompartmentCreateWithoutSensorMcpDeviceInput[] | CompartmentUncheckedCreateWithoutSensorMcpDeviceInput[]
    connectOrCreate?: CompartmentCreateOrConnectWithoutSensorMcpDeviceInput | CompartmentCreateOrConnectWithoutSensorMcpDeviceInput[]
    upsert?: CompartmentUpsertWithWhereUniqueWithoutSensorMcpDeviceInput | CompartmentUpsertWithWhereUniqueWithoutSensorMcpDeviceInput[]
    createMany?: CompartmentCreateManySensorMcpDeviceInputEnvelope
    set?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    disconnect?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    delete?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    connect?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    update?: CompartmentUpdateWithWhereUniqueWithoutSensorMcpDeviceInput | CompartmentUpdateWithWhereUniqueWithoutSensorMcpDeviceInput[]
    updateMany?: CompartmentUpdateManyWithWhereWithoutSensorMcpDeviceInput | CompartmentUpdateManyWithWhereWithoutSensorMcpDeviceInput[]
    deleteMany?: CompartmentScalarWhereInput | CompartmentScalarWhereInput[]
  }

  export type CompartmentUncheckedUpdateManyWithoutLockMcpDeviceNestedInput = {
    create?: XOR<CompartmentCreateWithoutLockMcpDeviceInput, CompartmentUncheckedCreateWithoutLockMcpDeviceInput> | CompartmentCreateWithoutLockMcpDeviceInput[] | CompartmentUncheckedCreateWithoutLockMcpDeviceInput[]
    connectOrCreate?: CompartmentCreateOrConnectWithoutLockMcpDeviceInput | CompartmentCreateOrConnectWithoutLockMcpDeviceInput[]
    upsert?: CompartmentUpsertWithWhereUniqueWithoutLockMcpDeviceInput | CompartmentUpsertWithWhereUniqueWithoutLockMcpDeviceInput[]
    createMany?: CompartmentCreateManyLockMcpDeviceInputEnvelope
    set?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    disconnect?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    delete?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    connect?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    update?: CompartmentUpdateWithWhereUniqueWithoutLockMcpDeviceInput | CompartmentUpdateWithWhereUniqueWithoutLockMcpDeviceInput[]
    updateMany?: CompartmentUpdateManyWithWhereWithoutLockMcpDeviceInput | CompartmentUpdateManyWithWhereWithoutLockMcpDeviceInput[]
    deleteMany?: CompartmentScalarWhereInput | CompartmentScalarWhereInput[]
  }

  export type CompartmentUncheckedUpdateManyWithoutSensorMcpDeviceNestedInput = {
    create?: XOR<CompartmentCreateWithoutSensorMcpDeviceInput, CompartmentUncheckedCreateWithoutSensorMcpDeviceInput> | CompartmentCreateWithoutSensorMcpDeviceInput[] | CompartmentUncheckedCreateWithoutSensorMcpDeviceInput[]
    connectOrCreate?: CompartmentCreateOrConnectWithoutSensorMcpDeviceInput | CompartmentCreateOrConnectWithoutSensorMcpDeviceInput[]
    upsert?: CompartmentUpsertWithWhereUniqueWithoutSensorMcpDeviceInput | CompartmentUpsertWithWhereUniqueWithoutSensorMcpDeviceInput[]
    createMany?: CompartmentCreateManySensorMcpDeviceInputEnvelope
    set?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    disconnect?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    delete?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    connect?: CompartmentWhereUniqueInput | CompartmentWhereUniqueInput[]
    update?: CompartmentUpdateWithWhereUniqueWithoutSensorMcpDeviceInput | CompartmentUpdateWithWhereUniqueWithoutSensorMcpDeviceInput[]
    updateMany?: CompartmentUpdateManyWithWhereWithoutSensorMcpDeviceInput | CompartmentUpdateManyWithWhereWithoutSensorMcpDeviceInput[]
    deleteMany?: CompartmentScalarWhereInput | CompartmentScalarWhereInput[]
  }

  export type CabinetCreateNestedOneWithoutCompartmentsInput = {
    create?: XOR<CabinetCreateWithoutCompartmentsInput, CabinetUncheckedCreateWithoutCompartmentsInput>
    connectOrCreate?: CabinetCreateOrConnectWithoutCompartmentsInput
    connect?: CabinetWhereUniqueInput
  }

  export type McpDeviceCreateNestedOneWithoutLockCompartmentsInput = {
    create?: XOR<McpDeviceCreateWithoutLockCompartmentsInput, McpDeviceUncheckedCreateWithoutLockCompartmentsInput>
    connectOrCreate?: McpDeviceCreateOrConnectWithoutLockCompartmentsInput
    connect?: McpDeviceWhereUniqueInput
  }

  export type McpDeviceCreateNestedOneWithoutSensorCompartmentsInput = {
    create?: XOR<McpDeviceCreateWithoutSensorCompartmentsInput, McpDeviceUncheckedCreateWithoutSensorCompartmentsInput>
    connectOrCreate?: McpDeviceCreateOrConnectWithoutSensorCompartmentsInput
    connect?: McpDeviceWhereUniqueInput
  }

  export type RentalCreateNestedManyWithoutCompartmentInput = {
    create?: XOR<RentalCreateWithoutCompartmentInput, RentalUncheckedCreateWithoutCompartmentInput> | RentalCreateWithoutCompartmentInput[] | RentalUncheckedCreateWithoutCompartmentInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutCompartmentInput | RentalCreateOrConnectWithoutCompartmentInput[]
    createMany?: RentalCreateManyCompartmentInputEnvelope
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
  }

  export type LockerLogCreateNestedManyWithoutCompartmentInput = {
    create?: XOR<LockerLogCreateWithoutCompartmentInput, LockerLogUncheckedCreateWithoutCompartmentInput> | LockerLogCreateWithoutCompartmentInput[] | LockerLogUncheckedCreateWithoutCompartmentInput[]
    connectOrCreate?: LockerLogCreateOrConnectWithoutCompartmentInput | LockerLogCreateOrConnectWithoutCompartmentInput[]
    createMany?: LockerLogCreateManyCompartmentInputEnvelope
    connect?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
  }

  export type CompartmentStatusCreateNestedOneWithoutCompartmentInput = {
    create?: XOR<CompartmentStatusCreateWithoutCompartmentInput, CompartmentStatusUncheckedCreateWithoutCompartmentInput>
    connectOrCreate?: CompartmentStatusCreateOrConnectWithoutCompartmentInput
    connect?: CompartmentStatusWhereUniqueInput
  }

  export type RentalUncheckedCreateNestedManyWithoutCompartmentInput = {
    create?: XOR<RentalCreateWithoutCompartmentInput, RentalUncheckedCreateWithoutCompartmentInput> | RentalCreateWithoutCompartmentInput[] | RentalUncheckedCreateWithoutCompartmentInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutCompartmentInput | RentalCreateOrConnectWithoutCompartmentInput[]
    createMany?: RentalCreateManyCompartmentInputEnvelope
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
  }

  export type LockerLogUncheckedCreateNestedManyWithoutCompartmentInput = {
    create?: XOR<LockerLogCreateWithoutCompartmentInput, LockerLogUncheckedCreateWithoutCompartmentInput> | LockerLogCreateWithoutCompartmentInput[] | LockerLogUncheckedCreateWithoutCompartmentInput[]
    connectOrCreate?: LockerLogCreateOrConnectWithoutCompartmentInput | LockerLogCreateOrConnectWithoutCompartmentInput[]
    createMany?: LockerLogCreateManyCompartmentInputEnvelope
    connect?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
  }

  export type CompartmentStatusUncheckedCreateNestedOneWithoutCompartmentInput = {
    create?: XOR<CompartmentStatusCreateWithoutCompartmentInput, CompartmentStatusUncheckedCreateWithoutCompartmentInput>
    connectOrCreate?: CompartmentStatusCreateOrConnectWithoutCompartmentInput
    connect?: CompartmentStatusWhereUniqueInput
  }

  export type EnumCompartmentSizeFieldUpdateOperationsInput = {
    set?: $Enums.CompartmentSize
  }

  export type EnumCompartmentAvailabilityFieldUpdateOperationsInput = {
    set?: $Enums.CompartmentAvailability
  }

  export type CabinetUpdateOneRequiredWithoutCompartmentsNestedInput = {
    create?: XOR<CabinetCreateWithoutCompartmentsInput, CabinetUncheckedCreateWithoutCompartmentsInput>
    connectOrCreate?: CabinetCreateOrConnectWithoutCompartmentsInput
    upsert?: CabinetUpsertWithoutCompartmentsInput
    connect?: CabinetWhereUniqueInput
    update?: XOR<XOR<CabinetUpdateToOneWithWhereWithoutCompartmentsInput, CabinetUpdateWithoutCompartmentsInput>, CabinetUncheckedUpdateWithoutCompartmentsInput>
  }

  export type McpDeviceUpdateOneWithoutLockCompartmentsNestedInput = {
    create?: XOR<McpDeviceCreateWithoutLockCompartmentsInput, McpDeviceUncheckedCreateWithoutLockCompartmentsInput>
    connectOrCreate?: McpDeviceCreateOrConnectWithoutLockCompartmentsInput
    upsert?: McpDeviceUpsertWithoutLockCompartmentsInput
    disconnect?: McpDeviceWhereInput | boolean
    delete?: McpDeviceWhereInput | boolean
    connect?: McpDeviceWhereUniqueInput
    update?: XOR<XOR<McpDeviceUpdateToOneWithWhereWithoutLockCompartmentsInput, McpDeviceUpdateWithoutLockCompartmentsInput>, McpDeviceUncheckedUpdateWithoutLockCompartmentsInput>
  }

  export type McpDeviceUpdateOneWithoutSensorCompartmentsNestedInput = {
    create?: XOR<McpDeviceCreateWithoutSensorCompartmentsInput, McpDeviceUncheckedCreateWithoutSensorCompartmentsInput>
    connectOrCreate?: McpDeviceCreateOrConnectWithoutSensorCompartmentsInput
    upsert?: McpDeviceUpsertWithoutSensorCompartmentsInput
    disconnect?: McpDeviceWhereInput | boolean
    delete?: McpDeviceWhereInput | boolean
    connect?: McpDeviceWhereUniqueInput
    update?: XOR<XOR<McpDeviceUpdateToOneWithWhereWithoutSensorCompartmentsInput, McpDeviceUpdateWithoutSensorCompartmentsInput>, McpDeviceUncheckedUpdateWithoutSensorCompartmentsInput>
  }

  export type RentalUpdateManyWithoutCompartmentNestedInput = {
    create?: XOR<RentalCreateWithoutCompartmentInput, RentalUncheckedCreateWithoutCompartmentInput> | RentalCreateWithoutCompartmentInput[] | RentalUncheckedCreateWithoutCompartmentInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutCompartmentInput | RentalCreateOrConnectWithoutCompartmentInput[]
    upsert?: RentalUpsertWithWhereUniqueWithoutCompartmentInput | RentalUpsertWithWhereUniqueWithoutCompartmentInput[]
    createMany?: RentalCreateManyCompartmentInputEnvelope
    set?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    disconnect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    delete?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    update?: RentalUpdateWithWhereUniqueWithoutCompartmentInput | RentalUpdateWithWhereUniqueWithoutCompartmentInput[]
    updateMany?: RentalUpdateManyWithWhereWithoutCompartmentInput | RentalUpdateManyWithWhereWithoutCompartmentInput[]
    deleteMany?: RentalScalarWhereInput | RentalScalarWhereInput[]
  }

  export type LockerLogUpdateManyWithoutCompartmentNestedInput = {
    create?: XOR<LockerLogCreateWithoutCompartmentInput, LockerLogUncheckedCreateWithoutCompartmentInput> | LockerLogCreateWithoutCompartmentInput[] | LockerLogUncheckedCreateWithoutCompartmentInput[]
    connectOrCreate?: LockerLogCreateOrConnectWithoutCompartmentInput | LockerLogCreateOrConnectWithoutCompartmentInput[]
    upsert?: LockerLogUpsertWithWhereUniqueWithoutCompartmentInput | LockerLogUpsertWithWhereUniqueWithoutCompartmentInput[]
    createMany?: LockerLogCreateManyCompartmentInputEnvelope
    set?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    disconnect?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    delete?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    connect?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    update?: LockerLogUpdateWithWhereUniqueWithoutCompartmentInput | LockerLogUpdateWithWhereUniqueWithoutCompartmentInput[]
    updateMany?: LockerLogUpdateManyWithWhereWithoutCompartmentInput | LockerLogUpdateManyWithWhereWithoutCompartmentInput[]
    deleteMany?: LockerLogScalarWhereInput | LockerLogScalarWhereInput[]
  }

  export type CompartmentStatusUpdateOneWithoutCompartmentNestedInput = {
    create?: XOR<CompartmentStatusCreateWithoutCompartmentInput, CompartmentStatusUncheckedCreateWithoutCompartmentInput>
    connectOrCreate?: CompartmentStatusCreateOrConnectWithoutCompartmentInput
    upsert?: CompartmentStatusUpsertWithoutCompartmentInput
    disconnect?: CompartmentStatusWhereInput | boolean
    delete?: CompartmentStatusWhereInput | boolean
    connect?: CompartmentStatusWhereUniqueInput
    update?: XOR<XOR<CompartmentStatusUpdateToOneWithWhereWithoutCompartmentInput, CompartmentStatusUpdateWithoutCompartmentInput>, CompartmentStatusUncheckedUpdateWithoutCompartmentInput>
  }

  export type RentalUncheckedUpdateManyWithoutCompartmentNestedInput = {
    create?: XOR<RentalCreateWithoutCompartmentInput, RentalUncheckedCreateWithoutCompartmentInput> | RentalCreateWithoutCompartmentInput[] | RentalUncheckedCreateWithoutCompartmentInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutCompartmentInput | RentalCreateOrConnectWithoutCompartmentInput[]
    upsert?: RentalUpsertWithWhereUniqueWithoutCompartmentInput | RentalUpsertWithWhereUniqueWithoutCompartmentInput[]
    createMany?: RentalCreateManyCompartmentInputEnvelope
    set?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    disconnect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    delete?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    update?: RentalUpdateWithWhereUniqueWithoutCompartmentInput | RentalUpdateWithWhereUniqueWithoutCompartmentInput[]
    updateMany?: RentalUpdateManyWithWhereWithoutCompartmentInput | RentalUpdateManyWithWhereWithoutCompartmentInput[]
    deleteMany?: RentalScalarWhereInput | RentalScalarWhereInput[]
  }

  export type LockerLogUncheckedUpdateManyWithoutCompartmentNestedInput = {
    create?: XOR<LockerLogCreateWithoutCompartmentInput, LockerLogUncheckedCreateWithoutCompartmentInput> | LockerLogCreateWithoutCompartmentInput[] | LockerLogUncheckedCreateWithoutCompartmentInput[]
    connectOrCreate?: LockerLogCreateOrConnectWithoutCompartmentInput | LockerLogCreateOrConnectWithoutCompartmentInput[]
    upsert?: LockerLogUpsertWithWhereUniqueWithoutCompartmentInput | LockerLogUpsertWithWhereUniqueWithoutCompartmentInput[]
    createMany?: LockerLogCreateManyCompartmentInputEnvelope
    set?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    disconnect?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    delete?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    connect?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    update?: LockerLogUpdateWithWhereUniqueWithoutCompartmentInput | LockerLogUpdateWithWhereUniqueWithoutCompartmentInput[]
    updateMany?: LockerLogUpdateManyWithWhereWithoutCompartmentInput | LockerLogUpdateManyWithWhereWithoutCompartmentInput[]
    deleteMany?: LockerLogScalarWhereInput | LockerLogScalarWhereInput[]
  }

  export type CompartmentStatusUncheckedUpdateOneWithoutCompartmentNestedInput = {
    create?: XOR<CompartmentStatusCreateWithoutCompartmentInput, CompartmentStatusUncheckedCreateWithoutCompartmentInput>
    connectOrCreate?: CompartmentStatusCreateOrConnectWithoutCompartmentInput
    upsert?: CompartmentStatusUpsertWithoutCompartmentInput
    disconnect?: CompartmentStatusWhereInput | boolean
    delete?: CompartmentStatusWhereInput | boolean
    connect?: CompartmentStatusWhereUniqueInput
    update?: XOR<XOR<CompartmentStatusUpdateToOneWithWhereWithoutCompartmentInput, CompartmentStatusUpdateWithoutCompartmentInput>, CompartmentStatusUncheckedUpdateWithoutCompartmentInput>
  }

  export type CompartmentCreateNestedOneWithoutRealtimeStatusInput = {
    create?: XOR<CompartmentCreateWithoutRealtimeStatusInput, CompartmentUncheckedCreateWithoutRealtimeStatusInput>
    connectOrCreate?: CompartmentCreateOrConnectWithoutRealtimeStatusInput
    connect?: CompartmentWhereUniqueInput
  }

  export type EnumLockStatusFieldUpdateOperationsInput = {
    set?: $Enums.LockStatus
  }

  export type EnumDoorStatusFieldUpdateOperationsInput = {
    set?: $Enums.DoorStatus
  }

  export type CompartmentUpdateOneRequiredWithoutRealtimeStatusNestedInput = {
    create?: XOR<CompartmentCreateWithoutRealtimeStatusInput, CompartmentUncheckedCreateWithoutRealtimeStatusInput>
    connectOrCreate?: CompartmentCreateOrConnectWithoutRealtimeStatusInput
    upsert?: CompartmentUpsertWithoutRealtimeStatusInput
    connect?: CompartmentWhereUniqueInput
    update?: XOR<XOR<CompartmentUpdateToOneWithWhereWithoutRealtimeStatusInput, CompartmentUpdateWithoutRealtimeStatusInput>, CompartmentUncheckedUpdateWithoutRealtimeStatusInput>
  }

  export type RentalCreateNestedManyWithoutPricePlanInput = {
    create?: XOR<RentalCreateWithoutPricePlanInput, RentalUncheckedCreateWithoutPricePlanInput> | RentalCreateWithoutPricePlanInput[] | RentalUncheckedCreateWithoutPricePlanInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutPricePlanInput | RentalCreateOrConnectWithoutPricePlanInput[]
    createMany?: RentalCreateManyPricePlanInputEnvelope
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
  }

  export type RentalUncheckedCreateNestedManyWithoutPricePlanInput = {
    create?: XOR<RentalCreateWithoutPricePlanInput, RentalUncheckedCreateWithoutPricePlanInput> | RentalCreateWithoutPricePlanInput[] | RentalUncheckedCreateWithoutPricePlanInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutPricePlanInput | RentalCreateOrConnectWithoutPricePlanInput[]
    createMany?: RentalCreateManyPricePlanInputEnvelope
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
  }

  export type EnumRentalTypeFieldUpdateOperationsInput = {
    set?: $Enums.RentalType
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type RentalUpdateManyWithoutPricePlanNestedInput = {
    create?: XOR<RentalCreateWithoutPricePlanInput, RentalUncheckedCreateWithoutPricePlanInput> | RentalCreateWithoutPricePlanInput[] | RentalUncheckedCreateWithoutPricePlanInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutPricePlanInput | RentalCreateOrConnectWithoutPricePlanInput[]
    upsert?: RentalUpsertWithWhereUniqueWithoutPricePlanInput | RentalUpsertWithWhereUniqueWithoutPricePlanInput[]
    createMany?: RentalCreateManyPricePlanInputEnvelope
    set?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    disconnect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    delete?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    update?: RentalUpdateWithWhereUniqueWithoutPricePlanInput | RentalUpdateWithWhereUniqueWithoutPricePlanInput[]
    updateMany?: RentalUpdateManyWithWhereWithoutPricePlanInput | RentalUpdateManyWithWhereWithoutPricePlanInput[]
    deleteMany?: RentalScalarWhereInput | RentalScalarWhereInput[]
  }

  export type RentalUncheckedUpdateManyWithoutPricePlanNestedInput = {
    create?: XOR<RentalCreateWithoutPricePlanInput, RentalUncheckedCreateWithoutPricePlanInput> | RentalCreateWithoutPricePlanInput[] | RentalUncheckedCreateWithoutPricePlanInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutPricePlanInput | RentalCreateOrConnectWithoutPricePlanInput[]
    upsert?: RentalUpsertWithWhereUniqueWithoutPricePlanInput | RentalUpsertWithWhereUniqueWithoutPricePlanInput[]
    createMany?: RentalCreateManyPricePlanInputEnvelope
    set?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    disconnect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    delete?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    update?: RentalUpdateWithWhereUniqueWithoutPricePlanInput | RentalUpdateWithWhereUniqueWithoutPricePlanInput[]
    updateMany?: RentalUpdateManyWithWhereWithoutPricePlanInput | RentalUpdateManyWithWhereWithoutPricePlanInput[]
    deleteMany?: RentalScalarWhereInput | RentalScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutRentalsInput = {
    create?: XOR<UserCreateWithoutRentalsInput, UserUncheckedCreateWithoutRentalsInput>
    connectOrCreate?: UserCreateOrConnectWithoutRentalsInput
    connect?: UserWhereUniqueInput
  }

  export type CompartmentCreateNestedOneWithoutRentalsInput = {
    create?: XOR<CompartmentCreateWithoutRentalsInput, CompartmentUncheckedCreateWithoutRentalsInput>
    connectOrCreate?: CompartmentCreateOrConnectWithoutRentalsInput
    connect?: CompartmentWhereUniqueInput
  }

  export type PricePlanCreateNestedOneWithoutRentalsInput = {
    create?: XOR<PricePlanCreateWithoutRentalsInput, PricePlanUncheckedCreateWithoutRentalsInput>
    connectOrCreate?: PricePlanCreateOrConnectWithoutRentalsInput
    connect?: PricePlanWhereUniqueInput
  }

  export type LockerLogCreateNestedManyWithoutRentalInput = {
    create?: XOR<LockerLogCreateWithoutRentalInput, LockerLogUncheckedCreateWithoutRentalInput> | LockerLogCreateWithoutRentalInput[] | LockerLogUncheckedCreateWithoutRentalInput[]
    connectOrCreate?: LockerLogCreateOrConnectWithoutRentalInput | LockerLogCreateOrConnectWithoutRentalInput[]
    createMany?: LockerLogCreateManyRentalInputEnvelope
    connect?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
  }

  export type LockerLogUncheckedCreateNestedManyWithoutRentalInput = {
    create?: XOR<LockerLogCreateWithoutRentalInput, LockerLogUncheckedCreateWithoutRentalInput> | LockerLogCreateWithoutRentalInput[] | LockerLogUncheckedCreateWithoutRentalInput[]
    connectOrCreate?: LockerLogCreateOrConnectWithoutRentalInput | LockerLogCreateOrConnectWithoutRentalInput[]
    createMany?: LockerLogCreateManyRentalInputEnvelope
    connect?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
  }

  export type EnumPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentStatus
  }

  export type EnumPaymentMethodFieldUpdateOperationsInput = {
    set?: $Enums.PaymentMethod
  }

  export type EnumRentalStatusFieldUpdateOperationsInput = {
    set?: $Enums.RentalStatus
  }

  export type UserUpdateOneWithoutRentalsNestedInput = {
    create?: XOR<UserCreateWithoutRentalsInput, UserUncheckedCreateWithoutRentalsInput>
    connectOrCreate?: UserCreateOrConnectWithoutRentalsInput
    upsert?: UserUpsertWithoutRentalsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRentalsInput, UserUpdateWithoutRentalsInput>, UserUncheckedUpdateWithoutRentalsInput>
  }

  export type CompartmentUpdateOneRequiredWithoutRentalsNestedInput = {
    create?: XOR<CompartmentCreateWithoutRentalsInput, CompartmentUncheckedCreateWithoutRentalsInput>
    connectOrCreate?: CompartmentCreateOrConnectWithoutRentalsInput
    upsert?: CompartmentUpsertWithoutRentalsInput
    connect?: CompartmentWhereUniqueInput
    update?: XOR<XOR<CompartmentUpdateToOneWithWhereWithoutRentalsInput, CompartmentUpdateWithoutRentalsInput>, CompartmentUncheckedUpdateWithoutRentalsInput>
  }

  export type PricePlanUpdateOneRequiredWithoutRentalsNestedInput = {
    create?: XOR<PricePlanCreateWithoutRentalsInput, PricePlanUncheckedCreateWithoutRentalsInput>
    connectOrCreate?: PricePlanCreateOrConnectWithoutRentalsInput
    upsert?: PricePlanUpsertWithoutRentalsInput
    connect?: PricePlanWhereUniqueInput
    update?: XOR<XOR<PricePlanUpdateToOneWithWhereWithoutRentalsInput, PricePlanUpdateWithoutRentalsInput>, PricePlanUncheckedUpdateWithoutRentalsInput>
  }

  export type LockerLogUpdateManyWithoutRentalNestedInput = {
    create?: XOR<LockerLogCreateWithoutRentalInput, LockerLogUncheckedCreateWithoutRentalInput> | LockerLogCreateWithoutRentalInput[] | LockerLogUncheckedCreateWithoutRentalInput[]
    connectOrCreate?: LockerLogCreateOrConnectWithoutRentalInput | LockerLogCreateOrConnectWithoutRentalInput[]
    upsert?: LockerLogUpsertWithWhereUniqueWithoutRentalInput | LockerLogUpsertWithWhereUniqueWithoutRentalInput[]
    createMany?: LockerLogCreateManyRentalInputEnvelope
    set?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    disconnect?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    delete?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    connect?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    update?: LockerLogUpdateWithWhereUniqueWithoutRentalInput | LockerLogUpdateWithWhereUniqueWithoutRentalInput[]
    updateMany?: LockerLogUpdateManyWithWhereWithoutRentalInput | LockerLogUpdateManyWithWhereWithoutRentalInput[]
    deleteMany?: LockerLogScalarWhereInput | LockerLogScalarWhereInput[]
  }

  export type LockerLogUncheckedUpdateManyWithoutRentalNestedInput = {
    create?: XOR<LockerLogCreateWithoutRentalInput, LockerLogUncheckedCreateWithoutRentalInput> | LockerLogCreateWithoutRentalInput[] | LockerLogUncheckedCreateWithoutRentalInput[]
    connectOrCreate?: LockerLogCreateOrConnectWithoutRentalInput | LockerLogCreateOrConnectWithoutRentalInput[]
    upsert?: LockerLogUpsertWithWhereUniqueWithoutRentalInput | LockerLogUpsertWithWhereUniqueWithoutRentalInput[]
    createMany?: LockerLogCreateManyRentalInputEnvelope
    set?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    disconnect?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    delete?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    connect?: LockerLogWhereUniqueInput | LockerLogWhereUniqueInput[]
    update?: LockerLogUpdateWithWhereUniqueWithoutRentalInput | LockerLogUpdateWithWhereUniqueWithoutRentalInput[]
    updateMany?: LockerLogUpdateManyWithWhereWithoutRentalInput | LockerLogUpdateManyWithWhereWithoutRentalInput[]
    deleteMany?: LockerLogScalarWhereInput | LockerLogScalarWhereInput[]
  }

  export type CabinetCreateNestedOneWithoutLogsInput = {
    create?: XOR<CabinetCreateWithoutLogsInput, CabinetUncheckedCreateWithoutLogsInput>
    connectOrCreate?: CabinetCreateOrConnectWithoutLogsInput
    connect?: CabinetWhereUniqueInput
  }

  export type CompartmentCreateNestedOneWithoutLogsInput = {
    create?: XOR<CompartmentCreateWithoutLogsInput, CompartmentUncheckedCreateWithoutLogsInput>
    connectOrCreate?: CompartmentCreateOrConnectWithoutLogsInput
    connect?: CompartmentWhereUniqueInput
  }

  export type RentalCreateNestedOneWithoutLogsInput = {
    create?: XOR<RentalCreateWithoutLogsInput, RentalUncheckedCreateWithoutLogsInput>
    connectOrCreate?: RentalCreateOrConnectWithoutLogsInput
    connect?: RentalWhereUniqueInput
  }

  export type EnumLockerActionFieldUpdateOperationsInput = {
    set?: $Enums.LockerAction
  }

  export type CabinetUpdateOneWithoutLogsNestedInput = {
    create?: XOR<CabinetCreateWithoutLogsInput, CabinetUncheckedCreateWithoutLogsInput>
    connectOrCreate?: CabinetCreateOrConnectWithoutLogsInput
    upsert?: CabinetUpsertWithoutLogsInput
    disconnect?: CabinetWhereInput | boolean
    delete?: CabinetWhereInput | boolean
    connect?: CabinetWhereUniqueInput
    update?: XOR<XOR<CabinetUpdateToOneWithWhereWithoutLogsInput, CabinetUpdateWithoutLogsInput>, CabinetUncheckedUpdateWithoutLogsInput>
  }

  export type CompartmentUpdateOneWithoutLogsNestedInput = {
    create?: XOR<CompartmentCreateWithoutLogsInput, CompartmentUncheckedCreateWithoutLogsInput>
    connectOrCreate?: CompartmentCreateOrConnectWithoutLogsInput
    upsert?: CompartmentUpsertWithoutLogsInput
    disconnect?: CompartmentWhereInput | boolean
    delete?: CompartmentWhereInput | boolean
    connect?: CompartmentWhereUniqueInput
    update?: XOR<XOR<CompartmentUpdateToOneWithWhereWithoutLogsInput, CompartmentUpdateWithoutLogsInput>, CompartmentUncheckedUpdateWithoutLogsInput>
  }

  export type RentalUpdateOneWithoutLogsNestedInput = {
    create?: XOR<RentalCreateWithoutLogsInput, RentalUncheckedCreateWithoutLogsInput>
    connectOrCreate?: RentalCreateOrConnectWithoutLogsInput
    upsert?: RentalUpsertWithoutLogsInput
    disconnect?: RentalWhereInput | boolean
    delete?: RentalWhereInput | boolean
    connect?: RentalWhereUniqueInput
    update?: XOR<XOR<RentalUpdateToOneWithWhereWithoutLogsInput, RentalUpdateWithoutLogsInput>, RentalUncheckedUpdateWithoutLogsInput>
  }

  export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumNotificationTypeFieldUpdateOperationsInput = {
    set?: $Enums.NotificationType
  }

  export type UserUpdateOneWithoutNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    upsert?: UserUpsertWithoutNotificationsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationsInput, UserUpdateWithoutNotificationsInput>, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumDeviceTypeFieldUpdateOperationsInput = {
    set?: $Enums.DeviceType
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumAdminRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.AdminRole | EnumAdminRoleFieldRefInput<$PrismaModel>
    in?: $Enums.AdminRole[] | ListEnumAdminRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AdminRole[] | ListEnumAdminRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumAdminRoleFilter<$PrismaModel> | $Enums.AdminRole
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumAdminRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AdminRole | EnumAdminRoleFieldRefInput<$PrismaModel>
    in?: $Enums.AdminRole[] | ListEnumAdminRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AdminRole[] | ListEnumAdminRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumAdminRoleWithAggregatesFilter<$PrismaModel> | $Enums.AdminRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAdminRoleFilter<$PrismaModel>
    _max?: NestedEnumAdminRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumLocationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LocationStatus | EnumLocationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LocationStatus[] | ListEnumLocationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LocationStatus[] | ListEnumLocationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLocationStatusFilter<$PrismaModel> | $Enums.LocationStatus
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedEnumLocationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LocationStatus | EnumLocationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LocationStatus[] | ListEnumLocationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LocationStatus[] | ListEnumLocationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLocationStatusWithAggregatesFilter<$PrismaModel> | $Enums.LocationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLocationStatusFilter<$PrismaModel>
    _max?: NestedEnumLocationStatusFilter<$PrismaModel>
  }

  export type NestedEnumCabinetStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CabinetStatus | EnumCabinetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CabinetStatus[] | ListEnumCabinetStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CabinetStatus[] | ListEnumCabinetStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCabinetStatusFilter<$PrismaModel> | $Enums.CabinetStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumCabinetStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CabinetStatus | EnumCabinetStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CabinetStatus[] | ListEnumCabinetStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CabinetStatus[] | ListEnumCabinetStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCabinetStatusWithAggregatesFilter<$PrismaModel> | $Enums.CabinetStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCabinetStatusFilter<$PrismaModel>
    _max?: NestedEnumCabinetStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumCompartmentSizeFilter<$PrismaModel = never> = {
    equals?: $Enums.CompartmentSize | EnumCompartmentSizeFieldRefInput<$PrismaModel>
    in?: $Enums.CompartmentSize[] | ListEnumCompartmentSizeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CompartmentSize[] | ListEnumCompartmentSizeFieldRefInput<$PrismaModel>
    not?: NestedEnumCompartmentSizeFilter<$PrismaModel> | $Enums.CompartmentSize
  }

  export type NestedEnumCompartmentAvailabilityFilter<$PrismaModel = never> = {
    equals?: $Enums.CompartmentAvailability | EnumCompartmentAvailabilityFieldRefInput<$PrismaModel>
    in?: $Enums.CompartmentAvailability[] | ListEnumCompartmentAvailabilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.CompartmentAvailability[] | ListEnumCompartmentAvailabilityFieldRefInput<$PrismaModel>
    not?: NestedEnumCompartmentAvailabilityFilter<$PrismaModel> | $Enums.CompartmentAvailability
  }

  export type NestedEnumCompartmentSizeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CompartmentSize | EnumCompartmentSizeFieldRefInput<$PrismaModel>
    in?: $Enums.CompartmentSize[] | ListEnumCompartmentSizeFieldRefInput<$PrismaModel>
    notIn?: $Enums.CompartmentSize[] | ListEnumCompartmentSizeFieldRefInput<$PrismaModel>
    not?: NestedEnumCompartmentSizeWithAggregatesFilter<$PrismaModel> | $Enums.CompartmentSize
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCompartmentSizeFilter<$PrismaModel>
    _max?: NestedEnumCompartmentSizeFilter<$PrismaModel>
  }

  export type NestedEnumCompartmentAvailabilityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CompartmentAvailability | EnumCompartmentAvailabilityFieldRefInput<$PrismaModel>
    in?: $Enums.CompartmentAvailability[] | ListEnumCompartmentAvailabilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.CompartmentAvailability[] | ListEnumCompartmentAvailabilityFieldRefInput<$PrismaModel>
    not?: NestedEnumCompartmentAvailabilityWithAggregatesFilter<$PrismaModel> | $Enums.CompartmentAvailability
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCompartmentAvailabilityFilter<$PrismaModel>
    _max?: NestedEnumCompartmentAvailabilityFilter<$PrismaModel>
  }

  export type NestedEnumLockStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LockStatus | EnumLockStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LockStatus[] | ListEnumLockStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LockStatus[] | ListEnumLockStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLockStatusFilter<$PrismaModel> | $Enums.LockStatus
  }

  export type NestedEnumDoorStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DoorStatus | EnumDoorStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DoorStatus[] | ListEnumDoorStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DoorStatus[] | ListEnumDoorStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDoorStatusFilter<$PrismaModel> | $Enums.DoorStatus
  }

  export type NestedEnumLockStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LockStatus | EnumLockStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LockStatus[] | ListEnumLockStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LockStatus[] | ListEnumLockStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLockStatusWithAggregatesFilter<$PrismaModel> | $Enums.LockStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLockStatusFilter<$PrismaModel>
    _max?: NestedEnumLockStatusFilter<$PrismaModel>
  }

  export type NestedEnumDoorStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DoorStatus | EnumDoorStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DoorStatus[] | ListEnumDoorStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DoorStatus[] | ListEnumDoorStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDoorStatusWithAggregatesFilter<$PrismaModel> | $Enums.DoorStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDoorStatusFilter<$PrismaModel>
    _max?: NestedEnumDoorStatusFilter<$PrismaModel>
  }

  export type NestedEnumRentalTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RentalType | EnumRentalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RentalType[] | ListEnumRentalTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RentalType[] | ListEnumRentalTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRentalTypeFilter<$PrismaModel> | $Enums.RentalType
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumRentalTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RentalType | EnumRentalTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RentalType[] | ListEnumRentalTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RentalType[] | ListEnumRentalTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRentalTypeWithAggregatesFilter<$PrismaModel> | $Enums.RentalType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRentalTypeFilter<$PrismaModel>
    _max?: NestedEnumRentalTypeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type NestedEnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod
  }

  export type NestedEnumRentalStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RentalStatus | EnumRentalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RentalStatus[] | ListEnumRentalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RentalStatus[] | ListEnumRentalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRentalStatusFilter<$PrismaModel> | $Enums.RentalStatus
  }

  export type NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodFilter<$PrismaModel>
  }

  export type NestedEnumRentalStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RentalStatus | EnumRentalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RentalStatus[] | ListEnumRentalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RentalStatus[] | ListEnumRentalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRentalStatusWithAggregatesFilter<$PrismaModel> | $Enums.RentalStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRentalStatusFilter<$PrismaModel>
    _max?: NestedEnumRentalStatusFilter<$PrismaModel>
  }

  export type NestedEnumLockerActionFilter<$PrismaModel = never> = {
    equals?: $Enums.LockerAction | EnumLockerActionFieldRefInput<$PrismaModel>
    in?: $Enums.LockerAction[] | ListEnumLockerActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.LockerAction[] | ListEnumLockerActionFieldRefInput<$PrismaModel>
    not?: NestedEnumLockerActionFilter<$PrismaModel> | $Enums.LockerAction
  }

  export type NestedEnumLockerActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LockerAction | EnumLockerActionFieldRefInput<$PrismaModel>
    in?: $Enums.LockerAction[] | ListEnumLockerActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.LockerAction[] | ListEnumLockerActionFieldRefInput<$PrismaModel>
    not?: NestedEnumLockerActionWithAggregatesFilter<$PrismaModel> | $Enums.LockerAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLockerActionFilter<$PrismaModel>
    _max?: NestedEnumLockerActionFilter<$PrismaModel>
  }

  export type NestedEnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType
  }

  export type NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumDeviceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceType | EnumDeviceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceType[] | ListEnumDeviceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeviceType[] | ListEnumDeviceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceTypeFilter<$PrismaModel> | $Enums.DeviceType
  }

  export type NestedEnumDeviceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceType | EnumDeviceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceType[] | ListEnumDeviceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeviceType[] | ListEnumDeviceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceTypeWithAggregatesFilter<$PrismaModel> | $Enums.DeviceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeviceTypeFilter<$PrismaModel>
    _max?: NestedEnumDeviceTypeFilter<$PrismaModel>
  }

  export type RentalCreateWithoutUserInput = {
    id?: string
    code: string
    codeHash: string
    qrToken: string
    openCount?: number
    maxOpens: number
    expiresAt: Date | string
    paymentStatus?: $Enums.PaymentStatus
    paymentMethod?: $Enums.PaymentMethod
    paidAt?: Date | string | null
    status?: $Enums.RentalStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    compartment: CompartmentCreateNestedOneWithoutRentalsInput
    pricePlan: PricePlanCreateNestedOneWithoutRentalsInput
    logs?: LockerLogCreateNestedManyWithoutRentalInput
  }

  export type RentalUncheckedCreateWithoutUserInput = {
    id?: string
    compartmentId: string
    pricePlanId: string
    code: string
    codeHash: string
    qrToken: string
    openCount?: number
    maxOpens: number
    expiresAt: Date | string
    paymentStatus?: $Enums.PaymentStatus
    paymentMethod?: $Enums.PaymentMethod
    paidAt?: Date | string | null
    status?: $Enums.RentalStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    logs?: LockerLogUncheckedCreateNestedManyWithoutRentalInput
  }

  export type RentalCreateOrConnectWithoutUserInput = {
    where: RentalWhereUniqueInput
    create: XOR<RentalCreateWithoutUserInput, RentalUncheckedCreateWithoutUserInput>
  }

  export type RentalCreateManyUserInputEnvelope = {
    data: RentalCreateManyUserInput | RentalCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutUserInput = {
    id?: string
    title: string
    body: string
    type: $Enums.NotificationType
    data?: NullableJsonNullValueInput | InputJsonValue
    isRead?: boolean
    sentAt?: Date | string
    createdAt?: Date | string
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    body: string
    type: $Enums.NotificationType
    data?: NullableJsonNullValueInput | InputJsonValue
    isRead?: boolean
    sentAt?: Date | string
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserSessionCreateWithoutUserInput = {
    id?: string
    socketId: string
    deviceType: $Enums.DeviceType
    deviceInfo?: string | null
    connectedAt?: Date | string
    disconnectedAt?: Date | string | null
    isActive?: boolean
  }

  export type UserSessionUncheckedCreateWithoutUserInput = {
    id?: string
    socketId: string
    deviceType: $Enums.DeviceType
    deviceInfo?: string | null
    connectedAt?: Date | string
    disconnectedAt?: Date | string | null
    isActive?: boolean
  }

  export type UserSessionCreateOrConnectWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    create: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput>
  }

  export type UserSessionCreateManyUserInputEnvelope = {
    data: UserSessionCreateManyUserInput | UserSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type RentalUpsertWithWhereUniqueWithoutUserInput = {
    where: RentalWhereUniqueInput
    update: XOR<RentalUpdateWithoutUserInput, RentalUncheckedUpdateWithoutUserInput>
    create: XOR<RentalCreateWithoutUserInput, RentalUncheckedCreateWithoutUserInput>
  }

  export type RentalUpdateWithWhereUniqueWithoutUserInput = {
    where: RentalWhereUniqueInput
    data: XOR<RentalUpdateWithoutUserInput, RentalUncheckedUpdateWithoutUserInput>
  }

  export type RentalUpdateManyWithWhereWithoutUserInput = {
    where: RentalScalarWhereInput
    data: XOR<RentalUpdateManyMutationInput, RentalUncheckedUpdateManyWithoutUserInput>
  }

  export type RentalScalarWhereInput = {
    AND?: RentalScalarWhereInput | RentalScalarWhereInput[]
    OR?: RentalScalarWhereInput[]
    NOT?: RentalScalarWhereInput | RentalScalarWhereInput[]
    id?: StringFilter<"Rental"> | string
    userId?: StringNullableFilter<"Rental"> | string | null
    compartmentId?: StringFilter<"Rental"> | string
    pricePlanId?: StringFilter<"Rental"> | string
    code?: StringFilter<"Rental"> | string
    codeHash?: StringFilter<"Rental"> | string
    qrToken?: StringFilter<"Rental"> | string
    openCount?: IntFilter<"Rental"> | number
    maxOpens?: IntFilter<"Rental"> | number
    expiresAt?: DateTimeFilter<"Rental"> | Date | string
    paymentStatus?: EnumPaymentStatusFilter<"Rental"> | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFilter<"Rental"> | $Enums.PaymentMethod
    paidAt?: DateTimeNullableFilter<"Rental"> | Date | string | null
    status?: EnumRentalStatusFilter<"Rental"> | $Enums.RentalStatus
    createdAt?: DateTimeFilter<"Rental"> | Date | string
    updatedAt?: DateTimeFilter<"Rental"> | Date | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringNullableFilter<"Notification"> | string | null
    title?: StringFilter<"Notification"> | string
    body?: StringFilter<"Notification"> | string
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    data?: JsonNullableFilter<"Notification">
    isRead?: BoolFilter<"Notification"> | boolean
    sentAt?: DateTimeFilter<"Notification"> | Date | string
    createdAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type UserSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    update: XOR<UserSessionUpdateWithoutUserInput, UserSessionUncheckedUpdateWithoutUserInput>
    create: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput>
  }

  export type UserSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    data: XOR<UserSessionUpdateWithoutUserInput, UserSessionUncheckedUpdateWithoutUserInput>
  }

  export type UserSessionUpdateManyWithWhereWithoutUserInput = {
    where: UserSessionScalarWhereInput
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type UserSessionScalarWhereInput = {
    AND?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
    OR?: UserSessionScalarWhereInput[]
    NOT?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
    id?: StringFilter<"UserSession"> | string
    userId?: StringFilter<"UserSession"> | string
    socketId?: StringFilter<"UserSession"> | string
    deviceType?: EnumDeviceTypeFilter<"UserSession"> | $Enums.DeviceType
    deviceInfo?: StringNullableFilter<"UserSession"> | string | null
    connectedAt?: DateTimeFilter<"UserSession"> | Date | string
    disconnectedAt?: DateTimeNullableFilter<"UserSession"> | Date | string | null
    isActive?: BoolFilter<"UserSession"> | boolean
  }

  export type CabinetCreateWithoutLocationInput = {
    id?: string
    name: string
    status?: $Enums.CabinetStatus
    lastHeartbeatAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    compartments?: CompartmentCreateNestedManyWithoutCabinetInput
    mcpDevices?: McpDeviceCreateNestedManyWithoutCabinetInput
    logs?: LockerLogCreateNestedManyWithoutCabinetInput
  }

  export type CabinetUncheckedCreateWithoutLocationInput = {
    id?: string
    name: string
    status?: $Enums.CabinetStatus
    lastHeartbeatAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    compartments?: CompartmentUncheckedCreateNestedManyWithoutCabinetInput
    mcpDevices?: McpDeviceUncheckedCreateNestedManyWithoutCabinetInput
    logs?: LockerLogUncheckedCreateNestedManyWithoutCabinetInput
  }

  export type CabinetCreateOrConnectWithoutLocationInput = {
    where: CabinetWhereUniqueInput
    create: XOR<CabinetCreateWithoutLocationInput, CabinetUncheckedCreateWithoutLocationInput>
  }

  export type CabinetCreateManyLocationInputEnvelope = {
    data: CabinetCreateManyLocationInput | CabinetCreateManyLocationInput[]
    skipDuplicates?: boolean
  }

  export type CabinetUpsertWithWhereUniqueWithoutLocationInput = {
    where: CabinetWhereUniqueInput
    update: XOR<CabinetUpdateWithoutLocationInput, CabinetUncheckedUpdateWithoutLocationInput>
    create: XOR<CabinetCreateWithoutLocationInput, CabinetUncheckedCreateWithoutLocationInput>
  }

  export type CabinetUpdateWithWhereUniqueWithoutLocationInput = {
    where: CabinetWhereUniqueInput
    data: XOR<CabinetUpdateWithoutLocationInput, CabinetUncheckedUpdateWithoutLocationInput>
  }

  export type CabinetUpdateManyWithWhereWithoutLocationInput = {
    where: CabinetScalarWhereInput
    data: XOR<CabinetUpdateManyMutationInput, CabinetUncheckedUpdateManyWithoutLocationInput>
  }

  export type CabinetScalarWhereInput = {
    AND?: CabinetScalarWhereInput | CabinetScalarWhereInput[]
    OR?: CabinetScalarWhereInput[]
    NOT?: CabinetScalarWhereInput | CabinetScalarWhereInput[]
    id?: StringFilter<"Cabinet"> | string
    locationId?: StringFilter<"Cabinet"> | string
    name?: StringFilter<"Cabinet"> | string
    status?: EnumCabinetStatusFilter<"Cabinet"> | $Enums.CabinetStatus
    lastHeartbeatAt?: DateTimeNullableFilter<"Cabinet"> | Date | string | null
    createdAt?: DateTimeFilter<"Cabinet"> | Date | string
    updatedAt?: DateTimeFilter<"Cabinet"> | Date | string
  }

  export type LocationCreateWithoutCabinetsInput = {
    id?: string
    name: string
    address: string
    latitude?: number | null
    longitude?: number | null
    googlePlaceId?: string | null
    mapImageUrl?: string | null
    status?: $Enums.LocationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocationUncheckedCreateWithoutCabinetsInput = {
    id?: string
    name: string
    address: string
    latitude?: number | null
    longitude?: number | null
    googlePlaceId?: string | null
    mapImageUrl?: string | null
    status?: $Enums.LocationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocationCreateOrConnectWithoutCabinetsInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutCabinetsInput, LocationUncheckedCreateWithoutCabinetsInput>
  }

  export type CompartmentCreateWithoutCabinetInput = {
    id?: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    status?: $Enums.CompartmentAvailability
    createdAt?: Date | string
    updatedAt?: Date | string
    lockMcpDevice?: McpDeviceCreateNestedOneWithoutLockCompartmentsInput
    sensorMcpDevice?: McpDeviceCreateNestedOneWithoutSensorCompartmentsInput
    rentals?: RentalCreateNestedManyWithoutCompartmentInput
    logs?: LockerLogCreateNestedManyWithoutCompartmentInput
    realtimeStatus?: CompartmentStatusCreateNestedOneWithoutCompartmentInput
  }

  export type CompartmentUncheckedCreateWithoutCabinetInput = {
    id?: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    lockMcpDeviceId?: string | null
    sensorMcpDeviceId?: string | null
    status?: $Enums.CompartmentAvailability
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalUncheckedCreateNestedManyWithoutCompartmentInput
    logs?: LockerLogUncheckedCreateNestedManyWithoutCompartmentInput
    realtimeStatus?: CompartmentStatusUncheckedCreateNestedOneWithoutCompartmentInput
  }

  export type CompartmentCreateOrConnectWithoutCabinetInput = {
    where: CompartmentWhereUniqueInput
    create: XOR<CompartmentCreateWithoutCabinetInput, CompartmentUncheckedCreateWithoutCabinetInput>
  }

  export type CompartmentCreateManyCabinetInputEnvelope = {
    data: CompartmentCreateManyCabinetInput | CompartmentCreateManyCabinetInput[]
    skipDuplicates?: boolean
  }

  export type McpDeviceCreateWithoutCabinetInput = {
    id?: string
    bus?: number
    address?: number
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lockCompartments?: CompartmentCreateNestedManyWithoutLockMcpDeviceInput
    sensorCompartments?: CompartmentCreateNestedManyWithoutSensorMcpDeviceInput
  }

  export type McpDeviceUncheckedCreateWithoutCabinetInput = {
    id?: string
    bus?: number
    address?: number
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lockCompartments?: CompartmentUncheckedCreateNestedManyWithoutLockMcpDeviceInput
    sensorCompartments?: CompartmentUncheckedCreateNestedManyWithoutSensorMcpDeviceInput
  }

  export type McpDeviceCreateOrConnectWithoutCabinetInput = {
    where: McpDeviceWhereUniqueInput
    create: XOR<McpDeviceCreateWithoutCabinetInput, McpDeviceUncheckedCreateWithoutCabinetInput>
  }

  export type McpDeviceCreateManyCabinetInputEnvelope = {
    data: McpDeviceCreateManyCabinetInput | McpDeviceCreateManyCabinetInput[]
    skipDuplicates?: boolean
  }

  export type LockerLogCreateWithoutCabinetInput = {
    id?: string
    action: $Enums.LockerAction
    attemptCount?: number
    success: boolean
    ipAddress?: string | null
    deviceInfo?: string | null
    note?: string | null
    createdAt?: Date | string
    compartment?: CompartmentCreateNestedOneWithoutLogsInput
    rental?: RentalCreateNestedOneWithoutLogsInput
  }

  export type LockerLogUncheckedCreateWithoutCabinetInput = {
    id?: string
    compartmentId?: string | null
    rentalId?: string | null
    action: $Enums.LockerAction
    attemptCount?: number
    success: boolean
    ipAddress?: string | null
    deviceInfo?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type LockerLogCreateOrConnectWithoutCabinetInput = {
    where: LockerLogWhereUniqueInput
    create: XOR<LockerLogCreateWithoutCabinetInput, LockerLogUncheckedCreateWithoutCabinetInput>
  }

  export type LockerLogCreateManyCabinetInputEnvelope = {
    data: LockerLogCreateManyCabinetInput | LockerLogCreateManyCabinetInput[]
    skipDuplicates?: boolean
  }

  export type LocationUpsertWithoutCabinetsInput = {
    update: XOR<LocationUpdateWithoutCabinetsInput, LocationUncheckedUpdateWithoutCabinetsInput>
    create: XOR<LocationCreateWithoutCabinetsInput, LocationUncheckedCreateWithoutCabinetsInput>
    where?: LocationWhereInput
  }

  export type LocationUpdateToOneWithWhereWithoutCabinetsInput = {
    where?: LocationWhereInput
    data: XOR<LocationUpdateWithoutCabinetsInput, LocationUncheckedUpdateWithoutCabinetsInput>
  }

  export type LocationUpdateWithoutCabinetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    googlePlaceId?: NullableStringFieldUpdateOperationsInput | string | null
    mapImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLocationStatusFieldUpdateOperationsInput | $Enums.LocationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationUncheckedUpdateWithoutCabinetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    googlePlaceId?: NullableStringFieldUpdateOperationsInput | string | null
    mapImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLocationStatusFieldUpdateOperationsInput | $Enums.LocationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompartmentUpsertWithWhereUniqueWithoutCabinetInput = {
    where: CompartmentWhereUniqueInput
    update: XOR<CompartmentUpdateWithoutCabinetInput, CompartmentUncheckedUpdateWithoutCabinetInput>
    create: XOR<CompartmentCreateWithoutCabinetInput, CompartmentUncheckedCreateWithoutCabinetInput>
  }

  export type CompartmentUpdateWithWhereUniqueWithoutCabinetInput = {
    where: CompartmentWhereUniqueInput
    data: XOR<CompartmentUpdateWithoutCabinetInput, CompartmentUncheckedUpdateWithoutCabinetInput>
  }

  export type CompartmentUpdateManyWithWhereWithoutCabinetInput = {
    where: CompartmentScalarWhereInput
    data: XOR<CompartmentUpdateManyMutationInput, CompartmentUncheckedUpdateManyWithoutCabinetInput>
  }

  export type CompartmentScalarWhereInput = {
    AND?: CompartmentScalarWhereInput | CompartmentScalarWhereInput[]
    OR?: CompartmentScalarWhereInput[]
    NOT?: CompartmentScalarWhereInput | CompartmentScalarWhereInput[]
    id?: StringFilter<"Compartment"> | string
    cabinetId?: StringFilter<"Compartment"> | string
    name?: StringFilter<"Compartment"> | string
    size?: EnumCompartmentSizeFilter<"Compartment"> | $Enums.CompartmentSize
    mcp23017PinLock?: IntFilter<"Compartment"> | number
    mcp23017PinSensor?: IntFilter<"Compartment"> | number
    lockMcpDeviceId?: StringNullableFilter<"Compartment"> | string | null
    sensorMcpDeviceId?: StringNullableFilter<"Compartment"> | string | null
    status?: EnumCompartmentAvailabilityFilter<"Compartment"> | $Enums.CompartmentAvailability
    createdAt?: DateTimeFilter<"Compartment"> | Date | string
    updatedAt?: DateTimeFilter<"Compartment"> | Date | string
  }

  export type McpDeviceUpsertWithWhereUniqueWithoutCabinetInput = {
    where: McpDeviceWhereUniqueInput
    update: XOR<McpDeviceUpdateWithoutCabinetInput, McpDeviceUncheckedUpdateWithoutCabinetInput>
    create: XOR<McpDeviceCreateWithoutCabinetInput, McpDeviceUncheckedCreateWithoutCabinetInput>
  }

  export type McpDeviceUpdateWithWhereUniqueWithoutCabinetInput = {
    where: McpDeviceWhereUniqueInput
    data: XOR<McpDeviceUpdateWithoutCabinetInput, McpDeviceUncheckedUpdateWithoutCabinetInput>
  }

  export type McpDeviceUpdateManyWithWhereWithoutCabinetInput = {
    where: McpDeviceScalarWhereInput
    data: XOR<McpDeviceUpdateManyMutationInput, McpDeviceUncheckedUpdateManyWithoutCabinetInput>
  }

  export type McpDeviceScalarWhereInput = {
    AND?: McpDeviceScalarWhereInput | McpDeviceScalarWhereInput[]
    OR?: McpDeviceScalarWhereInput[]
    NOT?: McpDeviceScalarWhereInput | McpDeviceScalarWhereInput[]
    id?: StringFilter<"McpDevice"> | string
    cabinetId?: StringFilter<"McpDevice"> | string
    bus?: IntFilter<"McpDevice"> | number
    address?: IntFilter<"McpDevice"> | number
    name?: StringNullableFilter<"McpDevice"> | string | null
    createdAt?: DateTimeFilter<"McpDevice"> | Date | string
    updatedAt?: DateTimeFilter<"McpDevice"> | Date | string
  }

  export type LockerLogUpsertWithWhereUniqueWithoutCabinetInput = {
    where: LockerLogWhereUniqueInput
    update: XOR<LockerLogUpdateWithoutCabinetInput, LockerLogUncheckedUpdateWithoutCabinetInput>
    create: XOR<LockerLogCreateWithoutCabinetInput, LockerLogUncheckedCreateWithoutCabinetInput>
  }

  export type LockerLogUpdateWithWhereUniqueWithoutCabinetInput = {
    where: LockerLogWhereUniqueInput
    data: XOR<LockerLogUpdateWithoutCabinetInput, LockerLogUncheckedUpdateWithoutCabinetInput>
  }

  export type LockerLogUpdateManyWithWhereWithoutCabinetInput = {
    where: LockerLogScalarWhereInput
    data: XOR<LockerLogUpdateManyMutationInput, LockerLogUncheckedUpdateManyWithoutCabinetInput>
  }

  export type LockerLogScalarWhereInput = {
    AND?: LockerLogScalarWhereInput | LockerLogScalarWhereInput[]
    OR?: LockerLogScalarWhereInput[]
    NOT?: LockerLogScalarWhereInput | LockerLogScalarWhereInput[]
    id?: StringFilter<"LockerLog"> | string
    cabinetId?: StringNullableFilter<"LockerLog"> | string | null
    compartmentId?: StringNullableFilter<"LockerLog"> | string | null
    rentalId?: StringNullableFilter<"LockerLog"> | string | null
    action?: EnumLockerActionFilter<"LockerLog"> | $Enums.LockerAction
    attemptCount?: IntFilter<"LockerLog"> | number
    success?: BoolFilter<"LockerLog"> | boolean
    ipAddress?: StringNullableFilter<"LockerLog"> | string | null
    deviceInfo?: StringNullableFilter<"LockerLog"> | string | null
    note?: StringNullableFilter<"LockerLog"> | string | null
    createdAt?: DateTimeFilter<"LockerLog"> | Date | string
  }

  export type CabinetCreateWithoutMcpDevicesInput = {
    id?: string
    name: string
    status?: $Enums.CabinetStatus
    lastHeartbeatAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    location: LocationCreateNestedOneWithoutCabinetsInput
    compartments?: CompartmentCreateNestedManyWithoutCabinetInput
    logs?: LockerLogCreateNestedManyWithoutCabinetInput
  }

  export type CabinetUncheckedCreateWithoutMcpDevicesInput = {
    id?: string
    locationId: string
    name: string
    status?: $Enums.CabinetStatus
    lastHeartbeatAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    compartments?: CompartmentUncheckedCreateNestedManyWithoutCabinetInput
    logs?: LockerLogUncheckedCreateNestedManyWithoutCabinetInput
  }

  export type CabinetCreateOrConnectWithoutMcpDevicesInput = {
    where: CabinetWhereUniqueInput
    create: XOR<CabinetCreateWithoutMcpDevicesInput, CabinetUncheckedCreateWithoutMcpDevicesInput>
  }

  export type CompartmentCreateWithoutLockMcpDeviceInput = {
    id?: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    status?: $Enums.CompartmentAvailability
    createdAt?: Date | string
    updatedAt?: Date | string
    cabinet: CabinetCreateNestedOneWithoutCompartmentsInput
    sensorMcpDevice?: McpDeviceCreateNestedOneWithoutSensorCompartmentsInput
    rentals?: RentalCreateNestedManyWithoutCompartmentInput
    logs?: LockerLogCreateNestedManyWithoutCompartmentInput
    realtimeStatus?: CompartmentStatusCreateNestedOneWithoutCompartmentInput
  }

  export type CompartmentUncheckedCreateWithoutLockMcpDeviceInput = {
    id?: string
    cabinetId: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    sensorMcpDeviceId?: string | null
    status?: $Enums.CompartmentAvailability
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalUncheckedCreateNestedManyWithoutCompartmentInput
    logs?: LockerLogUncheckedCreateNestedManyWithoutCompartmentInput
    realtimeStatus?: CompartmentStatusUncheckedCreateNestedOneWithoutCompartmentInput
  }

  export type CompartmentCreateOrConnectWithoutLockMcpDeviceInput = {
    where: CompartmentWhereUniqueInput
    create: XOR<CompartmentCreateWithoutLockMcpDeviceInput, CompartmentUncheckedCreateWithoutLockMcpDeviceInput>
  }

  export type CompartmentCreateManyLockMcpDeviceInputEnvelope = {
    data: CompartmentCreateManyLockMcpDeviceInput | CompartmentCreateManyLockMcpDeviceInput[]
    skipDuplicates?: boolean
  }

  export type CompartmentCreateWithoutSensorMcpDeviceInput = {
    id?: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    status?: $Enums.CompartmentAvailability
    createdAt?: Date | string
    updatedAt?: Date | string
    cabinet: CabinetCreateNestedOneWithoutCompartmentsInput
    lockMcpDevice?: McpDeviceCreateNestedOneWithoutLockCompartmentsInput
    rentals?: RentalCreateNestedManyWithoutCompartmentInput
    logs?: LockerLogCreateNestedManyWithoutCompartmentInput
    realtimeStatus?: CompartmentStatusCreateNestedOneWithoutCompartmentInput
  }

  export type CompartmentUncheckedCreateWithoutSensorMcpDeviceInput = {
    id?: string
    cabinetId: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    lockMcpDeviceId?: string | null
    status?: $Enums.CompartmentAvailability
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalUncheckedCreateNestedManyWithoutCompartmentInput
    logs?: LockerLogUncheckedCreateNestedManyWithoutCompartmentInput
    realtimeStatus?: CompartmentStatusUncheckedCreateNestedOneWithoutCompartmentInput
  }

  export type CompartmentCreateOrConnectWithoutSensorMcpDeviceInput = {
    where: CompartmentWhereUniqueInput
    create: XOR<CompartmentCreateWithoutSensorMcpDeviceInput, CompartmentUncheckedCreateWithoutSensorMcpDeviceInput>
  }

  export type CompartmentCreateManySensorMcpDeviceInputEnvelope = {
    data: CompartmentCreateManySensorMcpDeviceInput | CompartmentCreateManySensorMcpDeviceInput[]
    skipDuplicates?: boolean
  }

  export type CabinetUpsertWithoutMcpDevicesInput = {
    update: XOR<CabinetUpdateWithoutMcpDevicesInput, CabinetUncheckedUpdateWithoutMcpDevicesInput>
    create: XOR<CabinetCreateWithoutMcpDevicesInput, CabinetUncheckedCreateWithoutMcpDevicesInput>
    where?: CabinetWhereInput
  }

  export type CabinetUpdateToOneWithWhereWithoutMcpDevicesInput = {
    where?: CabinetWhereInput
    data: XOR<CabinetUpdateWithoutMcpDevicesInput, CabinetUncheckedUpdateWithoutMcpDevicesInput>
  }

  export type CabinetUpdateWithoutMcpDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumCabinetStatusFieldUpdateOperationsInput | $Enums.CabinetStatus
    lastHeartbeatAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: LocationUpdateOneRequiredWithoutCabinetsNestedInput
    compartments?: CompartmentUpdateManyWithoutCabinetNestedInput
    logs?: LockerLogUpdateManyWithoutCabinetNestedInput
  }

  export type CabinetUncheckedUpdateWithoutMcpDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    locationId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumCabinetStatusFieldUpdateOperationsInput | $Enums.CabinetStatus
    lastHeartbeatAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    compartments?: CompartmentUncheckedUpdateManyWithoutCabinetNestedInput
    logs?: LockerLogUncheckedUpdateManyWithoutCabinetNestedInput
  }

  export type CompartmentUpsertWithWhereUniqueWithoutLockMcpDeviceInput = {
    where: CompartmentWhereUniqueInput
    update: XOR<CompartmentUpdateWithoutLockMcpDeviceInput, CompartmentUncheckedUpdateWithoutLockMcpDeviceInput>
    create: XOR<CompartmentCreateWithoutLockMcpDeviceInput, CompartmentUncheckedCreateWithoutLockMcpDeviceInput>
  }

  export type CompartmentUpdateWithWhereUniqueWithoutLockMcpDeviceInput = {
    where: CompartmentWhereUniqueInput
    data: XOR<CompartmentUpdateWithoutLockMcpDeviceInput, CompartmentUncheckedUpdateWithoutLockMcpDeviceInput>
  }

  export type CompartmentUpdateManyWithWhereWithoutLockMcpDeviceInput = {
    where: CompartmentScalarWhereInput
    data: XOR<CompartmentUpdateManyMutationInput, CompartmentUncheckedUpdateManyWithoutLockMcpDeviceInput>
  }

  export type CompartmentUpsertWithWhereUniqueWithoutSensorMcpDeviceInput = {
    where: CompartmentWhereUniqueInput
    update: XOR<CompartmentUpdateWithoutSensorMcpDeviceInput, CompartmentUncheckedUpdateWithoutSensorMcpDeviceInput>
    create: XOR<CompartmentCreateWithoutSensorMcpDeviceInput, CompartmentUncheckedCreateWithoutSensorMcpDeviceInput>
  }

  export type CompartmentUpdateWithWhereUniqueWithoutSensorMcpDeviceInput = {
    where: CompartmentWhereUniqueInput
    data: XOR<CompartmentUpdateWithoutSensorMcpDeviceInput, CompartmentUncheckedUpdateWithoutSensorMcpDeviceInput>
  }

  export type CompartmentUpdateManyWithWhereWithoutSensorMcpDeviceInput = {
    where: CompartmentScalarWhereInput
    data: XOR<CompartmentUpdateManyMutationInput, CompartmentUncheckedUpdateManyWithoutSensorMcpDeviceInput>
  }

  export type CabinetCreateWithoutCompartmentsInput = {
    id?: string
    name: string
    status?: $Enums.CabinetStatus
    lastHeartbeatAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    location: LocationCreateNestedOneWithoutCabinetsInput
    mcpDevices?: McpDeviceCreateNestedManyWithoutCabinetInput
    logs?: LockerLogCreateNestedManyWithoutCabinetInput
  }

  export type CabinetUncheckedCreateWithoutCompartmentsInput = {
    id?: string
    locationId: string
    name: string
    status?: $Enums.CabinetStatus
    lastHeartbeatAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    mcpDevices?: McpDeviceUncheckedCreateNestedManyWithoutCabinetInput
    logs?: LockerLogUncheckedCreateNestedManyWithoutCabinetInput
  }

  export type CabinetCreateOrConnectWithoutCompartmentsInput = {
    where: CabinetWhereUniqueInput
    create: XOR<CabinetCreateWithoutCompartmentsInput, CabinetUncheckedCreateWithoutCompartmentsInput>
  }

  export type McpDeviceCreateWithoutLockCompartmentsInput = {
    id?: string
    bus?: number
    address?: number
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cabinet: CabinetCreateNestedOneWithoutMcpDevicesInput
    sensorCompartments?: CompartmentCreateNestedManyWithoutSensorMcpDeviceInput
  }

  export type McpDeviceUncheckedCreateWithoutLockCompartmentsInput = {
    id?: string
    cabinetId: string
    bus?: number
    address?: number
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sensorCompartments?: CompartmentUncheckedCreateNestedManyWithoutSensorMcpDeviceInput
  }

  export type McpDeviceCreateOrConnectWithoutLockCompartmentsInput = {
    where: McpDeviceWhereUniqueInput
    create: XOR<McpDeviceCreateWithoutLockCompartmentsInput, McpDeviceUncheckedCreateWithoutLockCompartmentsInput>
  }

  export type McpDeviceCreateWithoutSensorCompartmentsInput = {
    id?: string
    bus?: number
    address?: number
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cabinet: CabinetCreateNestedOneWithoutMcpDevicesInput
    lockCompartments?: CompartmentCreateNestedManyWithoutLockMcpDeviceInput
  }

  export type McpDeviceUncheckedCreateWithoutSensorCompartmentsInput = {
    id?: string
    cabinetId: string
    bus?: number
    address?: number
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lockCompartments?: CompartmentUncheckedCreateNestedManyWithoutLockMcpDeviceInput
  }

  export type McpDeviceCreateOrConnectWithoutSensorCompartmentsInput = {
    where: McpDeviceWhereUniqueInput
    create: XOR<McpDeviceCreateWithoutSensorCompartmentsInput, McpDeviceUncheckedCreateWithoutSensorCompartmentsInput>
  }

  export type RentalCreateWithoutCompartmentInput = {
    id?: string
    code: string
    codeHash: string
    qrToken: string
    openCount?: number
    maxOpens: number
    expiresAt: Date | string
    paymentStatus?: $Enums.PaymentStatus
    paymentMethod?: $Enums.PaymentMethod
    paidAt?: Date | string | null
    status?: $Enums.RentalStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutRentalsInput
    pricePlan: PricePlanCreateNestedOneWithoutRentalsInput
    logs?: LockerLogCreateNestedManyWithoutRentalInput
  }

  export type RentalUncheckedCreateWithoutCompartmentInput = {
    id?: string
    userId?: string | null
    pricePlanId: string
    code: string
    codeHash: string
    qrToken: string
    openCount?: number
    maxOpens: number
    expiresAt: Date | string
    paymentStatus?: $Enums.PaymentStatus
    paymentMethod?: $Enums.PaymentMethod
    paidAt?: Date | string | null
    status?: $Enums.RentalStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    logs?: LockerLogUncheckedCreateNestedManyWithoutRentalInput
  }

  export type RentalCreateOrConnectWithoutCompartmentInput = {
    where: RentalWhereUniqueInput
    create: XOR<RentalCreateWithoutCompartmentInput, RentalUncheckedCreateWithoutCompartmentInput>
  }

  export type RentalCreateManyCompartmentInputEnvelope = {
    data: RentalCreateManyCompartmentInput | RentalCreateManyCompartmentInput[]
    skipDuplicates?: boolean
  }

  export type LockerLogCreateWithoutCompartmentInput = {
    id?: string
    action: $Enums.LockerAction
    attemptCount?: number
    success: boolean
    ipAddress?: string | null
    deviceInfo?: string | null
    note?: string | null
    createdAt?: Date | string
    cabinet?: CabinetCreateNestedOneWithoutLogsInput
    rental?: RentalCreateNestedOneWithoutLogsInput
  }

  export type LockerLogUncheckedCreateWithoutCompartmentInput = {
    id?: string
    cabinetId?: string | null
    rentalId?: string | null
    action: $Enums.LockerAction
    attemptCount?: number
    success: boolean
    ipAddress?: string | null
    deviceInfo?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type LockerLogCreateOrConnectWithoutCompartmentInput = {
    where: LockerLogWhereUniqueInput
    create: XOR<LockerLogCreateWithoutCompartmentInput, LockerLogUncheckedCreateWithoutCompartmentInput>
  }

  export type LockerLogCreateManyCompartmentInputEnvelope = {
    data: LockerLogCreateManyCompartmentInput | LockerLogCreateManyCompartmentInput[]
    skipDuplicates?: boolean
  }

  export type CompartmentStatusCreateWithoutCompartmentInput = {
    id?: string
    lockStatus?: $Enums.LockStatus
    doorStatus?: $Enums.DoorStatus
    lastUpdatedAt?: Date | string
  }

  export type CompartmentStatusUncheckedCreateWithoutCompartmentInput = {
    id?: string
    lockStatus?: $Enums.LockStatus
    doorStatus?: $Enums.DoorStatus
    lastUpdatedAt?: Date | string
  }

  export type CompartmentStatusCreateOrConnectWithoutCompartmentInput = {
    where: CompartmentStatusWhereUniqueInput
    create: XOR<CompartmentStatusCreateWithoutCompartmentInput, CompartmentStatusUncheckedCreateWithoutCompartmentInput>
  }

  export type CabinetUpsertWithoutCompartmentsInput = {
    update: XOR<CabinetUpdateWithoutCompartmentsInput, CabinetUncheckedUpdateWithoutCompartmentsInput>
    create: XOR<CabinetCreateWithoutCompartmentsInput, CabinetUncheckedCreateWithoutCompartmentsInput>
    where?: CabinetWhereInput
  }

  export type CabinetUpdateToOneWithWhereWithoutCompartmentsInput = {
    where?: CabinetWhereInput
    data: XOR<CabinetUpdateWithoutCompartmentsInput, CabinetUncheckedUpdateWithoutCompartmentsInput>
  }

  export type CabinetUpdateWithoutCompartmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumCabinetStatusFieldUpdateOperationsInput | $Enums.CabinetStatus
    lastHeartbeatAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: LocationUpdateOneRequiredWithoutCabinetsNestedInput
    mcpDevices?: McpDeviceUpdateManyWithoutCabinetNestedInput
    logs?: LockerLogUpdateManyWithoutCabinetNestedInput
  }

  export type CabinetUncheckedUpdateWithoutCompartmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    locationId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumCabinetStatusFieldUpdateOperationsInput | $Enums.CabinetStatus
    lastHeartbeatAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mcpDevices?: McpDeviceUncheckedUpdateManyWithoutCabinetNestedInput
    logs?: LockerLogUncheckedUpdateManyWithoutCabinetNestedInput
  }

  export type McpDeviceUpsertWithoutLockCompartmentsInput = {
    update: XOR<McpDeviceUpdateWithoutLockCompartmentsInput, McpDeviceUncheckedUpdateWithoutLockCompartmentsInput>
    create: XOR<McpDeviceCreateWithoutLockCompartmentsInput, McpDeviceUncheckedCreateWithoutLockCompartmentsInput>
    where?: McpDeviceWhereInput
  }

  export type McpDeviceUpdateToOneWithWhereWithoutLockCompartmentsInput = {
    where?: McpDeviceWhereInput
    data: XOR<McpDeviceUpdateWithoutLockCompartmentsInput, McpDeviceUncheckedUpdateWithoutLockCompartmentsInput>
  }

  export type McpDeviceUpdateWithoutLockCompartmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    bus?: IntFieldUpdateOperationsInput | number
    address?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cabinet?: CabinetUpdateOneRequiredWithoutMcpDevicesNestedInput
    sensorCompartments?: CompartmentUpdateManyWithoutSensorMcpDeviceNestedInput
  }

  export type McpDeviceUncheckedUpdateWithoutLockCompartmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: StringFieldUpdateOperationsInput | string
    bus?: IntFieldUpdateOperationsInput | number
    address?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sensorCompartments?: CompartmentUncheckedUpdateManyWithoutSensorMcpDeviceNestedInput
  }

  export type McpDeviceUpsertWithoutSensorCompartmentsInput = {
    update: XOR<McpDeviceUpdateWithoutSensorCompartmentsInput, McpDeviceUncheckedUpdateWithoutSensorCompartmentsInput>
    create: XOR<McpDeviceCreateWithoutSensorCompartmentsInput, McpDeviceUncheckedCreateWithoutSensorCompartmentsInput>
    where?: McpDeviceWhereInput
  }

  export type McpDeviceUpdateToOneWithWhereWithoutSensorCompartmentsInput = {
    where?: McpDeviceWhereInput
    data: XOR<McpDeviceUpdateWithoutSensorCompartmentsInput, McpDeviceUncheckedUpdateWithoutSensorCompartmentsInput>
  }

  export type McpDeviceUpdateWithoutSensorCompartmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    bus?: IntFieldUpdateOperationsInput | number
    address?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cabinet?: CabinetUpdateOneRequiredWithoutMcpDevicesNestedInput
    lockCompartments?: CompartmentUpdateManyWithoutLockMcpDeviceNestedInput
  }

  export type McpDeviceUncheckedUpdateWithoutSensorCompartmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: StringFieldUpdateOperationsInput | string
    bus?: IntFieldUpdateOperationsInput | number
    address?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lockCompartments?: CompartmentUncheckedUpdateManyWithoutLockMcpDeviceNestedInput
  }

  export type RentalUpsertWithWhereUniqueWithoutCompartmentInput = {
    where: RentalWhereUniqueInput
    update: XOR<RentalUpdateWithoutCompartmentInput, RentalUncheckedUpdateWithoutCompartmentInput>
    create: XOR<RentalCreateWithoutCompartmentInput, RentalUncheckedCreateWithoutCompartmentInput>
  }

  export type RentalUpdateWithWhereUniqueWithoutCompartmentInput = {
    where: RentalWhereUniqueInput
    data: XOR<RentalUpdateWithoutCompartmentInput, RentalUncheckedUpdateWithoutCompartmentInput>
  }

  export type RentalUpdateManyWithWhereWithoutCompartmentInput = {
    where: RentalScalarWhereInput
    data: XOR<RentalUpdateManyMutationInput, RentalUncheckedUpdateManyWithoutCompartmentInput>
  }

  export type LockerLogUpsertWithWhereUniqueWithoutCompartmentInput = {
    where: LockerLogWhereUniqueInput
    update: XOR<LockerLogUpdateWithoutCompartmentInput, LockerLogUncheckedUpdateWithoutCompartmentInput>
    create: XOR<LockerLogCreateWithoutCompartmentInput, LockerLogUncheckedCreateWithoutCompartmentInput>
  }

  export type LockerLogUpdateWithWhereUniqueWithoutCompartmentInput = {
    where: LockerLogWhereUniqueInput
    data: XOR<LockerLogUpdateWithoutCompartmentInput, LockerLogUncheckedUpdateWithoutCompartmentInput>
  }

  export type LockerLogUpdateManyWithWhereWithoutCompartmentInput = {
    where: LockerLogScalarWhereInput
    data: XOR<LockerLogUpdateManyMutationInput, LockerLogUncheckedUpdateManyWithoutCompartmentInput>
  }

  export type CompartmentStatusUpsertWithoutCompartmentInput = {
    update: XOR<CompartmentStatusUpdateWithoutCompartmentInput, CompartmentStatusUncheckedUpdateWithoutCompartmentInput>
    create: XOR<CompartmentStatusCreateWithoutCompartmentInput, CompartmentStatusUncheckedCreateWithoutCompartmentInput>
    where?: CompartmentStatusWhereInput
  }

  export type CompartmentStatusUpdateToOneWithWhereWithoutCompartmentInput = {
    where?: CompartmentStatusWhereInput
    data: XOR<CompartmentStatusUpdateWithoutCompartmentInput, CompartmentStatusUncheckedUpdateWithoutCompartmentInput>
  }

  export type CompartmentStatusUpdateWithoutCompartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    lockStatus?: EnumLockStatusFieldUpdateOperationsInput | $Enums.LockStatus
    doorStatus?: EnumDoorStatusFieldUpdateOperationsInput | $Enums.DoorStatus
    lastUpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompartmentStatusUncheckedUpdateWithoutCompartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    lockStatus?: EnumLockStatusFieldUpdateOperationsInput | $Enums.LockStatus
    doorStatus?: EnumDoorStatusFieldUpdateOperationsInput | $Enums.DoorStatus
    lastUpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompartmentCreateWithoutRealtimeStatusInput = {
    id?: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    status?: $Enums.CompartmentAvailability
    createdAt?: Date | string
    updatedAt?: Date | string
    cabinet: CabinetCreateNestedOneWithoutCompartmentsInput
    lockMcpDevice?: McpDeviceCreateNestedOneWithoutLockCompartmentsInput
    sensorMcpDevice?: McpDeviceCreateNestedOneWithoutSensorCompartmentsInput
    rentals?: RentalCreateNestedManyWithoutCompartmentInput
    logs?: LockerLogCreateNestedManyWithoutCompartmentInput
  }

  export type CompartmentUncheckedCreateWithoutRealtimeStatusInput = {
    id?: string
    cabinetId: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    lockMcpDeviceId?: string | null
    sensorMcpDeviceId?: string | null
    status?: $Enums.CompartmentAvailability
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalUncheckedCreateNestedManyWithoutCompartmentInput
    logs?: LockerLogUncheckedCreateNestedManyWithoutCompartmentInput
  }

  export type CompartmentCreateOrConnectWithoutRealtimeStatusInput = {
    where: CompartmentWhereUniqueInput
    create: XOR<CompartmentCreateWithoutRealtimeStatusInput, CompartmentUncheckedCreateWithoutRealtimeStatusInput>
  }

  export type CompartmentUpsertWithoutRealtimeStatusInput = {
    update: XOR<CompartmentUpdateWithoutRealtimeStatusInput, CompartmentUncheckedUpdateWithoutRealtimeStatusInput>
    create: XOR<CompartmentCreateWithoutRealtimeStatusInput, CompartmentUncheckedCreateWithoutRealtimeStatusInput>
    where?: CompartmentWhereInput
  }

  export type CompartmentUpdateToOneWithWhereWithoutRealtimeStatusInput = {
    where?: CompartmentWhereInput
    data: XOR<CompartmentUpdateWithoutRealtimeStatusInput, CompartmentUncheckedUpdateWithoutRealtimeStatusInput>
  }

  export type CompartmentUpdateWithoutRealtimeStatusInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cabinet?: CabinetUpdateOneRequiredWithoutCompartmentsNestedInput
    lockMcpDevice?: McpDeviceUpdateOneWithoutLockCompartmentsNestedInput
    sensorMcpDevice?: McpDeviceUpdateOneWithoutSensorCompartmentsNestedInput
    rentals?: RentalUpdateManyWithoutCompartmentNestedInput
    logs?: LockerLogUpdateManyWithoutCompartmentNestedInput
  }

  export type CompartmentUncheckedUpdateWithoutRealtimeStatusInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    lockMcpDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    sensorMcpDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUncheckedUpdateManyWithoutCompartmentNestedInput
    logs?: LockerLogUncheckedUpdateManyWithoutCompartmentNestedInput
  }

  export type RentalCreateWithoutPricePlanInput = {
    id?: string
    code: string
    codeHash: string
    qrToken: string
    openCount?: number
    maxOpens: number
    expiresAt: Date | string
    paymentStatus?: $Enums.PaymentStatus
    paymentMethod?: $Enums.PaymentMethod
    paidAt?: Date | string | null
    status?: $Enums.RentalStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutRentalsInput
    compartment: CompartmentCreateNestedOneWithoutRentalsInput
    logs?: LockerLogCreateNestedManyWithoutRentalInput
  }

  export type RentalUncheckedCreateWithoutPricePlanInput = {
    id?: string
    userId?: string | null
    compartmentId: string
    code: string
    codeHash: string
    qrToken: string
    openCount?: number
    maxOpens: number
    expiresAt: Date | string
    paymentStatus?: $Enums.PaymentStatus
    paymentMethod?: $Enums.PaymentMethod
    paidAt?: Date | string | null
    status?: $Enums.RentalStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    logs?: LockerLogUncheckedCreateNestedManyWithoutRentalInput
  }

  export type RentalCreateOrConnectWithoutPricePlanInput = {
    where: RentalWhereUniqueInput
    create: XOR<RentalCreateWithoutPricePlanInput, RentalUncheckedCreateWithoutPricePlanInput>
  }

  export type RentalCreateManyPricePlanInputEnvelope = {
    data: RentalCreateManyPricePlanInput | RentalCreateManyPricePlanInput[]
    skipDuplicates?: boolean
  }

  export type RentalUpsertWithWhereUniqueWithoutPricePlanInput = {
    where: RentalWhereUniqueInput
    update: XOR<RentalUpdateWithoutPricePlanInput, RentalUncheckedUpdateWithoutPricePlanInput>
    create: XOR<RentalCreateWithoutPricePlanInput, RentalUncheckedCreateWithoutPricePlanInput>
  }

  export type RentalUpdateWithWhereUniqueWithoutPricePlanInput = {
    where: RentalWhereUniqueInput
    data: XOR<RentalUpdateWithoutPricePlanInput, RentalUncheckedUpdateWithoutPricePlanInput>
  }

  export type RentalUpdateManyWithWhereWithoutPricePlanInput = {
    where: RentalScalarWhereInput
    data: XOR<RentalUpdateManyMutationInput, RentalUncheckedUpdateManyWithoutPricePlanInput>
  }

  export type UserCreateWithoutRentalsInput = {
    id?: string
    email?: string | null
    phone: string
    passwordHash?: string | null
    name?: string | null
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationCreateNestedManyWithoutUserInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRentalsInput = {
    id?: string
    email?: string | null
    phone: string
    passwordHash?: string | null
    name?: string | null
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRentalsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRentalsInput, UserUncheckedCreateWithoutRentalsInput>
  }

  export type CompartmentCreateWithoutRentalsInput = {
    id?: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    status?: $Enums.CompartmentAvailability
    createdAt?: Date | string
    updatedAt?: Date | string
    cabinet: CabinetCreateNestedOneWithoutCompartmentsInput
    lockMcpDevice?: McpDeviceCreateNestedOneWithoutLockCompartmentsInput
    sensorMcpDevice?: McpDeviceCreateNestedOneWithoutSensorCompartmentsInput
    logs?: LockerLogCreateNestedManyWithoutCompartmentInput
    realtimeStatus?: CompartmentStatusCreateNestedOneWithoutCompartmentInput
  }

  export type CompartmentUncheckedCreateWithoutRentalsInput = {
    id?: string
    cabinetId: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    lockMcpDeviceId?: string | null
    sensorMcpDeviceId?: string | null
    status?: $Enums.CompartmentAvailability
    createdAt?: Date | string
    updatedAt?: Date | string
    logs?: LockerLogUncheckedCreateNestedManyWithoutCompartmentInput
    realtimeStatus?: CompartmentStatusUncheckedCreateNestedOneWithoutCompartmentInput
  }

  export type CompartmentCreateOrConnectWithoutRentalsInput = {
    where: CompartmentWhereUniqueInput
    create: XOR<CompartmentCreateWithoutRentalsInput, CompartmentUncheckedCreateWithoutRentalsInput>
  }

  export type PricePlanCreateWithoutRentalsInput = {
    id?: string
    name: string
    size: $Enums.CompartmentSize
    rentalType: $Enums.RentalType
    price: number
    maxOpens?: number | null
    durationDays: number
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PricePlanUncheckedCreateWithoutRentalsInput = {
    id?: string
    name: string
    size: $Enums.CompartmentSize
    rentalType: $Enums.RentalType
    price: number
    maxOpens?: number | null
    durationDays: number
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PricePlanCreateOrConnectWithoutRentalsInput = {
    where: PricePlanWhereUniqueInput
    create: XOR<PricePlanCreateWithoutRentalsInput, PricePlanUncheckedCreateWithoutRentalsInput>
  }

  export type LockerLogCreateWithoutRentalInput = {
    id?: string
    action: $Enums.LockerAction
    attemptCount?: number
    success: boolean
    ipAddress?: string | null
    deviceInfo?: string | null
    note?: string | null
    createdAt?: Date | string
    cabinet?: CabinetCreateNestedOneWithoutLogsInput
    compartment?: CompartmentCreateNestedOneWithoutLogsInput
  }

  export type LockerLogUncheckedCreateWithoutRentalInput = {
    id?: string
    cabinetId?: string | null
    compartmentId?: string | null
    action: $Enums.LockerAction
    attemptCount?: number
    success: boolean
    ipAddress?: string | null
    deviceInfo?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type LockerLogCreateOrConnectWithoutRentalInput = {
    where: LockerLogWhereUniqueInput
    create: XOR<LockerLogCreateWithoutRentalInput, LockerLogUncheckedCreateWithoutRentalInput>
  }

  export type LockerLogCreateManyRentalInputEnvelope = {
    data: LockerLogCreateManyRentalInput | LockerLogCreateManyRentalInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutRentalsInput = {
    update: XOR<UserUpdateWithoutRentalsInput, UserUncheckedUpdateWithoutRentalsInput>
    create: XOR<UserCreateWithoutRentalsInput, UserUncheckedCreateWithoutRentalsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRentalsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRentalsInput, UserUncheckedUpdateWithoutRentalsInput>
  }

  export type UserUpdateWithoutRentalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRentalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CompartmentUpsertWithoutRentalsInput = {
    update: XOR<CompartmentUpdateWithoutRentalsInput, CompartmentUncheckedUpdateWithoutRentalsInput>
    create: XOR<CompartmentCreateWithoutRentalsInput, CompartmentUncheckedCreateWithoutRentalsInput>
    where?: CompartmentWhereInput
  }

  export type CompartmentUpdateToOneWithWhereWithoutRentalsInput = {
    where?: CompartmentWhereInput
    data: XOR<CompartmentUpdateWithoutRentalsInput, CompartmentUncheckedUpdateWithoutRentalsInput>
  }

  export type CompartmentUpdateWithoutRentalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cabinet?: CabinetUpdateOneRequiredWithoutCompartmentsNestedInput
    lockMcpDevice?: McpDeviceUpdateOneWithoutLockCompartmentsNestedInput
    sensorMcpDevice?: McpDeviceUpdateOneWithoutSensorCompartmentsNestedInput
    logs?: LockerLogUpdateManyWithoutCompartmentNestedInput
    realtimeStatus?: CompartmentStatusUpdateOneWithoutCompartmentNestedInput
  }

  export type CompartmentUncheckedUpdateWithoutRentalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    lockMcpDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    sensorMcpDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    logs?: LockerLogUncheckedUpdateManyWithoutCompartmentNestedInput
    realtimeStatus?: CompartmentStatusUncheckedUpdateOneWithoutCompartmentNestedInput
  }

  export type PricePlanUpsertWithoutRentalsInput = {
    update: XOR<PricePlanUpdateWithoutRentalsInput, PricePlanUncheckedUpdateWithoutRentalsInput>
    create: XOR<PricePlanCreateWithoutRentalsInput, PricePlanUncheckedCreateWithoutRentalsInput>
    where?: PricePlanWhereInput
  }

  export type PricePlanUpdateToOneWithWhereWithoutRentalsInput = {
    where?: PricePlanWhereInput
    data: XOR<PricePlanUpdateWithoutRentalsInput, PricePlanUncheckedUpdateWithoutRentalsInput>
  }

  export type PricePlanUpdateWithoutRentalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    rentalType?: EnumRentalTypeFieldUpdateOperationsInput | $Enums.RentalType
    price?: IntFieldUpdateOperationsInput | number
    maxOpens?: NullableIntFieldUpdateOperationsInput | number | null
    durationDays?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PricePlanUncheckedUpdateWithoutRentalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    rentalType?: EnumRentalTypeFieldUpdateOperationsInput | $Enums.RentalType
    price?: IntFieldUpdateOperationsInput | number
    maxOpens?: NullableIntFieldUpdateOperationsInput | number | null
    durationDays?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LockerLogUpsertWithWhereUniqueWithoutRentalInput = {
    where: LockerLogWhereUniqueInput
    update: XOR<LockerLogUpdateWithoutRentalInput, LockerLogUncheckedUpdateWithoutRentalInput>
    create: XOR<LockerLogCreateWithoutRentalInput, LockerLogUncheckedCreateWithoutRentalInput>
  }

  export type LockerLogUpdateWithWhereUniqueWithoutRentalInput = {
    where: LockerLogWhereUniqueInput
    data: XOR<LockerLogUpdateWithoutRentalInput, LockerLogUncheckedUpdateWithoutRentalInput>
  }

  export type LockerLogUpdateManyWithWhereWithoutRentalInput = {
    where: LockerLogScalarWhereInput
    data: XOR<LockerLogUpdateManyMutationInput, LockerLogUncheckedUpdateManyWithoutRentalInput>
  }

  export type CabinetCreateWithoutLogsInput = {
    id?: string
    name: string
    status?: $Enums.CabinetStatus
    lastHeartbeatAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    location: LocationCreateNestedOneWithoutCabinetsInput
    compartments?: CompartmentCreateNestedManyWithoutCabinetInput
    mcpDevices?: McpDeviceCreateNestedManyWithoutCabinetInput
  }

  export type CabinetUncheckedCreateWithoutLogsInput = {
    id?: string
    locationId: string
    name: string
    status?: $Enums.CabinetStatus
    lastHeartbeatAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    compartments?: CompartmentUncheckedCreateNestedManyWithoutCabinetInput
    mcpDevices?: McpDeviceUncheckedCreateNestedManyWithoutCabinetInput
  }

  export type CabinetCreateOrConnectWithoutLogsInput = {
    where: CabinetWhereUniqueInput
    create: XOR<CabinetCreateWithoutLogsInput, CabinetUncheckedCreateWithoutLogsInput>
  }

  export type CompartmentCreateWithoutLogsInput = {
    id?: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    status?: $Enums.CompartmentAvailability
    createdAt?: Date | string
    updatedAt?: Date | string
    cabinet: CabinetCreateNestedOneWithoutCompartmentsInput
    lockMcpDevice?: McpDeviceCreateNestedOneWithoutLockCompartmentsInput
    sensorMcpDevice?: McpDeviceCreateNestedOneWithoutSensorCompartmentsInput
    rentals?: RentalCreateNestedManyWithoutCompartmentInput
    realtimeStatus?: CompartmentStatusCreateNestedOneWithoutCompartmentInput
  }

  export type CompartmentUncheckedCreateWithoutLogsInput = {
    id?: string
    cabinetId: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    lockMcpDeviceId?: string | null
    sensorMcpDeviceId?: string | null
    status?: $Enums.CompartmentAvailability
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalUncheckedCreateNestedManyWithoutCompartmentInput
    realtimeStatus?: CompartmentStatusUncheckedCreateNestedOneWithoutCompartmentInput
  }

  export type CompartmentCreateOrConnectWithoutLogsInput = {
    where: CompartmentWhereUniqueInput
    create: XOR<CompartmentCreateWithoutLogsInput, CompartmentUncheckedCreateWithoutLogsInput>
  }

  export type RentalCreateWithoutLogsInput = {
    id?: string
    code: string
    codeHash: string
    qrToken: string
    openCount?: number
    maxOpens: number
    expiresAt: Date | string
    paymentStatus?: $Enums.PaymentStatus
    paymentMethod?: $Enums.PaymentMethod
    paidAt?: Date | string | null
    status?: $Enums.RentalStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutRentalsInput
    compartment: CompartmentCreateNestedOneWithoutRentalsInput
    pricePlan: PricePlanCreateNestedOneWithoutRentalsInput
  }

  export type RentalUncheckedCreateWithoutLogsInput = {
    id?: string
    userId?: string | null
    compartmentId: string
    pricePlanId: string
    code: string
    codeHash: string
    qrToken: string
    openCount?: number
    maxOpens: number
    expiresAt: Date | string
    paymentStatus?: $Enums.PaymentStatus
    paymentMethod?: $Enums.PaymentMethod
    paidAt?: Date | string | null
    status?: $Enums.RentalStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RentalCreateOrConnectWithoutLogsInput = {
    where: RentalWhereUniqueInput
    create: XOR<RentalCreateWithoutLogsInput, RentalUncheckedCreateWithoutLogsInput>
  }

  export type CabinetUpsertWithoutLogsInput = {
    update: XOR<CabinetUpdateWithoutLogsInput, CabinetUncheckedUpdateWithoutLogsInput>
    create: XOR<CabinetCreateWithoutLogsInput, CabinetUncheckedCreateWithoutLogsInput>
    where?: CabinetWhereInput
  }

  export type CabinetUpdateToOneWithWhereWithoutLogsInput = {
    where?: CabinetWhereInput
    data: XOR<CabinetUpdateWithoutLogsInput, CabinetUncheckedUpdateWithoutLogsInput>
  }

  export type CabinetUpdateWithoutLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumCabinetStatusFieldUpdateOperationsInput | $Enums.CabinetStatus
    lastHeartbeatAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: LocationUpdateOneRequiredWithoutCabinetsNestedInput
    compartments?: CompartmentUpdateManyWithoutCabinetNestedInput
    mcpDevices?: McpDeviceUpdateManyWithoutCabinetNestedInput
  }

  export type CabinetUncheckedUpdateWithoutLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    locationId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumCabinetStatusFieldUpdateOperationsInput | $Enums.CabinetStatus
    lastHeartbeatAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    compartments?: CompartmentUncheckedUpdateManyWithoutCabinetNestedInput
    mcpDevices?: McpDeviceUncheckedUpdateManyWithoutCabinetNestedInput
  }

  export type CompartmentUpsertWithoutLogsInput = {
    update: XOR<CompartmentUpdateWithoutLogsInput, CompartmentUncheckedUpdateWithoutLogsInput>
    create: XOR<CompartmentCreateWithoutLogsInput, CompartmentUncheckedCreateWithoutLogsInput>
    where?: CompartmentWhereInput
  }

  export type CompartmentUpdateToOneWithWhereWithoutLogsInput = {
    where?: CompartmentWhereInput
    data: XOR<CompartmentUpdateWithoutLogsInput, CompartmentUncheckedUpdateWithoutLogsInput>
  }

  export type CompartmentUpdateWithoutLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cabinet?: CabinetUpdateOneRequiredWithoutCompartmentsNestedInput
    lockMcpDevice?: McpDeviceUpdateOneWithoutLockCompartmentsNestedInput
    sensorMcpDevice?: McpDeviceUpdateOneWithoutSensorCompartmentsNestedInput
    rentals?: RentalUpdateManyWithoutCompartmentNestedInput
    realtimeStatus?: CompartmentStatusUpdateOneWithoutCompartmentNestedInput
  }

  export type CompartmentUncheckedUpdateWithoutLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    lockMcpDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    sensorMcpDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUncheckedUpdateManyWithoutCompartmentNestedInput
    realtimeStatus?: CompartmentStatusUncheckedUpdateOneWithoutCompartmentNestedInput
  }

  export type RentalUpsertWithoutLogsInput = {
    update: XOR<RentalUpdateWithoutLogsInput, RentalUncheckedUpdateWithoutLogsInput>
    create: XOR<RentalCreateWithoutLogsInput, RentalUncheckedCreateWithoutLogsInput>
    where?: RentalWhereInput
  }

  export type RentalUpdateToOneWithWhereWithoutLogsInput = {
    where?: RentalWhereInput
    data: XOR<RentalUpdateWithoutLogsInput, RentalUncheckedUpdateWithoutLogsInput>
  }

  export type RentalUpdateWithoutLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    qrToken?: StringFieldUpdateOperationsInput | string
    openCount?: IntFieldUpdateOperationsInput | number
    maxOpens?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRentalStatusFieldUpdateOperationsInput | $Enums.RentalStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutRentalsNestedInput
    compartment?: CompartmentUpdateOneRequiredWithoutRentalsNestedInput
    pricePlan?: PricePlanUpdateOneRequiredWithoutRentalsNestedInput
  }

  export type RentalUncheckedUpdateWithoutLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    compartmentId?: StringFieldUpdateOperationsInput | string
    pricePlanId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    qrToken?: StringFieldUpdateOperationsInput | string
    openCount?: IntFieldUpdateOperationsInput | number
    maxOpens?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRentalStatusFieldUpdateOperationsInput | $Enums.RentalStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutNotificationsInput = {
    id?: string
    email?: string | null
    phone: string
    passwordHash?: string | null
    name?: string | null
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalCreateNestedManyWithoutUserInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNotificationsInput = {
    id?: string
    email?: string | null
    phone: string
    passwordHash?: string | null
    name?: string | null
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalUncheckedCreateNestedManyWithoutUserInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
  }

  export type UserUpsertWithoutNotificationsInput = {
    update: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUncheckedUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    email?: string | null
    phone: string
    passwordHash?: string | null
    name?: string | null
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email?: string | null
    phone: string
    passwordHash?: string | null
    name?: string | null
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type RentalCreateManyUserInput = {
    id?: string
    compartmentId: string
    pricePlanId: string
    code: string
    codeHash: string
    qrToken: string
    openCount?: number
    maxOpens: number
    expiresAt: Date | string
    paymentStatus?: $Enums.PaymentStatus
    paymentMethod?: $Enums.PaymentMethod
    paidAt?: Date | string | null
    status?: $Enums.RentalStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateManyUserInput = {
    id?: string
    title: string
    body: string
    type: $Enums.NotificationType
    data?: NullableJsonNullValueInput | InputJsonValue
    isRead?: boolean
    sentAt?: Date | string
    createdAt?: Date | string
  }

  export type UserSessionCreateManyUserInput = {
    id?: string
    socketId: string
    deviceType: $Enums.DeviceType
    deviceInfo?: string | null
    connectedAt?: Date | string
    disconnectedAt?: Date | string | null
    isActive?: boolean
  }

  export type RentalUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    qrToken?: StringFieldUpdateOperationsInput | string
    openCount?: IntFieldUpdateOperationsInput | number
    maxOpens?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRentalStatusFieldUpdateOperationsInput | $Enums.RentalStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    compartment?: CompartmentUpdateOneRequiredWithoutRentalsNestedInput
    pricePlan?: PricePlanUpdateOneRequiredWithoutRentalsNestedInput
    logs?: LockerLogUpdateManyWithoutRentalNestedInput
  }

  export type RentalUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    compartmentId?: StringFieldUpdateOperationsInput | string
    pricePlanId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    qrToken?: StringFieldUpdateOperationsInput | string
    openCount?: IntFieldUpdateOperationsInput | number
    maxOpens?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRentalStatusFieldUpdateOperationsInput | $Enums.RentalStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    logs?: LockerLogUncheckedUpdateManyWithoutRentalNestedInput
  }

  export type RentalUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    compartmentId?: StringFieldUpdateOperationsInput | string
    pricePlanId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    qrToken?: StringFieldUpdateOperationsInput | string
    openCount?: IntFieldUpdateOperationsInput | number
    maxOpens?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRentalStatusFieldUpdateOperationsInput | $Enums.RentalStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    data?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    data?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    data?: NullableJsonNullValueInput | InputJsonValue
    isRead?: BoolFieldUpdateOperationsInput | boolean
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    socketId?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    connectedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disconnectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    socketId?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    connectedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disconnectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    socketId?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    connectedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    disconnectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CabinetCreateManyLocationInput = {
    id?: string
    name: string
    status?: $Enums.CabinetStatus
    lastHeartbeatAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CabinetUpdateWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumCabinetStatusFieldUpdateOperationsInput | $Enums.CabinetStatus
    lastHeartbeatAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    compartments?: CompartmentUpdateManyWithoutCabinetNestedInput
    mcpDevices?: McpDeviceUpdateManyWithoutCabinetNestedInput
    logs?: LockerLogUpdateManyWithoutCabinetNestedInput
  }

  export type CabinetUncheckedUpdateWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumCabinetStatusFieldUpdateOperationsInput | $Enums.CabinetStatus
    lastHeartbeatAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    compartments?: CompartmentUncheckedUpdateManyWithoutCabinetNestedInput
    mcpDevices?: McpDeviceUncheckedUpdateManyWithoutCabinetNestedInput
    logs?: LockerLogUncheckedUpdateManyWithoutCabinetNestedInput
  }

  export type CabinetUncheckedUpdateManyWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumCabinetStatusFieldUpdateOperationsInput | $Enums.CabinetStatus
    lastHeartbeatAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompartmentCreateManyCabinetInput = {
    id?: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    lockMcpDeviceId?: string | null
    sensorMcpDeviceId?: string | null
    status?: $Enums.CompartmentAvailability
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type McpDeviceCreateManyCabinetInput = {
    id?: string
    bus?: number
    address?: number
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LockerLogCreateManyCabinetInput = {
    id?: string
    compartmentId?: string | null
    rentalId?: string | null
    action: $Enums.LockerAction
    attemptCount?: number
    success: boolean
    ipAddress?: string | null
    deviceInfo?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type CompartmentUpdateWithoutCabinetInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lockMcpDevice?: McpDeviceUpdateOneWithoutLockCompartmentsNestedInput
    sensorMcpDevice?: McpDeviceUpdateOneWithoutSensorCompartmentsNestedInput
    rentals?: RentalUpdateManyWithoutCompartmentNestedInput
    logs?: LockerLogUpdateManyWithoutCompartmentNestedInput
    realtimeStatus?: CompartmentStatusUpdateOneWithoutCompartmentNestedInput
  }

  export type CompartmentUncheckedUpdateWithoutCabinetInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    lockMcpDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    sensorMcpDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUncheckedUpdateManyWithoutCompartmentNestedInput
    logs?: LockerLogUncheckedUpdateManyWithoutCompartmentNestedInput
    realtimeStatus?: CompartmentStatusUncheckedUpdateOneWithoutCompartmentNestedInput
  }

  export type CompartmentUncheckedUpdateManyWithoutCabinetInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    lockMcpDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    sensorMcpDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type McpDeviceUpdateWithoutCabinetInput = {
    id?: StringFieldUpdateOperationsInput | string
    bus?: IntFieldUpdateOperationsInput | number
    address?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lockCompartments?: CompartmentUpdateManyWithoutLockMcpDeviceNestedInput
    sensorCompartments?: CompartmentUpdateManyWithoutSensorMcpDeviceNestedInput
  }

  export type McpDeviceUncheckedUpdateWithoutCabinetInput = {
    id?: StringFieldUpdateOperationsInput | string
    bus?: IntFieldUpdateOperationsInput | number
    address?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lockCompartments?: CompartmentUncheckedUpdateManyWithoutLockMcpDeviceNestedInput
    sensorCompartments?: CompartmentUncheckedUpdateManyWithoutSensorMcpDeviceNestedInput
  }

  export type McpDeviceUncheckedUpdateManyWithoutCabinetInput = {
    id?: StringFieldUpdateOperationsInput | string
    bus?: IntFieldUpdateOperationsInput | number
    address?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LockerLogUpdateWithoutCabinetInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumLockerActionFieldUpdateOperationsInput | $Enums.LockerAction
    attemptCount?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    compartment?: CompartmentUpdateOneWithoutLogsNestedInput
    rental?: RentalUpdateOneWithoutLogsNestedInput
  }

  export type LockerLogUncheckedUpdateWithoutCabinetInput = {
    id?: StringFieldUpdateOperationsInput | string
    compartmentId?: NullableStringFieldUpdateOperationsInput | string | null
    rentalId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: EnumLockerActionFieldUpdateOperationsInput | $Enums.LockerAction
    attemptCount?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LockerLogUncheckedUpdateManyWithoutCabinetInput = {
    id?: StringFieldUpdateOperationsInput | string
    compartmentId?: NullableStringFieldUpdateOperationsInput | string | null
    rentalId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: EnumLockerActionFieldUpdateOperationsInput | $Enums.LockerAction
    attemptCount?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompartmentCreateManyLockMcpDeviceInput = {
    id?: string
    cabinetId: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    sensorMcpDeviceId?: string | null
    status?: $Enums.CompartmentAvailability
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CompartmentCreateManySensorMcpDeviceInput = {
    id?: string
    cabinetId: string
    name: string
    size: $Enums.CompartmentSize
    mcp23017PinLock: number
    mcp23017PinSensor: number
    lockMcpDeviceId?: string | null
    status?: $Enums.CompartmentAvailability
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CompartmentUpdateWithoutLockMcpDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cabinet?: CabinetUpdateOneRequiredWithoutCompartmentsNestedInput
    sensorMcpDevice?: McpDeviceUpdateOneWithoutSensorCompartmentsNestedInput
    rentals?: RentalUpdateManyWithoutCompartmentNestedInput
    logs?: LockerLogUpdateManyWithoutCompartmentNestedInput
    realtimeStatus?: CompartmentStatusUpdateOneWithoutCompartmentNestedInput
  }

  export type CompartmentUncheckedUpdateWithoutLockMcpDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    sensorMcpDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUncheckedUpdateManyWithoutCompartmentNestedInput
    logs?: LockerLogUncheckedUpdateManyWithoutCompartmentNestedInput
    realtimeStatus?: CompartmentStatusUncheckedUpdateOneWithoutCompartmentNestedInput
  }

  export type CompartmentUncheckedUpdateManyWithoutLockMcpDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    sensorMcpDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompartmentUpdateWithoutSensorMcpDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cabinet?: CabinetUpdateOneRequiredWithoutCompartmentsNestedInput
    lockMcpDevice?: McpDeviceUpdateOneWithoutLockCompartmentsNestedInput
    rentals?: RentalUpdateManyWithoutCompartmentNestedInput
    logs?: LockerLogUpdateManyWithoutCompartmentNestedInput
    realtimeStatus?: CompartmentStatusUpdateOneWithoutCompartmentNestedInput
  }

  export type CompartmentUncheckedUpdateWithoutSensorMcpDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    lockMcpDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUncheckedUpdateManyWithoutCompartmentNestedInput
    logs?: LockerLogUncheckedUpdateManyWithoutCompartmentNestedInput
    realtimeStatus?: CompartmentStatusUncheckedUpdateOneWithoutCompartmentNestedInput
  }

  export type CompartmentUncheckedUpdateManyWithoutSensorMcpDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: EnumCompartmentSizeFieldUpdateOperationsInput | $Enums.CompartmentSize
    mcp23017PinLock?: IntFieldUpdateOperationsInput | number
    mcp23017PinSensor?: IntFieldUpdateOperationsInput | number
    lockMcpDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCompartmentAvailabilityFieldUpdateOperationsInput | $Enums.CompartmentAvailability
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RentalCreateManyCompartmentInput = {
    id?: string
    userId?: string | null
    pricePlanId: string
    code: string
    codeHash: string
    qrToken: string
    openCount?: number
    maxOpens: number
    expiresAt: Date | string
    paymentStatus?: $Enums.PaymentStatus
    paymentMethod?: $Enums.PaymentMethod
    paidAt?: Date | string | null
    status?: $Enums.RentalStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LockerLogCreateManyCompartmentInput = {
    id?: string
    cabinetId?: string | null
    rentalId?: string | null
    action: $Enums.LockerAction
    attemptCount?: number
    success: boolean
    ipAddress?: string | null
    deviceInfo?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type RentalUpdateWithoutCompartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    qrToken?: StringFieldUpdateOperationsInput | string
    openCount?: IntFieldUpdateOperationsInput | number
    maxOpens?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRentalStatusFieldUpdateOperationsInput | $Enums.RentalStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutRentalsNestedInput
    pricePlan?: PricePlanUpdateOneRequiredWithoutRentalsNestedInput
    logs?: LockerLogUpdateManyWithoutRentalNestedInput
  }

  export type RentalUncheckedUpdateWithoutCompartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    pricePlanId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    qrToken?: StringFieldUpdateOperationsInput | string
    openCount?: IntFieldUpdateOperationsInput | number
    maxOpens?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRentalStatusFieldUpdateOperationsInput | $Enums.RentalStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    logs?: LockerLogUncheckedUpdateManyWithoutRentalNestedInput
  }

  export type RentalUncheckedUpdateManyWithoutCompartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    pricePlanId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    qrToken?: StringFieldUpdateOperationsInput | string
    openCount?: IntFieldUpdateOperationsInput | number
    maxOpens?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRentalStatusFieldUpdateOperationsInput | $Enums.RentalStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LockerLogUpdateWithoutCompartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumLockerActionFieldUpdateOperationsInput | $Enums.LockerAction
    attemptCount?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cabinet?: CabinetUpdateOneWithoutLogsNestedInput
    rental?: RentalUpdateOneWithoutLogsNestedInput
  }

  export type LockerLogUncheckedUpdateWithoutCompartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: NullableStringFieldUpdateOperationsInput | string | null
    rentalId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: EnumLockerActionFieldUpdateOperationsInput | $Enums.LockerAction
    attemptCount?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LockerLogUncheckedUpdateManyWithoutCompartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: NullableStringFieldUpdateOperationsInput | string | null
    rentalId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: EnumLockerActionFieldUpdateOperationsInput | $Enums.LockerAction
    attemptCount?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RentalCreateManyPricePlanInput = {
    id?: string
    userId?: string | null
    compartmentId: string
    code: string
    codeHash: string
    qrToken: string
    openCount?: number
    maxOpens: number
    expiresAt: Date | string
    paymentStatus?: $Enums.PaymentStatus
    paymentMethod?: $Enums.PaymentMethod
    paidAt?: Date | string | null
    status?: $Enums.RentalStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RentalUpdateWithoutPricePlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    qrToken?: StringFieldUpdateOperationsInput | string
    openCount?: IntFieldUpdateOperationsInput | number
    maxOpens?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRentalStatusFieldUpdateOperationsInput | $Enums.RentalStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutRentalsNestedInput
    compartment?: CompartmentUpdateOneRequiredWithoutRentalsNestedInput
    logs?: LockerLogUpdateManyWithoutRentalNestedInput
  }

  export type RentalUncheckedUpdateWithoutPricePlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    compartmentId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    qrToken?: StringFieldUpdateOperationsInput | string
    openCount?: IntFieldUpdateOperationsInput | number
    maxOpens?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRentalStatusFieldUpdateOperationsInput | $Enums.RentalStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    logs?: LockerLogUncheckedUpdateManyWithoutRentalNestedInput
  }

  export type RentalUncheckedUpdateManyWithoutPricePlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    compartmentId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    qrToken?: StringFieldUpdateOperationsInput | string
    openCount?: IntFieldUpdateOperationsInput | number
    maxOpens?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumRentalStatusFieldUpdateOperationsInput | $Enums.RentalStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LockerLogCreateManyRentalInput = {
    id?: string
    cabinetId?: string | null
    compartmentId?: string | null
    action: $Enums.LockerAction
    attemptCount?: number
    success: boolean
    ipAddress?: string | null
    deviceInfo?: string | null
    note?: string | null
    createdAt?: Date | string
  }

  export type LockerLogUpdateWithoutRentalInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumLockerActionFieldUpdateOperationsInput | $Enums.LockerAction
    attemptCount?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cabinet?: CabinetUpdateOneWithoutLogsNestedInput
    compartment?: CompartmentUpdateOneWithoutLogsNestedInput
  }

  export type LockerLogUncheckedUpdateWithoutRentalInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: NullableStringFieldUpdateOperationsInput | string | null
    compartmentId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: EnumLockerActionFieldUpdateOperationsInput | $Enums.LockerAction
    attemptCount?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LockerLogUncheckedUpdateManyWithoutRentalInput = {
    id?: StringFieldUpdateOperationsInput | string
    cabinetId?: NullableStringFieldUpdateOperationsInput | string | null
    compartmentId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: EnumLockerActionFieldUpdateOperationsInput | $Enums.LockerAction
    attemptCount?: IntFieldUpdateOperationsInput | number
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LocationCountOutputTypeDefaultArgs instead
     */
    export type LocationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LocationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CabinetCountOutputTypeDefaultArgs instead
     */
    export type CabinetCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CabinetCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use McpDeviceCountOutputTypeDefaultArgs instead
     */
    export type McpDeviceCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = McpDeviceCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CompartmentCountOutputTypeDefaultArgs instead
     */
    export type CompartmentCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CompartmentCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PricePlanCountOutputTypeDefaultArgs instead
     */
    export type PricePlanCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PricePlanCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RentalCountOutputTypeDefaultArgs instead
     */
    export type RentalCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RentalCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AdminDefaultArgs instead
     */
    export type AdminArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AdminDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LocationDefaultArgs instead
     */
    export type LocationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LocationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CabinetDefaultArgs instead
     */
    export type CabinetArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CabinetDefaultArgs<ExtArgs>
    /**
     * @deprecated Use McpDeviceDefaultArgs instead
     */
    export type McpDeviceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = McpDeviceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CompartmentDefaultArgs instead
     */
    export type CompartmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CompartmentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CompartmentStatusDefaultArgs instead
     */
    export type CompartmentStatusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CompartmentStatusDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PricePlanDefaultArgs instead
     */
    export type PricePlanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PricePlanDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RentalDefaultArgs instead
     */
    export type RentalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RentalDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LockerLogDefaultArgs instead
     */
    export type LockerLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LockerLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NotificationDefaultArgs instead
     */
    export type NotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NotificationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserSessionDefaultArgs instead
     */
    export type UserSessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserSessionDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}