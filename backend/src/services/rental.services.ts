import crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import {
    CompartmentSize,
    CompartmentStatus,
    LockerAction,
    Prisma,
    RentalStatus,
} from '../generated/prisma';
import { BadRequestError, NotFoundError , UnauthorizedError} from '../lib/errors';
import { prisma } from '../lib/prisma';
import { signQrToken, verifyQrToken } from '../lib/qr';
import { publishMqtt } from '../lib/mqtt';

function generateRentalCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function createRentalRecord(
    userId: string,
    compartmentId: string,
    planId: string,
    initialStatus: RentalStatus,
    compartmentStatus: CompartmentStatus,
) {
    const plan = await prisma.pricePlan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundError('Price plan not found!');
    if (!plan.isActive) throw new BadRequestError('Price plan is not active!');

    const code = generateRentalCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000);

    return prisma.$transaction(async (tx) => {
        const claim = await tx.compartment.updateMany({
            where: {
                id: compartmentId,
                status: CompartmentStatus.AVAILABLE,
            },
            data: {
                status: compartmentStatus,
            },
        });

        if (claim.count !== 1) {
            throw new BadRequestError('Compartment is no longer available!');
        }

        const rental = await tx.rental.create({
            data: {
                userId,
                compartmentId,
                pricePlanId: planId,
                code,
                codeHash,
                qrToken: crypto.randomUUID(),
                maxOpens: plan.maxOpens ?? 999,
                expiresAt,
                status: initialStatus,
            },
        });

        const updatedRental = await tx.rental.update({
            where: { id: rental.id },
            data: {
                qrToken: signQrToken(rental.id),
            },
        });

        const compartment = await tx.compartment.findUnique({
            where: { id: compartmentId },
        });

        if (!compartment) throw new NotFoundError('Compartment not found!');

        return {
            rental: updatedRental,
            code,
            compartment,
        };
    });
}

export async function createRental(input: {
    userId?: string;
    phone?: string;
    size: CompartmentSize;
    planId: string;
    cabinetId: string;
}) {
    if (!input.cabinetId) {
        throw new BadRequestError('cabinetId is required');
    }

    let userId = input.userId;

    if (!userId) {
        if (!input.phone) {
            throw new BadRequestError('userId or phone is required');
        }

        let user = await prisma.user.findUnique({
            where: { phone: input.phone },
        });

        if (!user) {
            user = await prisma.user.create({
                data: { phone: input.phone },
            });
        }

        userId = user.id;
    }

    const plan = await prisma.pricePlan.findUnique({
        where: { id: input.planId },
    });

    if (!plan) throw new NotFoundError('Price plan not found!');
    if (!plan.isActive) throw new BadRequestError('Price plan is not active!');
    if (plan.size !== input.size) {
        throw new BadRequestError('Price plan size does not match selected size!');
    }

    const compartment = await prisma.compartment.findFirst({
        where: {
            cabinetId: input.cabinetId,
            size: input.size,
            status: CompartmentStatus.AVAILABLE,
        },
        orderBy: { name: 'asc' },
    });

    if (!compartment) {
        throw new NotFoundError('No available compartment');
    }

    const result = await createRentalRecord(
        userId,
        compartment.id,
        input.planId,
        RentalStatus.PENDING,
        CompartmentStatus.RESERVED,
    );

    return {
        rental: result.rental,
        code: result.code,
        compartment: result.compartment,
    };
}

export async function verifyQr(token: string) {
    const result = verifyQrToken(token);
    if (!result) throw new BadRequestError('Invalid QR token');

    const rental = await prisma.rental.findUnique({
        where: { id: result.rentalId },
        include: {
            compartment: {
                include: { cabinet: true },
            },
            pricePlan: true,
            user: true,
        },
    });

    if (!rental || rental.status !== RentalStatus.ACTIVE) {
        throw new NotFoundError('Rental not found!');
    }

    if (rental.expiresAt < new Date()) {
        throw new BadRequestError('Rental expired!');
    }

    if (rental.openCount >= rental.maxOpens) {
        throw new BadRequestError('Open limit reached!');
    }

    return {
        authorized: true,
        rental,
        compartment: rental.compartment,
    };
}

export async function verifyPin(code: string) {
    const rental = await prisma.rental.findFirst({
        where: { code },
        include: {
            compartment: { include: { cabinet: true } },
            pricePlan: true,
            user: true,
        },
    });

    if (!rental || rental.status !== RentalStatus.ACTIVE) {
        throw new NotFoundError('Rental not found!');
    }

    const hashMatches = await bcrypt.compare(code, rental.codeHash);
    if (!hashMatches) throw new UnauthorizedError('Invalid Code!');

    if (rental.expiresAt < new Date()) throw new BadRequestError('Rental expired!');
    if (rental.openCount >= rental.maxOpens) throw new BadRequestError('Open limit reached!');

    return {
        authorized: true,
        rental,
        compartment: rental.compartment,
    };
}

export async function getRentalByCode(code: string) {
    const rental = await prisma.rental.findUnique({
        where: { code },
        include: {
            compartment: {
                include: { cabinet: true },
            },
            pricePlan: true,
        },
    });

    if (!rental) throw new NotFoundError('Rental not found!');
    return rental;
}

export async function adminListRentals(filters: {
    status?: RentalStatus;
    locationId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
}) {
    const page = filters.page ?? 1;
    const limit = 20;

    const where: Prisma.RentalWhereInput = {};

    if (filters.status) {
        where.status = filters.status;
    }

    if (filters.locationId) {
        where.compartment = {
            cabinet: {
                locationId: filters.locationId,
            },
        };
    }

    if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
        if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    const [total, rentals] = await Promise.all([
        prisma.rental.count({ where }),
        prisma.rental.findMany({
            where,
            include: {
                user: true,
                compartment: {
                    include: { cabinet: true },
                },
                pricePlan: true,
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
    ]);

    return {
        rentals,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
    };
}

export async function adminGetRental(id: string) {
    const rental = await prisma.rental.findUnique({
        where: { id },
        include: {
            user: true,
            compartment: {
                include: { cabinet: true },
            },
            pricePlan: true,
            logs: {
                orderBy: { createdAt: 'desc' },
            },
            payment: true,
        },
    });

    if (!rental) throw new NotFoundError('Rental not found!');
    return rental;
}

export async function adminCancelRental(id: string) {
    const rental = await prisma.rental.findUnique({
        where: { id },
    });

    if (!rental) throw new NotFoundError('Rental not found!');

    await prisma.$transaction([
        prisma.rental.update({
            where: { id },
            data: { status: RentalStatus.CANCELLED },
        }),
        prisma.compartment.update({
            where: { id: rental.compartmentId },
            data: { status: CompartmentStatus.AVAILABLE },
        }),
    ]);

    return { ok: true };
}

export async function adminUnlockRental(id: string) {
    const rental = await prisma.rental.findUnique({
        where: { id },
        include: {
            compartment: {
                include: { cabinet: true },
            },
        },
    });

    if (!rental) throw new NotFoundError('Rental not found!');

    const topic = `omnibox/${rental.compartment.cabinetId}/cmd/unlock/${rental.compartment.name}`;

    await publishMqtt(topic, { duration: 10 });

    await prisma.lockerLog.create({
        data: {
            cabinetId: rental.compartment.cabinetId,
            compartmentId: rental.compartmentId,
            rentalId: rental.id,
            action: LockerAction.OPENED,
            success: true,
            note: 'admin-unlock',
        },
    });

    return { ok: true };
}

export async function completeRentalGeneric(id: string) {
    const rental = await prisma.rental.findFirst({
        where: {
            id,
            status: RentalStatus.ACTIVE,
        },
    });

    if (!rental) throw new NotFoundError('Rental not found!');

    await prisma.$transaction([
        prisma.rental.update({
            where: { id: rental.id },
            data: { status: RentalStatus.COMPLETED },
        }),
        prisma.compartment.update({
            where: { id: rental.compartmentId },
            data: { status: CompartmentStatus.AVAILABLE },
        }),
    ]);

    return { ok: true };
}

export async function listUserRentals(
    userId: string,
    filters: { page: number; limit: number; status?: RentalStatus },
) {
    const where: Prisma.RentalWhereInput = { userId };

    if (filters.status) {
        where.status = filters.status;
    }

    const [total, rentals] = await Promise.all([
        prisma.rental.count({ where }),
        prisma.rental.findMany({
            where,
            include: {
                compartment: {
                    select: {
                        id: true,
                        name: true,
                        size: true,
                        cabinet: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                pricePlan: true,
                logs: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
            orderBy: { createdAt: 'desc' },
            skip: (filters.page - 1) * filters.limit,
            take: filters.limit,
        }),
    ]);

    return {
        rentals,
        total,
        page: filters.page,
        limit: filters.limit,
        pages: Math.ceil(total / filters.limit),
    };
}

export async function getUserRentalById(rentalId: string, userId: string) {
    const rental = await prisma.rental.findFirst({
        where: {
            id: rentalId,
            userId,
        },
        include: {
            compartment: {
                include: {
                    cabinet: true,
                },
            },
            pricePlan: true,
            logs: {
                orderBy: {
                    createdAt: 'desc',
                },
            },
            payment: true,
        },
    });

    if (!rental) throw new NotFoundError('Rental not found!');
    return rental;
}

export async function completeUserRental(rentalId: string, userId: string) {
    const rental = await prisma.rental.findFirst({
        where: {
            id: rentalId,
            userId,
            status: RentalStatus.ACTIVE,
        },
    });

    if (!rental) throw new NotFoundError('Rental not found!');

    await prisma.$transaction([
        prisma.rental.update({
            where: { id: rental.id },
            data: {
                status: RentalStatus.COMPLETED,
            },
        }),
        prisma.compartment.update({
            where: { id: rental.compartmentId },
            data: {
                status: CompartmentStatus.AVAILABLE,
            },
        }),
    ]);

    return { ok: true };
}