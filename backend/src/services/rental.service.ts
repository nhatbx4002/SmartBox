import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
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


export async function createRental(input: {
  phone: string;
  size: CompartmentSize;
  planId: string;
  cabinetId?: string;
}) {
  const plan = await prisma.pricePlan.findFirst({
    where: { id: input.planId, size: input.size, isActive: true },
  });
  if (!plan) {
    throw NotFoundError(`Khong tim thay goi ${input.size === CompartmentSize.SMALL ? 'Size 1' : 'Size 2'} phu hop`);
  }

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
    const sizeLabel = input.size === CompartmentSize.SMALL ? 'Size 1' : 'Size 2';
    throw BadRequestError(`Không còn ngăn trống phù hợp ${sizeLabel}`);
  }

  const code = await generateUniqueCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000);
  const tempQrToken = `pending-${crypto.randomUUID()}`;

  const rental = await prisma.$transaction(async (tx) => {
    const claim = await tx.compartment.updateMany({
      where: { id: compartment.id, status: CompartmentAvailability.AVAILABLE },
      data: { status: CompartmentAvailability.OCCUPIED },
    });
    if (claim.count !== 1) {
      throw BadRequestError('Ngăn này vừa được người khác thuê, vui lòng thử lại');
    }

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
        qrToken: tempQrToken,
        maxOpens: plan.maxOpens ?? 999,
        expiresAt,
      },
      include: { compartment: { include: { cabinet: true } }, pricePlan: true, user: true },
    });

    const finalQrToken = signQrToken(created.id);
    const updated = await tx.rental.update({
      where: { id: created.id },
      data: { qrToken: finalQrToken },
      include: { compartment: { include: { cabinet: true } }, pricePlan: true, user: true },
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

    return updated;
  });

  return { rental, code, compartment: rental.compartment };
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

  // Safety net: already at or past limit (race condition / stale call)
  if (rental.openCount >= rental.maxOpens) {
    await completeRental(rentalId);
    return;
  }

  const updated = await prisma.rental.update({
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

  // Release compartment immediately after the last allowed open
  if (updated.openCount >= rental.maxOpens) {
    await completeRental(rentalId);
  }

  return updated;
}

async function generateUniqueCode(): Promise<string> {
  for (let i = 0; i < 10; i += 1) {
    const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
    const existing = await prisma.rental.findUnique({ where: { code } });
    if (!existing) return code;
  }
  throw new Error('Unable to generate unique rental code');
}
