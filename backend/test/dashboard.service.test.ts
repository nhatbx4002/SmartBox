import assert from 'node:assert/strict';
import test from 'node:test';
import { prisma } from '../src/lib/prisma';
import { getDashboardStats } from '../src/services/dashboard.service';

test('getDashboardStats returns frontend dashboard shape with paid revenue aggregates', async (t) => {
  const originals = {
    cabinetCount: prisma.cabinet.count,
    compartmentCount: prisma.compartment.count,
    rentalCount: prisma.rental.count,
    rentalGroupBy: prisma.rental.groupBy,
    rentalFindMany: prisma.rental.findMany,
  };
  t.after(() => {
    (prisma.cabinet.count as unknown) = originals.cabinetCount;
    (prisma.compartment.count as unknown) = originals.compartmentCount;
    (prisma.rental.count as unknown) = originals.rentalCount;
    (prisma.rental.groupBy as unknown) = originals.rentalGroupBy;
    (prisma.rental.findMany as unknown) = originals.rentalFindMany;
  });

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  (prisma.cabinet.count as unknown) = async (args?: { where?: { status?: string } }) =>
    args?.where?.status === 'ACTIVE' ? 2 : 3;
  (prisma.compartment.count as unknown) = async (args?: { where?: { status?: string } }) =>
    args?.where?.status === 'AVAILABLE' ? 7 : 10;
  (prisma.rental.count as unknown) = async (args?: { where?: { status?: string } }) =>
    args?.where?.status === 'ACTIVE' ? 4 : 0;
  (prisma.rental.groupBy as unknown) = async () => [
    { status: 'ACTIVE', _count: { _all: 4 } },
    { status: 'COMPLETED', _count: { _all: 6 } },
  ];
  (prisma.rental.findMany as unknown) = async () => [
    { paidAt: today, createdAt: yesterday, pricePlan: { price: 10_000 } },
    { paidAt: null, createdAt: today, pricePlan: { price: 20_000 } },
  ];

  const stats = await getDashboardStats();

  assert.equal(stats.totalCabinets, 3);
  assert.equal(stats.onlineCabinets, 2);
  assert.equal(stats.totalCompartments, 10);
  assert.equal(stats.availableCompartments, 7);
  assert.equal(stats.activeRentals, 4);
  assert.equal(stats.todayRevenue, 30_000);
  assert.equal(stats.occupancyRate, 30);
  assert.equal(stats.revenueByDay.length, 7);
  assert.equal(stats.revenueByDay.at(-1)?.revenue, 30_000);
  assert.deepEqual(stats.rentalsByStatus, [
    { status: 'ACTIVE', count: 4 },
    { status: 'COMPLETED', count: 6 },
  ]);
});
