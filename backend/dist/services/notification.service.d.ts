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
    type: import("../generated/prisma").$Enums.NotificationType;
    data: Prisma.JsonValue | null;
    title: string;
    body: string;
    isRead: boolean;
    sentAt: Date;
}>;
export declare function sendRentalExpired(rentalId: string): Promise<void>;
export declare function sendCabinetOffline(cabinetId: string): Promise<void>;
//# sourceMappingURL=notification.service.d.ts.map