"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startHeartbeatMonitor = startHeartbeatMonitor;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = require("../generated/prisma");
const socket_1 = require("../lib/socket");
const prisma_2 = require("../lib/prisma");
const notification_service_1 = require("../services/notification.service");
function startHeartbeatMonitor() {
    const intervalSeconds = Number(process.env.HEARTBEAT_INTERVAL || 30);
    const cronExpression = `*/${Math.max(1, intervalSeconds)} * * * * *`;
    node_cron_1.default.schedule(cronExpression, async () => {
        try {
            const timeoutSeconds = Number(process.env.HEARTBEAT_TIMEOUT || 90);
            const threshold = new Date(Date.now() - timeoutSeconds * 1000);
            const offlineCabinets = await prisma_2.prisma.cabinet.findMany({
                where: {
                    status: { not: prisma_1.CabinetStatus.OFFLINE },
                    OR: [{ lastHeartbeatAt: null }, { lastHeartbeatAt: { lt: threshold } }],
                },
            });
            for (const cabinet of offlineCabinets) {
                await prisma_2.prisma.cabinet.update({
                    where: { id: cabinet.id },
                    data: { status: prisma_1.CabinetStatus.OFFLINE },
                });
                (0, socket_1.emitCabinetStatus)(cabinet.id, { status: prisma_1.CabinetStatus.OFFLINE });
                await (0, notification_service_1.sendCabinetOffline)(cabinet.id);
            }
        }
        catch (error) {
            console.error('Heartbeat monitor failed:', error);
        }
    });
}
//# sourceMappingURL=heartbeatMonitor.js.map