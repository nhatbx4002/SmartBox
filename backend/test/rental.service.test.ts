import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CabinetStatus,
  CompartmentAvailability,
  CompartmentSize,
  PaymentMethod,
} from '../src/generated/prisma';
import { prisma } from '../src/lib/prisma';
import { createRental } from '../src/services/rental.service';

test('createRental filters available compartments by cabinetId when provided', async (t) => {
  process.env.QR_SECRET = 'test-secret';
  process.env.PAYMENT_MOCK_ENABLED = 'true';

  const compartmentFindCalls: unknown[] = [];
  const rental = {
    id: 'rental-1',
    userId: 'user-1',
    compartmentId: 'compartment-a1',
    code: '123456',
    qrToken: 'pending-token',
    expiresAt: new Date(Date.now() + 86_400_000),
    compartment: {
      id: 'compartment-a1',
      name: 'A1',
      cabinetId: 'cabinet-a',
      size: CompartmentSize.SMALL,
      cabinet: { id: 'cabinet-a', name: 'Tu A', status: CabinetStatus.ACTIVE },
    },
  };

  const originals = {
    pricePlanFindFirst: prisma.pricePlan.findFirst,
    cabinetFindFirst: prisma.cabinet.findFirst,
    compartmentFindFirst: prisma.compartment.findFirst,
    compartmentFindMany: prisma.compartment.findMany,
    rentalFindUnique: prisma.rental.findUnique,
    rentalUpdate: prisma.rental.update,
    notificationCreate: prisma.notification.create,
    lockerLogCreate: prisma.lockerLog.create,
    transaction: prisma.$transaction,
  };
  t.after(() => {
    (prisma.pricePlan.findFirst as unknown) = originals.pricePlanFindFirst;
    (prisma.cabinet.findFirst as unknown) = originals.cabinetFindFirst;
    (prisma.compartment.findFirst as unknown) = originals.compartmentFindFirst;
    (prisma.compartment.findMany as unknown) = originals.compartmentFindMany;
    (prisma.rental.findUnique as unknown) = originals.rentalFindUnique;
    (prisma.rental.update as unknown) = originals.rentalUpdate;
    (prisma.notification.create as unknown) = originals.notificationCreate;
    (prisma.lockerLog.create as unknown) = originals.lockerLogCreate;
    (prisma.$transaction as unknown) = originals.transaction;
  });

  (prisma.pricePlan.findFirst as unknown) = async () => ({
    id: 'small-1-day',
    size: CompartmentSize.SMALL,
    isActive: true,
    durationDays: 1,
    maxOpens: 2,
  }) as never;
  (prisma.cabinet.findFirst as unknown) = async () =>
    ({ id: 'cabinet-a', name: 'Tu A', status: CabinetStatus.ACTIVE }) as never;
  (prisma.compartment.findFirst as unknown) = async (args: unknown) => {
    compartmentFindCalls.push(args);
    return rental.compartment as never;
  };
  (prisma.compartment.findMany as unknown) = async () => [
    {
      id: 'compartment-a1',
      name: 'A1',
      size: CompartmentSize.SMALL,
      status: CompartmentAvailability.AVAILABLE,
    },
  ];
  (prisma.rental.findUnique as unknown) = async () => null;
  (prisma.rental.update as unknown) = async () => rental as never;
  (prisma.notification.create as unknown) = async () => ({ id: 'notification-1' }) as never;
  (prisma.lockerLog.create as unknown) = async () => ({ id: 'locker-log-1' }) as never;
  (prisma.$transaction as unknown) = (async (callback: (tx: unknown) => Promise<unknown>) =>
    callback({
      user: { upsert: async () => ({ id: 'user-1', phone: '0909123456' }) },
      rental: { create: async () => rental },
      compartment: { update: async () => ({ id: 'compartment-a1' }) },
      lockerLog: { create: async () => ({ id: 'locker-log-transaction' }) },
    })) as never;

  await createRental({
    phone: '0909123456',
    size: CompartmentSize.SMALL,
    planId: 'small-1-day',
    paymentMethod: PaymentMethod.CASH,
    cabinetId: 'cabinet-a',
  } as never);

  const availabilityQuery = compartmentFindCalls[0] as {
    where?: { cabinet?: { id?: string } };
  };
  assert.equal(availabilityQuery.where?.cabinet?.id, 'cabinet-a');
});
