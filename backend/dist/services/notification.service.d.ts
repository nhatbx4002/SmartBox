import { NotificationType, Prisma } from '../generated/prisma';
export declare function createNotification(input: {
    userId?: string | null;
    type: NotificationType;
    title: string;
    body: string;
    data?: Prisma.InputJsonValue;
}): Promise<{
    id: string;
    createdAt: Date;
    userId: string | null;
    data: Prisma.JsonValue | null;
    type: import("../generated/prisma").$Enums.NotificationType;
    title: string;
    body: string;
    isRead: boolean;
    sentAt: Date;
}>;
export declare function listNotifications(filters: {
    userId?: string;
    isRead?: boolean;
}): Promise<{
    id: string;
    createdAt: Date;
    userId: string | null;
    data: Prisma.JsonValue | null;
    type: import("../generated/prisma").$Enums.NotificationType;
    title: string;
    body: string;
    isRead: boolean;
    sentAt: Date;
}[]>;
export declare function markAllNotificationsRead(): Promise<{
    ok: boolean;
    count: number;
}>;
export declare function sendRentalExpired(rentalId: string): Promise<void>;
export declare function sendCabinetOffline(cabinetId: string): Promise<void>;
//# sourceMappingURL=notification.service.d.ts.map