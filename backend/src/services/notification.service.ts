import { NotificationType, Prisma } from '../generated/prisma';
import { prisma } from '../lib/prisma';

export async function createNotification(input: {
  userId?: string | null;
  type: NotificationType;
  title: string;
  body: string;
  data?: Prisma.InputJsonValue;
}) {
  return prisma.notification.create({
    data: {
      userId: input.userId ?? null,
      type: input.type,
      title: input.title,
      body: input.body,
      data: input.data ?? Prisma.JsonNull,
    },
  });
}

export async function sendRentalExpired(rentalId: string) {
  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    include: { user: true, compartment: { include: { cabinet: true } } },
  });
  if (!rental) return;

  await createNotification({
    userId: rental.userId,
    type: NotificationType.RENTAL_EXPIRED,
    title: 'Rental expired',
    body: `Rental ${rental.code} has expired.`,
    data: { rentalId, compartmentId: rental.compartmentId, cabinetId: rental.compartment.cabinetId },
  });
}

export async function sendCabinetOffline(cabinetId: string) {
  const cabinet = await prisma.cabinet.findUnique({ where: { id: cabinetId } });
  if (!cabinet) return;

  await createNotification({
    type: NotificationType.CABINET_OFFLINE,
    title: 'Cabinet offline',
    body: `${cabinet.name} is offline.`,
    data: { cabinetId },
  });
}
