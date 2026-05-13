import { CabinetStatus, CompartmentSize, DoorStatus, LockStatus } from '../generated/prisma';
export declare function listCabinets(): Promise<({
    location: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../generated/prisma").$Enums.LocationStatus;
        address: string;
        latitude: number | null;
        longitude: number | null;
        googlePlaceId: string | null;
        mapImageUrl: string | null;
    };
    compartments: ({
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
    })[];
} & {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("../generated/prisma").$Enums.CabinetStatus;
    locationId: string;
    mcp23017Bus: number;
    mcp23017Address: number;
    lastHeartbeatAt: Date | null;
})[]>;
export declare function getCabinet(id: string): Promise<{
    location: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../generated/prisma").$Enums.LocationStatus;
        address: string;
        latitude: number | null;
        longitude: number | null;
        googlePlaceId: string | null;
        mapImageUrl: string | null;
    };
    compartments: ({
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
    })[];
} & {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("../generated/prisma").$Enums.CabinetStatus;
    locationId: string;
    mcp23017Bus: number;
    mcp23017Address: number;
    lastHeartbeatAt: Date | null;
}>;
export declare function createCabinet(input: {
    id?: string;
    locationId: string;
    name: string;
    mcp23017Bus?: number;
    mcp23017Address?: number;
}): Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("../generated/prisma").$Enums.CabinetStatus;
    locationId: string;
    mcp23017Bus: number;
    mcp23017Address: number;
    lastHeartbeatAt: Date | null;
}>;
export declare function updateCabinet(id: string, input: Partial<{
    locationId: string;
    name: string;
    mcp23017Bus: number;
    mcp23017Address: number;
    status: CabinetStatus;
}>): Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("../generated/prisma").$Enums.CabinetStatus;
    locationId: string;
    mcp23017Bus: number;
    mcp23017Address: number;
    lastHeartbeatAt: Date | null;
}>;
export declare function deleteCabinet(id: string): Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("../generated/prisma").$Enums.CabinetStatus;
    locationId: string;
    mcp23017Bus: number;
    mcp23017Address: number;
    lastHeartbeatAt: Date | null;
}>;
export declare function updateCompartmentStatus(compartmentId: string, lockStatus: LockStatus, doorStatus: DoorStatus): Promise<{
    id: string;
    compartmentId: string;
    lockStatus: import("../generated/prisma").$Enums.LockStatus;
    doorStatus: import("../generated/prisma").$Enums.DoorStatus;
    lastUpdatedAt: Date;
}>;
export declare function updateHeartbeat(cabinetId: string): Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("../generated/prisma").$Enums.CabinetStatus;
    locationId: string;
    mcp23017Bus: number;
    mcp23017Address: number;
    lastHeartbeatAt: Date | null;
}>;
export declare function getAvailableCompartments(size?: CompartmentSize): Promise<({
    cabinet: {
        location: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("../generated/prisma").$Enums.LocationStatus;
            address: string;
            latitude: number | null;
            longitude: number | null;
            googlePlaceId: string | null;
            mapImageUrl: string | null;
        };
    } & {
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
})[]>;
//# sourceMappingURL=cabinet.service.d.ts.map