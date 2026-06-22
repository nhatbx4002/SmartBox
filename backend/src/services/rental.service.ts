import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {
  CabinetStatus,
  CompartmentAvailability,
  CompartmentSize,
  LockerAction,
  RentalStatus,
} from '../generated/prisma';
import { BadRequestError, NotFoundError } from '../lib/errors';
import { signQrToken, verifyQrToken } from '../lib/qr';
import { prisma } from '../lib/prisma';
import { createNotification } from './notification.service';
import { NotificationType } from '../generated/prisma';

export async function createRental(input: {
  phone: string;
  size: CompartmentSize;
  planId: string;
  cabinetId?: string;
}) {
  const plan = await prisma.pricePlan.findFirst({
    where: { id: input.planId, size: input.size, isActive: true },
  });
  console.log(`[createRental] looking for plan id="${input.planId}" size=${input.size}:`, plan ? `found "${plan.name}"` : 'NOT FOUND');
  if (!plan) {
    // Debug: log all plans for this size
    const allPlans = await prisma.pricePlan.findMany({ where: { size: input.size, isActive: true }, select: { id: true, name: true } });
    console.log(`[createRental] available plans for size=${input.size}:`, allPlans);
    throw NotFoundError(`Khong tim thay goi ${input.size === CompartmentSize.SMALL ? 'Size 1' : 'Size 2'} phu hop`);
  }

  const cabinetFilter = input.cabinetId ? { id: input.cabinetId } : {};
  const cabinet = await prisma.cabinet.findFirst({ where: cabinetFilter });
  if (!cabinet) throw NotFoundError('Cabinet not found');
  if (cabinet.status !== CabinetStatus.ACTIVE) {
    throw BadRequestError(`Cabinet "${cabinet.name}" hien dang ${cabinet.status.toLowerCase()}`);
  }

  // Debug: log all compartments for this cabinet
  const allCompartments = await prisma.compartment.findMany({
    where: { cabinetId: cabinet.id },
    select: { id: true, name: true, size: true, status: true },
  });
  console.log(`[createRental] cabinet="${cabinet.id}" size=${input.size} compartments:`, allCompartments);

  const compartment = await prisma.compartment.findFirst({
    where: {
      size: input.size,
      status: CompartmentAvailability.AVAILABLE,
      cabinet: {
        id: input.cabinetId ?? undefined,
        status: CabinetStatus.ACTIVE,
      },
    },
    include: { cabinet: true },
    orderBy: [{ cabinetId: 'asc' }, { name: 'asc' }],
  });
  if (!compartment) {
    throw BadRequestError(`Khong con ngho trong — ngho "${cabinet.name}" da het cho ${input.size === CompartmentSize.SMALL ? 'Size 1' : 'Size 2'}`);
  }

  const code = await generateUniqueCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000);
  const qrToken = signQrToken(`pending-${crypto.randomUUID()}`);

  const rental = await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { phone: input.phone },
      update: {},
      create: { phone: input.phone },
    });

    const created = await tx.rental.create({
      data: {
        userId: user.id,
        compartmentId: compartment.id,
        pricePlanId: plan.id,
        code,
        codeHash,
        qrToken,
        maxOpens: plan.maxOpens ?? 999,
        expiresAt,
      },
      include: { compartment: { include: { cabinet: true } }, pricePlan: true, user: true },
    });

    await tx.compartment.update({
      where: { id: compartment.id },
      data: { status: CompartmentAvailability.OCCUPIED },
    });

    await tx.lockerLog.create({
      data: {
        cabinetId: compartment.cabinetId,
        compartmentId: compartment.id,
        rentalId: created.id,
        action: LockerAction.OPENED,
        success: true,
        note: 'Rental created',
      },
    });

    return created;
  });

  await prisma.rental.update({
    where: { id: rental.id },
    data: { qrToken: signQrToken(rental.id) },
  });

  return { rental: { ...rental, qrToken: signQrToken(rental.id) }, code, compartment: rental.compartment };
}

export async function getByCode(code: string) {
  const rental = await prisma.rental.findUnique({
    where: { code },
    include: { compartment: { include: { cabinet: true, realtimeStatus: true } }, pricePlan: true, user: true },
  });
  if (!rental) throw NotFoundError('Rental not found');
  return rental;
}

export async function verifyQrRental(token: string) {
  const verified = verifyQrToken(token);
  if (!verified) {
    throw BadRequestError('Invalid QR code');
  }

  const rental = await prisma.rental.findUnique({
    where: { id: verified.rentalId },
    include: { compartment: { include: { cabinet: true, realtimeStatus: true } }, pricePlan: true, user: true },
  });

  if (!rental || rental.status !== RentalStatus.ACTIVE) {
    throw NotFoundError('Rental not found');
  }

  if (rental.expiresAt < new Date()) {
    throw BadRequestError('Rental expired');
  }

  if (rental.openCount >= rental.maxOpens) {
    throw BadRequestError('Open limit reached');
  }

  return { authorized: true, rental, compartment: rental.compartment };
}

export async function completeRental(rentalId: string) {
  const rental = await prisma.rental.findUnique({ where: { id: rentalId } });
  if (!rental) throw NotFoundError('Rental not found');

  return prisma.$transaction(async (tx) => {
    await tx.rental.update({ where: { id: rentalId }, data: { status: RentalStatus.COMPLETED } });
    await tx.compartment.update({
      where: { id: rental.compartmentId },
      data: { status: CompartmentAvailability.AVAILABLE },
    });
  });
}

export async function cancelRental(rentalId: string, adminId?: string) {
  const rental = await prisma.rental.findUnique({ where: { id: rentalId } });
  if (!rental) throw NotFoundError('Rental not found');

  return prisma.$transaction(async (tx) => {
    await tx.rental.update({ where: { id: rentalId }, data: { status: RentalStatus.CANCELLED } });
    await tx.compartment.update({
      where: { id: rental.compartmentId },
      data: { status: CompartmentAvailability.AVAILABLE },
    });
    await tx.lockerLog.create({
      data: {
        compartmentId: rental.compartmentId,
        rentalId,
        action: LockerAction.DENIED,
        success: true,
        note: adminId ? `Cancelled by admin ${adminId}` : 'Cancelled',
      },
    });
  });
}

export async function handleUnlock(rentalId: string) {
  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    include: { compartment: true },
  });
  if (!rental) return;

  if (rental.status !== RentalStatus.ACTIVE) return;

  if (rental.openCount >= rental.maxOpens) {
    await completeRental(rentalId);
    return;
  }

  return prisma.rental.update({
    where: { id: rentalId },
    data: {
      openCount: { increment: 1 },
      logs: {
        create: {
          cabinetId: rental.compartment.cabinetId,
          compartmentId: rental.compartmentId,
          action: LockerAction.OPENED,
          success: true,
        },
      },
    },
  });
}

async function generateUniqueCode(): Promise<string> {
  for (let i = 0; i < 10; i += 1) {
    const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
    const existing = await prisma.rental.findUnique({ where: { code } });
    if (!existing) return code;
  }
  throw new Error('Unable to generate unique rental code');
}
