import cron from 'node-cron';
import { PaymentStatus } from '../generated/prisma';
import { prisma } from '../lib/prisma';
import { cancelPayment } from '../services/payment.services';

/**
 * Quét payment PENDING đã hết hạn (expiresAt < now) → hủy payment + rental + giải phóng compartment.
 *
 * Chạy mỗi phút. Tái dùng cancelPayment() để đảm bảo cùng logic hủy PayOS + transaction.
 */
export async function checkExpiredPayments(): Promise<void> {
    const expired = await prisma.payment.findMany({
        where: {
            status: PaymentStatus.PENDING,
            expiresAt: { lt: new Date() },
        },
        select: { orderCode: true },
    });

    for (const payment of expired) {
        try {
            await cancelPayment(payment.orderCode);
        } catch (error) {
            console.error(`[paymentExpiry] cancel failed for orderCode=${payment.orderCode}:`, error);
        }
    }

    if (expired.length > 0) {
        console.log(`[paymentExpiry] expired ${expired.length} payment(s)`);
    }
}

export function startPaymentExpiryChecker(): void {
    cron.schedule('* * * * *', () => {
        checkExpiredPayments().catch((error) => {
            console.error('[paymentExpiry] failed:', error);
        });
    });
}
