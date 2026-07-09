import { LockerAction, RentalStatus, CompartmentStatus } from '../generated/prisma';
import { NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { updateHeartbeat } from './cabinet.services';
export { markOnline, markOffline } from './cabinet.services';
import { emitCompartmentStatus } from '../lib/socket';

export async function heartbeat(cabinetId: string) {
    const cabinet = await updateHeartbeat(cabinetId);
    if (!cabinet) throw new NotFoundError('Cabinet not found!');
    return cabinet;
}

export async function recordLockerEvent(data: {
    cabinetId: string;
    compartmentId?: string;
    rentalId?: string;
    event?: string;
    lockStatus?: string;
    doorStatus?: string;
}) {
    const action = mapEventToAction(data.event);

    await prisma.lockerLog.create({
        data: {
            cabinetId: data.cabinetId,
            compartmentId: data.compartmentId,
            rentalId: data.rentalId,
            action,
            success: true,
            note: data.event,
        },
    });

    if (data.event === 'opened' && data.rentalId) {
        const rental = await prisma.rental.findUnique({
            where: { id: data.rentalId },
            select: { id: true, compartmentId: true, openCount: true, maxOpens: true, status: true },
        });

        if (rental && rental.status === RentalStatus.ACTIVE) {
            const nextOpenCount = rental.openCount + 1;
            const shouldComplete = nextOpenCount >= rental.maxOpens;

            await prisma.$transaction(async (tx) => {
                await tx.rental.update({
                    where: { id: rental.id },
                    data: {
                        openCount: { increment: 1 },
                        ...(shouldComplete ? { status: RentalStatus.COMPLETED } : {}),
                    },
                });

                if (shouldComplete) {
                    await tx.compartment.update({
                        where: { id: rental.compartmentId },
                        data: { status: CompartmentStatus.AVAILABLE },
                    });
                }
            });
        }
    }

    if (data.compartmentId) {
        emitCompartmentStatus(data.cabinetId, data.compartmentId, {
            lockStatus: data.lockStatus,
            doorStatus: data.doorStatus,
            event: data.event,
        });
    }

    return { ok: true };
}

function mapEventToAction(event?: string): LockerAction {
    switch (event) {
        case 'opened':
            return LockerAction.OPENED;
        case 'closed':
            return LockerAction.CLOSED;
        default:
            return LockerAction.HEARTBEAT;
    }
}

export async function getSystemStatus() {
    const [cabinets, activeRentals, availableCompartments] = await Promise.all([
        prisma.cabinet.findMany({
            select: { id: true, name: true, status: true, lastHeartbeatAt: true },
        }),
        prisma.rental.count({ where: { status: RentalStatus.ACTIVE } }),
        prisma.compartment.count({ where: { status: CompartmentStatus.AVAILABLE, deletedAt: null } }),
    ]);

    return {
        cabinets,
        activeRentals,
        availableCompartments,
        timestamp: new Date().toISOString(),
    };
}
