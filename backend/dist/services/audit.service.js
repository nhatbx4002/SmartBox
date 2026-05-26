"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLog = createAuditLog;
exports.listAuditLogs = listAuditLogs;
const prisma_1 = require("../lib/prisma");
async function createAuditLog(input) {
    return prisma_1.prisma.auditLog.create({
        data: {
            adminId: input.adminId,
            action: input.action,
            resource: input.resource,
            resourceId: input.resourceId,
            details: input.details,
            ipAddress: input.ipAddress,
        },
    });
}
async function listAuditLogs(filters) {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
    const where = {
        ...(filters.adminId ? { adminId: filters.adminId } : {}),
        ...(filters.action ? { action: filters.action } : {}),
        ...(filters.resource ? { resource: filters.resource } : {}),
        ...buildCreatedAtFilter(filters.startDate, filters.endDate),
    };
    const [total, items] = await Promise.all([
        prisma_1.prisma.auditLog.count({ where }),
        prisma_1.prisma.auditLog.findMany({
            where,
            include: { admin: { select: { id: true, email: true, name: true, role: true } } },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
    ]);
    return { items, page, limit, total };
}
function buildCreatedAtFilter(startDate, endDate) {
    if (!startDate && !endDate)
        return {};
    return {
        createdAt: {
            ...(startDate ? { gte: new Date(startDate) } : {}),
            ...(endDate ? { lte: new Date(endDate) } : {}),
        },
    };
}
//# sourceMappingURL=audit.service.js.map