import { AuditAction, Prisma } from '../generated/prisma';
export interface CreateAuditLogInput {
    adminId: string;
    action: AuditAction;
    resource: string;
    resourceId?: string;
    details?: Prisma.InputJsonValue;
    ipAddress?: string;
}
export interface AuditLogFilters {
    adminId?: string;
    action?: AuditAction;
    resource?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}
export declare function createAuditLog(input: CreateAuditLogInput): Promise<{
    id: string;
    createdAt: Date;
    action: import("../generated/prisma").$Enums.AuditAction;
    resource: string;
    resourceId: string | null;
    details: Prisma.JsonValue | null;
    ipAddress: string | null;
    adminId: string;
}>;
export declare function listAuditLogs(filters: AuditLogFilters): Promise<{
    items: ({
        admin: {
            id: string;
            email: string;
            name: string;
            role: import("../generated/prisma").$Enums.AdminRole;
        };
    } & {
        id: string;
        createdAt: Date;
        action: import("../generated/prisma").$Enums.AuditAction;
        resource: string;
        resourceId: string | null;
        details: Prisma.JsonValue | null;
        ipAddress: string | null;
        adminId: string;
    })[];
    page: number;
    limit: number;
    total: number;
}>;
//# sourceMappingURL=audit.service.d.ts.map