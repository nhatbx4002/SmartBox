import cron from 'node-cron';
import { CabinetStatus } from '../generated/prisma';
import { emitCabinetStatus } from '../lib/socket';
import { prisma } from '../lib/prisma';
import { sendCabinetOffline } from '../services/notification.service';

export function startHeartbeatMonitor() {
  const intervalSeconds = Number(process.env.HEARTBEAT_INTERVAL || 30);
  const cronExpression = `*/${Math.max(1, intervalSeconds)} * * * * *`;

  cron.schedule(cronExpression, async () => {
    try {
      const timeoutSeconds = Number(process.env.HEARTBEAT_TIMEOUT || 90);
      const threshold = new Date(Date.now() - timeoutSeconds * 1000);
      const offlineCabinets = await prisma.cabinet.findMany({
        where: {
          status: { not: CabinetStatus.OFFLINE },
          OR: [{ lastHeartbeatAt: null }, { lastHeartbeatAt: { lt: threshold } }],
        },
      });

      for (const cabinet of offlineCabinets) {
        await prisma.cabinet.update({
          where: { id: cabinet.id },
          data: { status: CabinetStatus.OFFLINE },
        });
        emitCabinetStatus(cabinet.id, { status: CabinetStatus.OFFLINE });
        await sendCabinetOffline(cabinet.id);
      }
    } catch (error) {
      console.error('Heartbeat monitor failed:', error);
    }
  });
}
