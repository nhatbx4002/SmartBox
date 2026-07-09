import { LockerAction, NotificationType } from '../generated/prisma';
import { subscribeMqtt } from '../lib/mqtt';
import { prisma } from '../lib/prisma';
import { emitHardwareError } from '../lib/socket';
import * as systemService from '../services/system.services';
import * as notificationService from '../services/notification.services';

type HeartbeatPayload = { cabinetId: string };

type DoorOpenedPayload = {
    event?: string;
    rentalId?: string;
    compartmentId?: string;
};

type ErrorPayload = {
    errorType: 'RELAY_FAULT' | 'MCP_FAULT';
    compartmentId?: string;
    message: string;
    timestamp?: string;
};

type StatusPayload = {
    status?: 'online' | 'offline';
    ts?: number;
};

function extractCabinetId(topic: string): string | null {
    const parts = topic.split('/');
    return parts.length >= 2 ? parts[1] : null;
}

/**
 * Đăng ký toàn bộ MQTT topic mà backend cần lắng nghe từ kiosk.
 *
 * Gọi hàm này sau khi connectMqtt() đã kết nối thành công.
 */
export function setupMqttHandlers(): void {
    subscribeMqtt<HeartbeatPayload>('omnibox/+/evt/heartbeat', async (topic) => {
        const cabinetId = extractCabinetId(topic);
        if (!cabinetId) return;

        try {
            await systemService.heartbeat(cabinetId);
        } catch (error) {
            console.error(`[MQTT] heartbeat handler failed (${cabinetId}):`, error);
        }
    });

    subscribeMqtt<DoorOpenedPayload>('omnibox/+/evt/door-opened', async (topic, payload) => {
        const cabinetId = extractCabinetId(topic);
        if (!cabinetId) return;

        try {
            await systemService.recordLockerEvent({
                cabinetId,
                compartmentId: payload.compartmentId,
                rentalId: payload.rentalId,
                event: payload.event ?? 'opened',
            });
        } catch (error) {
            console.error(`[MQTT] door-opened handler failed (${cabinetId}):`, error);
        }
    });

    subscribeMqtt<ErrorPayload>('omnibox/+/evt/error', async (topic, payload) => {
        const cabinetId = extractCabinetId(topic);
        if (!cabinetId) return;

        try {
            await prisma.lockerLog.create({
                data: {
                    cabinetId,
                    compartmentId: payload.compartmentId,
                    action: LockerAction.FAULTY,
                    success: false,
                    note: payload.message,
                },
            });

            await notificationService.createNotification({
                type: NotificationType.HARDWARE_FAULT,
                title: 'Lỗi phần cứng',
                body: payload.message,
                data: { cabinetId, compartmentId: payload.compartmentId, errorType: payload.errorType },
            });

            emitHardwareError(cabinetId, payload.compartmentId ?? '', payload.errorType, payload.message);
        } catch (error) {
            console.error(`[MQTT] error handler failed (${cabinetId}):`, error);
        }
    });

    subscribeMqtt<StatusPayload>('omnibox/+/evt/status', async (topic, payload) => {
        const cabinetId = extractCabinetId(topic);
        if (!cabinetId) return;

        try {
            if (payload.status === 'offline') {
                await systemService.markOffline(cabinetId);
            } else if (payload.status === 'online') {
                await systemService.markOnline(cabinetId);
            }
        } catch (error) {
            console.error(`[MQTT] status handler failed (${cabinetId}):`, error);
        }
    });
}
