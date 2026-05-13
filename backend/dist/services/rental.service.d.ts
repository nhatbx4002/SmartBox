import { CompartmentSize, PaymentMethod } from '../generated/prisma';
export declare function createRental(input: {
    phone: string;
    size: CompartmentSize;
    planId: string;
    paymentMethod?: PaymentMethod;
    cabinetId?: string;
}): Promise<{
    rental: {
        qrToken: string;
        user: {
            id: string;
            email: string | null;
            passwordHash: string | null;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: import("../generated/prisma").$Enums.UserStatus;
            phone: string;
        } | null;
        compartment: {
            cabinet: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("../generated/prisma").$Enums.CabinetStatus;
                locationId: string;
                mcp23017Bus: number;
                mcp23017Address: number;
                lastHeartbeatAt: Date | null;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("../generated/prisma").$Enums.CompartmentAvailability;
            cabinetId: string;
            size: import("../generated/prisma").$Enums.CompartmentSize;
            mcp23017PinLock: number;
            mcp23017PinSensor: number;
        };
        pricePlan: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            maxOpens: number | null;
            size: import("../generated/prisma").$Enums.CompartmentSize;
            description: string | null;
            rentalType: import("../generated/prisma").$Enums.RentalType;
            price: number;
            durationDays: number;
            isActive: boolean;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        userId: string | null;
        compartmentId: string;
        pricePlanId: string;
        codeHash: string;
        openCount: number;
        maxOpens: number;
        expiresAt: Date;
        paymentStatus: import("../generated/prisma").$Enums.PaymentStatus;
        paymentMethod: import("../generated/prisma").$Enums.PaymentMethod;
        paidAt: Date | null;
        status: import("../generated/prisma").$Enums.RentalStatus;
    };
    code: string;
    compartment: {
        cabinet: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("../generated/prisma").$Enums.CabinetStatus;
            locationId: string;
            mcp23017Bus: number;
            mcp23017Address: number;
            lastHeartbeatAt: Date | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../generated/prisma").$Enums.CompartmentAvailability;
        cabinetId: string;
        size: import("../generated/prisma").$Enums.CompartmentSize;
        mcp23017PinLock: number;
        mcp23017PinSensor: number;
    };
}>;
export declare function getByCode(code: string): Promise<{
    user: {
        id: string;
        email: string | null;
        passwordHash: string | null;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("../generated/prisma").$Enums.UserStatus;
        phone: string;
    } | null;
    compartment: {
        cabinet: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("../generated/prisma").$Enums.CabinetStatus;
            locationId: string;
            mcp23017Bus: number;
            mcp23017Address: number;
            lastHeartbeatAt: Date | null;
        };
        realtimeStatus: {
            id: string;
            compartmentId: string;
            lockStatus: import("../generated/prisma").$Enums.LockStatus;
            doorStatus: import("../generated/prisma").$Enums.DoorStatus;
            lastUpdatedAt: Date;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../generated/prisma").$Enums.CompartmentAvailability;
        cabinetId: string;
        size: import("../generated/prisma").$Enums.CompartmentSize;
        mcp23017PinLock: number;
        mcp23017PinSensor: number;
    };
    pricePlan: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        maxOpens: number | null;
        size: import("../generated/prisma").$Enums.CompartmentSize;
        description: string | null;
        rentalType: import("../generated/prisma").$Enums.RentalType;
        price: number;
        durationDays: number;
        isActive: boolean;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    code: string;
    qrToken: string;
    userId: string | null;
    compartmentId: string;
    pricePlanId: string;
    codeHash: string;
    openCount: number;
    maxOpens: number;
    expiresAt: Date;
    paymentStatus: import("../generated/prisma").$Enums.PaymentStatus;
    paymentMethod: import("../generated/prisma").$Enums.PaymentMethod;
    paidAt: Date | null;
    status: import("../generated/prisma").$Enums.RentalStatus;
}>;
export declare function completeRental(rentalId: string): Promise<void>;
export declare function cancelRental(rentalId: string, adminId?: string): Promise<void>;
export declare function handleUnlock(rentalId: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    code: string;
    qrToken: string;
    userId: string | null;
    compartmentId: string;
    pricePlanId: string;
    codeHash: string;
    openCount: number;
    maxOpens: number;
    expiresAt: Date;
    paymentStatus: import("../generated/prisma").$Enums.PaymentStatus;
    paymentMethod: import("../generated/prisma").$Enums.PaymentMethod;
    paidAt: Date | null;
    status: import("../generated/prisma").$Enums.RentalStatus;
}>;
//# sourceMappingURL=rental.service.d.ts.map