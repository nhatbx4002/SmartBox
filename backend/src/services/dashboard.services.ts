import { prisma } from '../lib/prisma';

const ONLINE_THRESHOLD_SECONDS = 30;
const REVENUE_DAYS = 7;

export async function getDashboardStats() {
    const now = new Date();
    const onlineThreshold = new Date(now.getTime() - ONLINE_THRESHOLD_SECONDS * 1000);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(todayStart.getTime() - REVENUE_DAYS * 24 * 60 * 60 * 1000);

    const [
        totalCabinets,
        onlineCabinets,
        totalCompartments,
        availableCompartments,
        activeRentals,
        todayPayments,
    ] = await Promise.all([
        prisma.cabinet.count(),
        prisma.cabinet.count({ where: { lastHeartbeatAt: { gte: onlineThreshold }, status: 'ACTIVE' as any } }),
        prisma.compartment.count({ where: { deletedAt: null } }),
        prisma.compartment.count({ where: { status: 'AVAILABLE' as any, deletedAt: null } }),
        prisma.rental.count({ where: { status: 'ACTIVE' as any } }),
        prisma.payment.findMany({
            where: { status: 'PAID' as any, paidAt: { gte: todayStart } },
            select: { amount: true },
        }),
    ]);

    const todayRevenue = todayPayments.reduce((sum, p) => sum + p.amount, 0);
    const occupancyRate = totalCompartments > 0
        ? Math.round(((totalCompartments - availableCompartments) / totalCompartments) * 100)
        : 0;

    const revenueByDayRaw = await prisma.payment.findMany({
        where: { status: 'PAID' as any, paidAt: { gte: sevenDaysAgo } },
        select: { amount: true, paidAt: true },
    });

    const revenueMap = new Map<string, number>();
    for (let i = 0; i < REVENUE_DAYS; i++) {
        const d = new Date(todayStart.getTime() - i * 24 * 60 * 60 * 1000);
        revenueMap.set(d.toISOString().slice(0, 10), 0);
    }
    for (const p of revenueByDayRaw) {
        if (!p.paidAt) continue;
        const key = p.paidAt.toISOString().slice(0, 10);
        revenueMap.set(key, (revenueMap.get(key) || 0) + p.amount);
    }
    const revenueByDay = Array.from(revenueMap.entries())
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => a.date.localeCompare(b.date));

    const rentalsByStatusRaw = await prisma.rental.groupBy({
        by: ['status'],
        _count: { status: true },
    });
    const rentalsByStatus = rentalsByStatusRaw.map((r) => ({ status: r.status, count: r._count.status }));

    return {
        totalCabinets,
        onlineCabinets,
        totalCompartments,
        availableCompartments,
        activeRentals,
        todayRevenue,
        occupancyRate,
        revenueByDay,
        rentalsByStatus,
    };
}
