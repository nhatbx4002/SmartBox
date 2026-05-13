"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startExpiryChecker = startExpiryChecker;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = require("../generated/prisma");
const prisma_2 = require("../lib/prisma");
const notification_service_1 = require("../services/notification.service");
function startExpiryChecker() {
    node_cron_1.default.schedule('* * * * *', async () => {
        try {
            const expiredRentals = await prisma_2.prisma.rental.findMany({
                where: { status: prisma_1.RentalStatus.ACTIVE, expiresAt: { lt: new Date() } },
            });
            for (const rental of expiredRentals) {
                await prisma_2.prisma.$transaction(async (tx) => {
                    await tx.rental.update({
                        where: { id: rental.id },
                        data: { status: prisma_1.RentalStatus.EXPIRED },
                    });
                    await tx.compartment.update({
                        where: { id: rental.compartmentId },
                        data: { status: prisma_1.CompartmentAvailability.AVAILABLE },
                    });
                    await tx.lockerLog.create({
                        data: {
                            compartmentId: rental.compartmentId,
                            rentalId: rental.id,
                            action: prisma_1.LockerAction.EXPIRED,
                            success: true,
                        },
                    });
                });
                await (0, notification_service_1.sendRentalExpired)(rental.id);
            }
        }
        catch (error) {
            console.error('Expiry checker failed:', error);
        }
    });
}
//# sourceMappingURL=expiryChecker.js.map