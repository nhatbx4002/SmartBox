import { AuditAction, Prisma } from '../generated/prisma';
import { prisma } from '../lib/prisma';

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

export async function createAuditLog(input: CreateAuditLogInput) {
  return prisma.auditLog.create({
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

export async function listAuditLogs(filters: AuditLogFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
  const where: Prisma.AuditLogWhereInput = {
    ...(filters.adminId ? { adminId: filters.adminId } : {}),
    ...(filters.action ? { action: filters.action } : {}),
    ...(filters.resource ? { resource: filters.resource } : {}),
    ...buildCreatedAtFilter(filters.startDate, filters.endDate),
  };

  const [total, items] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      include: { admin: { select: { id: true, email: true, name: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return { items, page, limit, total };
}

function buildCreatedAtFilter(startDate?: string, endDate?: string) {
  if (!startDate && !endDate) return {};

  return {
    createdAt: {
      ...(startDate ? { gte: new Date(startDate) } : {}),
      ...(endDate ? { lte: new Date(endDate) } : {}),
    },
  };
}
