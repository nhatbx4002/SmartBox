import { Prisma } from '../generated/prisma';
import { prisma } from '../lib/prisma';

export async function listAuditLogs(filters: {
    adminId?: string;
    action?: string;
    resource?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    q?: string;
}) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));

    const where: Prisma.AuditLogWhereInput = {};
    if (filters.adminId) where.adminId = filters.adminId;
    if (filters.action) where.action = filters.action as any;
    if (filters.resource) where.resource = filters.resource;
    if (filters.q) {
        where.OR = [
            { resource: { contains: filters.q, mode: 'insensitive' } },
            { admin: { name: { contains: filters.q, mode: 'insensitive' } } },
            { admin: { email: { contains: filters.q, mode: 'insensitive' } } },
        ];
    }
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
