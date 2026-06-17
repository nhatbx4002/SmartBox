import cron from 'node-cron';
import { PaymentStatus } from '../generated/prisma';
import { prisma } from '../lib/prisma';
import { cancelPendingPayment } from '../services/payment.service';

export function startPaymentExpiry() {
  cron.schedule('* * * * *', async () => {
    try {
      const expiredPayments = await prisma.payment.findMany({
        where: {
          status: PaymentStatus.PENDING,
          expiresAt: { lt: new Date() },
        },
      });

      console.log(`[PaymentExpiry] ${expiredPayments.length} expired payment(s) found`);

      for (const payment of expiredPayments) {
        await cancelPendingPayment(payment.id);
      }
    } catch (error) {
      console.error('Payment expiry job failed:', error);
    }
  });
}
