import { AuditAction } from '../generated/prisma';
import { prisma } from '../lib/prisma';

export async function auditFromRequest(
    req: { admin?: { id: string }; ip?: string },
    action: AuditAction,
    resource: string,
    resourceId: string,
    details: object,
) {
    if (!req.admin) return;
    return prisma.auditLog.create({
        data: {
            adminId: req.admin.id,
            action,
            resource,
            resourceId,
            details: details as object,
            ipAddress: req.ip,
        },
    });
}