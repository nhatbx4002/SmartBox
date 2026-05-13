import { LockerAction } from '../generated/prisma';
import { publishMqtt } from '../lib/mqtt';
import { prisma } from '../lib/prisma';

export async function unlockCompartment(cabinetId: string, compartmentIdOrName: string, rentalId?: string) {
  const compartment = await findCompartment(cabinetId, compartmentIdOrName);
  const topicName = compartment?.name ?? compartmentIdOrName;

  publishMqtt(`smartbox/${cabinetId}/lock/${topicName}/unlock`, {
    action: 'unlock',
    cabinetId,
    compartmentId: compartment?.id ?? compartmentIdOrName,
    compartmentName: topicName,
    rentalId,
    timestamp: new Date().toISOString(),
  });

  await prisma.lockerLog.create({
    data: {
      cabinetId,
      compartmentId: compartment?.id,
      rentalId,
      action: LockerAction.OPENED,
      success: true,
      note: 'Unlock command published',
    },
  });
}

export async function lockCompartment(cabinetId: string, compartmentIdOrName: string) {
  const compartment = await findCompartment(cabinetId, compartmentIdOrName);
  const topicName = compartment?.name ?? compartmentIdOrName;

  publishMqtt(`smartbox/${cabinetId}/lock/${topicName}/lock`, {
    action: 'lock',
    cabinetId,
    compartmentId: compartment?.id ?? compartmentIdOrName,
    compartmentName: topicName,
    timestamp: new Date().toISOString(),
  });
}

async function findCompartment(cabinetId: string, compartmentIdOrName: string) {
  return prisma.compartment.findFirst({
    where: {
      cabinetId,
      OR: [{ id: compartmentIdOrName }, { name: compartmentIdOrName }],
    },
  });
}
