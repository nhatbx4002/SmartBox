import assert from 'node:assert/strict';
import test from 'node:test';
import { prisma } from '../src/lib/prisma';
import { listNotifications, markAllNotificationsRead } from '../src/services/notification.service';

test('listNotifications filters by userId and isRead', async (t) => {
  const original = prisma.notification.findMany;
  const calls: unknown[] = [];
  t.after(() => {
    (prisma.notification.findMany as unknown) = original;
  });

  (prisma.notification.findMany as unknown) = async (args: unknown) => {
    calls.push(args);
    return [];
  };

  await listNotifications({ userId: 'user-1', isRead: false });

  assert.deepEqual(calls[0], {
    where: { userId: 'user-1', isRead: false },
    orderBy: { createdAt: 'desc' },
  });
});

test('markAllNotificationsRead marks only unread notifications and returns count', async (t) => {
  const original = prisma.notification.updateMany;
  const calls: unknown[] = [];
  t.after(() => {
    (prisma.notification.updateMany as unknown) = original;
  });

  (prisma.notification.updateMany as unknown) = async (args: unknown) => {
    calls.push(args);
    return { count: 3 };
  };

  const result = await markAllNotificationsRead();

  assert.deepEqual(calls[0], {
    where: { isRead: false },
    data: { isRead: true },
  });
  assert.deepEqual(result, { ok: true, count: 3 });
});
