import cron from 'node-cron';
import { CabinetStatus } from '../generated/prisma';
import { prisma } from '../lib/prisma';
import { emitCabinetStatus } from '../lib/socket';

const OFFLINE_THRESHOLD_SECONDS = 60;

/**
 * Quét cabinet ACTIVE không gửi heartbeat quá 60s → chuyển OFFLINE.
 *
 * Chạy mỗi 30 giây.
 */
export async function checkOfflineCabinets(): Promise<void> {
    const threshold = new Date(Date.now() - OFFLINE_THRESHOLD_SECONDS * 1000);

    const offline = await prisma.cabinet.findMany({
        where: {
            status: CabinetStatus.ACTIVE,
            OR: [
                { lastHeartbeatAt: { lt: threshold } },
                { lastHeartbeatAt: null },
            ],
        },
        select: { id: true },
    });

    for (const cabinet of offline) {
        const updated = await prisma.cabinet.update({
            where: { id: cabinet.id },
            data: { status: CabinetStatus.OFFLINE },
        });

        emitCabinetStatus(cabinet.id, { status: updated.status });
    }

    if (offline.length > 0) {
        console.log(`[heartbeatMonitor] marked ${offline.length} cabinet(s) OFFLINE`);
    }
}

export function startHeartbeatMonitor(): void {
    cron.schedule('*/30 * * * * *', () => {
        checkOfflineCabinets().catch((error) => {
            console.error('[heartbeatMonitor] failed:', error);
        });
    });
}
