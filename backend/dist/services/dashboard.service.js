"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = getDashboardStats;
const prisma_1 = require("../generated/prisma");
const prisma_2 = require("../lib/prisma");
const DAY_MS = 24 * 60 * 60 * 1000;
async function getDashboardStats() {
    const todayStart = startOfDay(new Date());
    const sevenDayStart = new Date(todayStart.getTime() - 6 * DAY_MS);
    const [totalCabinets, onlineCabinets, totalCompartments, availableCompartments, activeRentals, rentalsByStatusRaw, paidRentals,] = await Promise.all([
        prisma_2.prisma.cabinet.count(),
        prisma_2.prisma.cabinet.count({ where: { status: prisma_1.CabinetStatus.ACTIVE } }),
        prisma_2.prisma.compartment.count(),
        prisma_2.prisma.compartment.count({ where: { status: prisma_1.CompartmentAvailability.AVAILABLE } }),
        prisma_2.prisma.rental.count({ where: { status: prisma_1.RentalStatus.ACTIVE } }),
        prisma_2.prisma.rental.groupBy({
            by: ['status'],
            _count: { _all: true },
        }),
        prisma_2.prisma.rental.findMany({
            where: {
                paymentStatus: prisma_1.PaymentStatus.PAID,
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
function buildRevenueByDay(sevenDayStart, paidRentals) {
    const revenueMap = new Map();
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
function startOfDay(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}
function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
//# sourceMappingURL=dashboard.service.js.map