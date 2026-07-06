import cron from 'node-cron';
import { RentalStatus, CompartmentStatus } from '../generated/prisma';
import { prisma } from '../lib/prisma';
import { emitCompartmentStatus } from '../lib/socket';

/**
 * Quét rental ACTIVE đã hết hạn (expiresAt < now) → chuyển EXPIRED + giải phóng compartment.
 *
 * Chạy mỗi phút.
 */
export async function checkExpiredRentals(): Promise<void> {
    const expired = await prisma.rental.findMany({
        where: {
            status: RentalStatus.ACTIVE,
            expiresAt: { lt: new Date() },
        },
        select: { id: true, compartmentId: true },
    });

    for (const rental of expired) {
        await prisma.$transaction([
            prisma.rental.update({
                where: { id: rental.id },
                data: { status: RentalStatus.EXPIRED },
            }),
            prisma.compartment.update({
                where: { id: rental.compartmentId },
                data: { status: CompartmentStatus.AVAILABLE },
            }),
        ]);

        const compartment = await prisma.compartment.findUnique({
            where: { id: rental.compartmentId },
            select: { cabinetId: true },
        });
        if (compartment) {
            emitCompartmentStatus(compartment.cabinetId, rental.compartmentId, {
                status: CompartmentStatus.AVAILABLE,
            });
        }
    }

    if (expired.length > 0) {
        console.log(`[expiryChecker] expired ${expired.length} rental(s)`);
    }
}

export function startExpiryChecker(): void {
    cron.schedule('* * * * *', () => {
        checkExpiredRentals().catch((error) => {
            console.error('[expiryChecker] failed:', error);
        });
    });
}
