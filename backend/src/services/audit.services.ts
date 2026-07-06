import { Prisma } from '../generated/prisma';
import { prisma } from '../lib/prisma';

export async function listAuditLogs(filters: {
    adminId?: string;
    action?: string;
    resource?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
}) {
    const page = filters.page ?? 1;
    const limit = 20;

    const where: Prisma.AuditLogWhereInput = {};
    if (filters.adminId) where.adminId = filters.adminId;
    if (filters.action) where.action = filters.action as any;
    if (filters.resource) where.resource = filters.resource;
    if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
        if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    const [total, items] = await Promise.all([
        prisma.auditLog.count({ where }),
        prisma.auditLog.findMany({
            where,
            include: { admin: { select: { id: true, email: true, name: true } } },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
    ]);

    return { items, page, limit, total, pages: Math.ceil(total / limit) };
}
