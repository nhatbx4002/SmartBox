export declare function getDashboardStats(): Promise<{
    totalCabinets: number;
    onlineCabinets: number;
    totalCompartments: number;
    availableCompartments: number;
    activeRentals: number;
    todayRevenue: number;
    occupancyRate: number;
    revenueByDay: {
        date: string;
        revenue: number;
    }[];
    rentalsByStatus: {
        status: import("../generated/prisma").$Enums.RentalStatus;
        count: number;
    }[];
}>;
//# sourceMappingURL=dashboard.service.d.ts.map