import { DoorStatus, LockStatus } from '../generated/prisma';
import { subscribeMqtt } from '../lib/mqtt';
import { prisma } from '../lib/prisma';
import { updateCompartmentStatus, updateHeartbeat } from '../services/cabinet.service';
import { handleUnlock } from '../services/rental.service';

type LockStatusPayload = {
  lockStatus?: LockStatus;
  doorStatus?: DoorStatus;
};

type EventPayload = {
  event?: string;
  rentalId?: string;
};

export function setupMqttHandlers() {
  subscribeMqtt('smartbox/+/lock/+/status', async (topic, payload) => {
    try {
      const [, cabinetId, , compartmentName] = topic.split('/');
      const parsed = payload as LockStatusPayload;
      if (!isLockStatus(parsed.lockStatus) || !isDoorStatus(parsed.doorStatus)) return;

      const compartment = await prisma.compartment.findFirst({
        where: { cabinetId, name: compartmentName },
      });
      if (!compartment) return;

      await updateCompartmentStatus(compartment.id, parsed.lockStatus, parsed.doorStatus);
    } catch (error) {
      console.error('MQTT lock status handler failed:', error);
    }
  });

  subscribeMqtt('smartbox/+/event/+', async (_topic, payload) => {
    try {
      const parsed = payload as EventPayload;
      if (parsed.event === 'opened' && parsed.rentalId) {
        await handleUnlock(parsed.rentalId);
      }
    } catch (error) {
      console.error('MQTT event handler failed:', error);
    }
  });

  subscribeMqtt('smartbox/+/heartbeat', async (topic) => {
    try {
      const [, cabinetId] = topic.split('/');
      await updateHeartbeat(cabinetId);
    } catch (error) {
      console.error('MQTT heartbeat handler failed:', error);
    }
  });
}

function isLockStatus(value: unknown): value is LockStatus {
  return typeof value === 'string' && Object.values(LockStatus).includes(value as LockStatus);
}

function isDoorStatus(value: unknown): value is DoorStatus {
  return typeof value === 'string' && Object.values(DoorStatus).includes(value as DoorStatus);
}
