import assert from 'node:assert/strict';
import test from 'node:test';
import { prisma } from '../src/lib/prisma';
import { createAuditLog, listAuditLogs } from '../src/services/audit.service';

test('createAuditLog writes the expected audit payload', async (t) => {
  const auditLogClient = { create: async (_args: unknown) => ({ id: 'audit-1' }) };
  const calls: unknown[] = [];
  const prismaWithAudit = prisma as unknown as { auditLog: typeof auditLogClient };
  const original = prismaWithAudit.auditLog;
  t.after(() => {
    prismaWithAudit.auditLog = original;
  });

  prismaWithAudit.auditLog = {
    create: async (args: unknown) => {
      calls.push(args);
      return { id: 'audit-1' };
    },
  };

  await createAuditLog({
    adminId: 'admin-1',
    action: 'CREATE_LOCATION',
    resource: 'Location',
    resourceId: 'loc-1',
    details: { name: 'Campus' },
    ipAddress: '127.0.0.1',
  });

  assert.deepEqual(calls[0], {
    data: {
      adminId: 'admin-1',
      action: 'CREATE_LOCATION',
      resource: 'Location',
      resourceId: 'loc-1',
      details: { name: 'Campus' },
      ipAddress: '127.0.0.1',
    },
  });
});

test('listAuditLogs applies filters and pagination', async (t) => {
  const auditLogClient = {
    findMany: async (_args: unknown): Promise<Array<{ id: string }>> => [],
    count: async (_args: unknown) => 0,
  };
  const calls: unknown[] = [];
  const prismaWithAudit = prisma as unknown as { auditLog: typeof auditLogClient };
  const original = prismaWithAudit.auditLog;
  t.after(() => {
    prismaWithAudit.auditLog = original;
  });

  prismaWithAudit.auditLog = {
    findMany: async (args: unknown) => {
      calls.push({ findMany: args });
      return [{ id: 'audit-1' }];
    },
    count: async (args: unknown) => {
      calls.push({ count: args });
      return 11;
    },
  };

  const result = await listAuditLogs({
    adminId: 'admin-1',
    action: 'CREATE_LOCATION',
    resource: 'Location',
    startDate: '2026-05-01T00:00:00.000Z',
    endDate: '2026-05-18T00:00:00.000Z',
    page: 2,
    limit: 5,
  });

  assert.deepEqual(result, { items: [{ id: 'audit-1' }], page: 2, limit: 5, total: 11 });
  assert.deepEqual(calls[0], {
    count: {
      where: {
        adminId: 'admin-1',
        action: 'CREATE_LOCATION',
        resource: 'Location',
        createdAt: {
          gte: new Date('2026-05-01T00:00:00.000Z'),
          lte: new Date('2026-05-18T00:00:00.000Z'),
        },
      },
    },
  });
  assert.deepEqual(calls[1], {
    findMany: {
      where: {
        adminId: 'admin-1',
        action: 'CREATE_LOCATION',
        resource: 'Location',
        createdAt: {
          gte: new Date('2026-05-01T00:00:00.000Z'),
          lte: new Date('2026-05-18T00:00:00.000Z'),
        },
      },
      include: { admin: { select: { id: true, email: true, name: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      skip: 5,
      take: 5,
    },
  });
});
