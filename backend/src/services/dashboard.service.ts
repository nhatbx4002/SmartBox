import { CabinetStatus, CompartmentAvailability, PaymentStatus, RentalStatus } from '../generated/prisma';
import { prisma } from '../lib/prisma';

const DAY_MS = 24 * 60 * 60 * 1000;

export async function getDashboardStats() {
  const todayStart = startOfDay(new Date());
  const sevenDayStart = new Date(todayStart.getTime() - 6 * DAY_MS);

  const [
    totalCabinets,
    onlineCabinets,
    totalCompartments,
    availableCompartments,
    activeRentals,
    rentalsByStatusRaw,
    paidRentals,
  ] = await Promise.all([
    prisma.cabinet.count(),
    prisma.cabinet.count({ where: { status: CabinetStatus.ACTIVE } }),
    prisma.compartment.count(),
    prisma.compartment.count({ where: { status: CompartmentAvailability.AVAILABLE } }),
    prisma.rental.count({ where: { status: RentalStatus.ACTIVE } }),
    prisma.rental.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    prisma.rental.findMany({
      where: {
        paymentStatus: PaymentStatus.PAID,
        OR: [
          { paidAt: { gte: sevenDayStart } },
          { paidAt: null, createdAt: { gte: sevenDayStart } },
        ],
      },
      select: {
        paidAt: true,
        createdAt: true,
        pricePlan: { select: { price: true } },
      },
    }),
  ]);

  const revenueByDay = buildRevenueByDay(sevenDayStart, paidRentals);
  const todayKey = formatDateKey(todayStart);
  const todayRevenue = revenueByDay.find((item) => item.date === todayKey)?.revenue ?? 0;
  const occupiedCompartments = totalCompartments - availableCompartments;

  return {
    totalCabinets,
    onlineCabinets,
    totalCompartments,
    availableCompartments,
    activeRentals,
    todayRevenue,
    occupancyRate: totalCompartments > 0 ? Number(((occupiedCompartments / totalCompartments) * 100).toFixed(1)) : 0,
    revenueByDay,
    rentalsByStatus: rentalsByStatusRaw.map((item) => ({ status: item.status, count: item._count._all })),
  };
}

function buildRevenueByDay(
  sevenDayStart: Date,
  paidRentals: Array<{ paidAt: Date | null; createdAt: Date; pricePlan: { price: number } }>,
) {
  const revenueMap = new Map<string, number>();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sevenDayStart.getTime() + index * DAY_MS);
    const key = formatDateKey(date);
    revenueMap.set(key, 0);
    return key;
  });

  for (const rental of paidRentals) {
    const date = rental.paidAt ?? rental.createdAt;
    const key = formatDateKey(date);
    if (revenueMap.has(key)) {
      revenueMap.set(key, (revenueMap.get(key) ?? 0) + rental.pricePlan.price);
    }
  }

  return days.map((date) => ({ date, revenue: revenueMap.get(date) ?? 0 }));
}

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
