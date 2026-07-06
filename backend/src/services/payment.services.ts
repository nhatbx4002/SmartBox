import { PaymentStatus, PaymentSource, RentalStatus, CompartmentStatus } from '../generated/prisma';
import { BadRequestError, NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { createPayosPayment, cancelPayosPayment, verifyPayosWebhook } from '../lib/payos';
import { publishMqtt } from '../lib/mqtt';

const PAYMENT_TTL_SECONDS = 5 * 60;

function generateOrderCode(): number {
    return Math.floor(100000000 + Math.random() * 900000000);
}

async function generateUniqueOrderCode(): Promise<number> {
    for (let i = 0; i < 10; i++) {
        const orderCode = generateOrderCode();
        const existing = await prisma.payment.findUnique({ where: { orderCode } });
        if (!existing) return orderCode;
    }
    throw new BadRequestError('Could not generate unique order code');
}

export async function createPayment(rentalId: string, source?: 'KIOSK' | 'APP') {
    const rental = await prisma.rental.findUnique({
        where: { id: rentalId },
        include: { pricePlan: true },
    });
    if (!rental) throw new NotFoundError('Rental not found!');
    if (rental.status !== RentalStatus.PENDING) {
        throw new BadRequestError('Rental is not pending payment');
    }

    const expiresAt = new Date(Date.now() + PAYMENT_TTL_SECONDS * 1000);

    for (let attempt = 0; attempt < 10; attempt++) {
        const orderCode = await generateUniqueOrderCode();

        try {
            const payosResult = await createPayosPayment({
                orderCode,
                amount: rental.pricePlan.price,
                description: rental.code,
                returnUrl: process.env.PAYOS_RETURN_URL!,
                cancelUrl: process.env.PAYOS_CANCEL_URL!,
                expiredAt: Math.floor(expiresAt.getTime() / 1000),
            });

            const payment = await prisma.payment.create({
                data: {
                    rentalId,
                    orderCode,
                    amount: rental.pricePlan.price,
                    paymentLinkId: payosResult.paymentLinkId,
                    checkoutUrl: payosResult.checkoutUrl,
                    qrCode: payosResult.qrCode,
                    expiresAt,
                    status: PaymentStatus.PENDING,
                    source: source === 'APP' ? PaymentSource.APP : PaymentSource.KIOSK,
                },
            });

            return {
                orderCode: payment.orderCode,
                qrCode: payment.qrCode,
                checkoutUrl: payment.checkoutUrl,
                amount: payment.amount,
                expiresAt: payment.expiresAt,
            };
        } catch (err: any) {
            if (err?.code === 'P2002' && attempt < 9) {
                continue;
            }
            throw err;
        }
    }

    throw new BadRequestError('Could not create payment after multiple retries');
}

export async function getPaymentStatus(orderCode: number) {
    const payment = await prisma.payment.findUnique({ where: { orderCode } });
    if (!payment) throw new NotFoundError('Payment not found!');
    return { orderCode: payment.orderCode, status: payment.status };
}

export async function handleWebhook(body: unknown) {
    const webhookData = await verifyPayosWebhook(body);

    const payment = await prisma.payment.findUnique({
        where: { orderCode: webhookData.orderCode },
        include: { rental: { include: { compartment: true } } },
    });

    if (!payment) {
        return { code: '00', desc: 'success' };
    }

    if (webhookData.code !== '00') {
        return { code: '00', desc: 'success' };
    }

    if (payment.status === PaymentStatus.PAID) {
        return { code: '00', desc: 'success' };
    }

    const paid = await prisma.$transaction(async (tx) => {
        const updated = await tx.payment.updateMany({
            where: { id: payment.id, status: PaymentStatus.PENDING },
            data: { status: PaymentStatus.PAID, paidAt: new Date() },
        });
        if (updated.count === 0) return false;
        await tx.rental.update({
            where: { id: payment.rentalId },
            data: { status: RentalStatus.ACTIVE },
        });
        await tx.compartment.update({
            where: { id: payment.rental.compartmentId },
            data: { status: CompartmentStatus.OCCUPIED },
        });
        return true;
    });

    if (!paid) return { code: '00', desc: 'success' };

    if (payment.source === PaymentSource.KIOSK) {
        const topic = `omnibox/${payment.rental.compartment.cabinetId}/cmd/payment/${payment.orderCode}`;
        await publishMqtt(topic, {
            orderCode: payment.orderCode,
            status: 'PAID',
            rentalId: payment.rentalId,
            code: payment.rental.code,
        });
    }

    return { code: '00', desc: 'success' };
}

export async function getPaymentResult(orderCode: number) {
    const payment = await prisma.payment.findUnique({
        where: { orderCode },
        include: {
            rental: {
                include: {
                    compartment: { include: { cabinet: true } },
                },
            },
        },
    });
    if (!payment) throw new NotFoundError('Payment not found!');

    const rental = payment.rental;
    return {
        rentalId: rental.id,
        pin: rental.code,
        compartmentId: rental.compartment.id,
        compartmentName: rental.compartment.name,
        cabinetName: rental.compartment.cabinet.name,
        expiresAt: rental.expiresAt,
        qrData: rental.qrToken,
    };
}

export async function cancelPayment(orderCode: number) {
    const payment = await prisma.payment.findUnique({
        where: { orderCode },
        include: { rental: true },
    });
    if (!payment) throw new NotFoundError('Payment not found!');

    const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.payment.updateMany({
            where: { id: payment.id, status: PaymentStatus.PENDING },
            data: { status: PaymentStatus.FAILED },
        });
        if (updated.count === 0) return false;
        await tx.rental.update({
            where: { id: payment.rentalId },
            data: { status: RentalStatus.CANCELLED },
        });
        await tx.compartment.update({
            where: { id: payment.rental.compartmentId },
            data: { status: CompartmentStatus.AVAILABLE },
        });
        return true;
    });

    if (!result) throw new BadRequestError('Payment cannot be cancelled');

    if (payment.paymentLinkId) {
        try {
            await cancelPayosPayment(payment.paymentLinkId, 'Cancelled by user');
        } catch (error) {
            console.error('[Payment] cancelPayosPayment failed (continuing):', error);
        }
    }

    return { ok: true };
}
