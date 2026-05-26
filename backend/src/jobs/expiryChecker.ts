import cron from 'node-cron';
import { CompartmentAvailability, LockerAction, RentalStatus } from '../generated/prisma';
import { prisma } from '../lib/prisma';
import { sendRentalExpired } from '../services/notification.service';

export function startExpiryChecker() {
  cron.schedule('* * * * *', async () => {
    try {
      const expiredRentals = await prisma.rental.findMany({
        where: { status: RentalStatus.ACTIVE, expiresAt: { lt: new Date() } },
      });

      for (const rental of expiredRentals) {
        await prisma.$transaction(async (tx) => {
          await tx.rental.update({
            where: { id: rental.id },
            data: { status: RentalStatus.EXPIRED },
          });
          await tx.compartment.update({
            where: { id: rental.compartmentId },
            data: { status: CompartmentAvailability.AVAILABLE },
          });
          await tx.lockerLog.create({
            data: {
              compartmentId: rental.compartmentId,
              rentalId: rental.id,
              action: LockerAction.EXPIRED,
              success: true,
            },
          });
        });

        await sendRentalExpired(rental.id);
      }
    } catch (error) {
      console.error('Expiry checker failed:', error);
    }
  });
}
