import {Prisma, NotificationType} from '../generated/prisma'
import {prisma} from '../lib/prisma'

export async function listUserNotifications(userId:string){
    return prisma.notification.findMany({
        where: {userId},
        orderBy: {createdAt: 'desc'},
    });
}

export async function markAllNotificationsRead(userId: string){
    const result = await prisma.notification.updateMany({
        where: {userId, isRead: false},
        data: {isRead: true},
    });
    return {ok: true, count: result.count};
}

export async function markNotificationRead(notificationId: string){
    return prisma.notification.update({
        where: {id: notificationId},
        data: {isRead: true},
    })
}

export async function createNotification(data: {
    userId?: string;
    type: NotificationType;
    title: string;
    body: string;
    data?: object;
}) {
    return prisma.notification.create({
        data: { ...data, data: data.data ?? {} },
    });
}

export async function adminListNotifications(filters: { isRead?: boolean }) {
    const where: Prisma.NotificationWhereInput = {};
    if (filters.isRead !== undefined) where.isRead = filters.isRead;
    return prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' } });
}

export async function adminMarkAllRead() {
    const result = await prisma.notification.updateMany({
        where: { isRead: false },
        data: { isRead: true },
    });
    return { ok: true, count: result.count };
}

export async function adminMarkNotificationRead(id: string) {
    return prisma.notification.update({ where: { id }, data: { isRead: true } });
}

