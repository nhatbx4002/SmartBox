import { PaymentStatus, PaymentSource, NotificationType } from '../generated/prisma';
import payos from '../lib/payos';
import { publishMqtt } from '../lib/mqtt';
import { prisma } from '../lib/prisma';
import { createNotification } from './notification.service';
import { BadRequestError, NotFoundError } from '../lib/errors';

// ---------------------------------------------------------------------------
// orderCode generation
// ---------------------------------------------------------------------------

function generateOrderCode(): number {
  return Math.floor(100000000 + Math.random() * 900000000);
}

async function ensureUniqueOrderCode(): Promise<number> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateOrderCode();
    const existing = await prisma.payment.findUnique({ where: { orderCode: code } });
    if (!existing) return code;
  }
  throw new Error('Unable to generate a unique orderCode after 10 attempts');
}

// ---------------------------------------------------------------------------
// startPaymentForRental
// ---------------------------------------------------------------------------

export async function startPaymentForRental(
  rentalId: string,
  source: 'KIOSK' | 'APP' = 'KIOSK'
) {
  console.log(`[Payment] startPaymentForRental rentalId=${rentalId} source=${source}`);

  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    include: {
      pricePlan: true,
      compartment: { include: { cabinet: true } },
    },
  });
  if (!rental) throw NotFoundError('Rental not found');

  const existingPayment = await prisma.payment.findUnique({
    where: { rentalId: rental.id },
  });
  if (existingPayment?.status === PaymentStatus.PAID) {
    throw BadRequestError('Rental already paid');
  }

  const amount = rental.pricePlan.price;
  const ttlMin = Number(process.env.PAYMENT_PENDING_TTL_MIN ?? 5);
  const expiresAt = new Date(Date.now() + ttlMin * 60 * 1000);
  const orderCode = await ensureUniqueOrderCode();
  console.log(`[Payment] Generated orderCode=${orderCode} amount=${amount} cabinetId=${rental.compartment.cabinet.id}`);

  const baseUrl = process.env.PUBLIC_BASE_URL ?? 'http://localhost:3001';
  const payosResult = await payos.paymentRequests.create({
    orderCode,
    amount,
    description: rental.code,
    returnUrl: `${baseUrl}/api/payments/payos/return`,
    cancelUrl: `${baseUrl}/api/payments/payos/cancel`,
    expiredAt: Math.floor(expiresAt.getTime() / 1000),
  });
  console.log(`[Payment] PayOS link created: paymentLinkId=${payosResult.paymentLinkId}`);

  if (existingPayment) {
    await prisma.payment.delete({ where: { rentalId: rental.id } });
    console.log(`[Payment] Deleted stale pending payment for rentalId=${rentalId}`);
  }

  const payment = await prisma.payment.create({
    data: {
      rentalId,
      orderCode,
      amount,
      status: PaymentStatus.PENDING,
      paymentLinkId: payosResult.paymentLinkId,
      checkoutUrl: payosResult.checkoutUrl,
      qrCode: payosResult.qrCode,
      method: 'PAYOS',
      source: source === 'APP' ? PaymentSource.APP : PaymentSource.KIOSK,
      expiresAt,
    },
  });
  console.log(`[Payment] Payment row created id=${payment.id} orderCode=${payment.orderCode} source=${payment.source}`);

  return {
    orderCode: payment.orderCode,
    qrCode: payment.qrCode!,
    checkoutUrl: payment.checkoutUrl!,
    amount: payment.amount,
    expiresAt: payment.expiresAt!,
  };
}

// ---------------------------------------------------------------------------
// handlePayosWebhook
// ---------------------------------------------------------------------------

export async function handlePayosWebhook(body: any) {
  console.log(`[PayOS Webhook] Received body: code=${body?.code} orderCode=${body?.data?.orderCode ?? 'n/a'}`);

  if (body?.code !== '00') {
    console.log(`[PayOS Webhook] Non-success code: ${body?.code} — ignoring`);
    return;
  }

  let data: any;
  try {
    data = await payos.webhooks.verify(body);
    console.log(`[PayOS Webhook] Verified orderCode=${data.orderCode}`);
  } catch (err) {
    console.error(`[PayOS Webhook] Signature verification failed:`, err);
    return;
  }

  const payment = await prisma.payment.findUnique({
    where: { orderCode: data.orderCode },
    include: {
      rental: {
        include: {
          compartment: { include: { cabinet: true } },
          user: true,
        },
      },
    },
  });
  if (!payment) {
    console.warn(`[PayOS Webhook] orderCode ${data.orderCode} not found in DB`);
    return;
  }

  console.log(`[PayOS Webhook] Found payment id=${payment.id} status=${payment.status} source=${payment.source} rentalId=${payment.rentalId}`);

  if (payment.status === PaymentStatus.PAID) {
    console.log(`[PayOS Webhook] orderCode ${data.orderCode} already PAID — ignoring duplicate`);
    return;
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: PaymentStatus.PAID, paidAt: new Date() },
  });
  console.log(`[PayOS Webhook] Payment ${payment.id} marked PAID`);

  if (payment.rental.userId) {
    await createNotification({
      userId: payment.rental.userId,
      type: NotificationType.PAYMENT_SUCCESS,
      title: 'Thanh toán thành công',
      body: `Thanh toán thành công. Mã truy cập: ${payment.rental.code}.`,
      data: { rentalId: payment.rentalId },
    });
    await createNotification({
      userId: payment.rental.userId,
      type: NotificationType.RENTAL_STARTED,
      title: 'Rental started',
      body: `Your rental code is ${payment.rental.code}.`,
      data: { rentalId: payment.rentalId, compartmentId: payment.rental.compartmentId },
    });
  }

  if (payment.source === PaymentSource.KIOSK) {
    const cabinetId = payment.rental.compartment.cabinet.id;
    const mqttTopic = `smartbox/${cabinetId}/payment/${payment.orderCode}`;
    const mqttPayload = {
      orderCode: payment.orderCode,
      status: 'PAID',
      rentalId: payment.rentalId,
      code: payment.rental.code,
    };
    console.log(`[PayOS Webhook] Publishing MQTT → ${mqttTopic}`, mqttPayload);
    publishMqtt(mqttTopic, mqttPayload);
    console.log(`[PayOS Webhook] MQTT publish done`);
  } else {
    console.log(`[PayOS Webhook] source=${payment.source} — skipping MQTT publish`);
  }
}

// ---------------------------------------------------------------------------
// getPaymentStatus
// ---------------------------------------------------------------------------

export async function getPaymentStatus(orderCode: number) {
  const payment = await prisma.payment.findUnique({ where: { orderCode } });
  if (!payment) throw NotFoundError('Payment not found');
  return { orderCode: payment.orderCode, status: payment.status };
}

// ---------------------------------------------------------------------------
// getPaymentResult
// ---------------------------------------------------------------------------

export async function getPaymentResult(orderCode: number) {
  const payment = await prisma.payment.findUnique({
    where: { orderCode },
    include: {
      rental: {
        include: {
          compartment: { include: { cabinet: true } },
          pricePlan: true,
        },
      },
    },
  });
  if (!payment) throw NotFoundError('Payment not found');
  if (payment.status !== PaymentStatus.PAID) {
    throw BadRequestError('Payment not completed');
  }
  return {
    rentalId: payment.rentalId,
    pin: payment.rental.code,
    compartmentId: payment.rental.compartmentId,
    compartmentName: payment.rental.compartment.name,
    cabinetName: payment.rental.compartment.cabinet.name,
    expiresAt: payment.rental.expiresAt,
    qrData: payment.rental.qrToken,
  };
}

// ---------------------------------------------------------------------------
// cancelPendingPayment
// ---------------------------------------------------------------------------

export async function cancelPendingPayment(paymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { rental: true },
  });
  if (!payment || payment.status !== PaymentStatus.PENDING) return;

  if (payment.paymentLinkId) {
    try {
      await payos.paymentRequests.cancel(payment.paymentLinkId, 'Payment timeout');
    } catch (err) {
      console.warn(`[PaymentExpiry] Failed to cancel PayOS link ${payment.paymentLinkId}:`, err);
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.FAILED },
    });
    await tx.rental.update({
      where: { id: payment.rentalId },
      data: { status: 'CANCELLED' },
    });
    await tx.compartment.update({
      where: { id: payment.rental.compartmentId },
      data: { status: 'AVAILABLE' },
    });
  });
}

// ---------------------------------------------------------------------------
// confirmPaymentForTesting  — DEV ONLY
// Simulates a successful PayOS webhook without signature verification.
// Call POST /api/payments/test/confirm-paid { orderCode } from Postman/curl.
// ---------------------------------------------------------------------------

export async function confirmPaymentForTesting(orderCode: number) {
  console.log(`[TEST] confirmPaymentForTesting orderCode=${orderCode}`);

  const payment = await prisma.payment.findUnique({
    where: { orderCode },
    include: {
      rental: {
        include: {
          compartment: { include: { cabinet: true } },
          user: true,
        },
      },
    },
  });

  if (!payment) {
    throw NotFoundError(`Payment with orderCode ${orderCode} not found`);
  }

  console.log(`[TEST] Found payment id=${payment.id} status=${payment.status} source=${payment.source}`);

  if (payment.status === PaymentStatus.PAID) {
    console.log(`[TEST] Already PAID — re-publishing MQTT`);
  } else {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.PAID, paidAt: new Date() },
    });
    console.log(`[TEST] Payment marked PAID`);
  }

  const cabinetId = payment.rental.compartment.cabinet.id;
  const mqttTopic = `smartbox/${cabinetId}/payment/${payment.orderCode}`;
  const mqttPayload = {
    orderCode: payment.orderCode,
    status: 'PAID',
    rentalId: payment.rentalId,
    code: payment.rental.code,
  };
  console.log(`[TEST] Publishing MQTT → ${mqttTopic}`, mqttPayload);
  publishMqtt(mqttTopic, mqttPayload);

  return {
    orderCode: payment.orderCode,
    status: 'PAID',
    cabinetId,
    rentalId: payment.rentalId,
    mqttTopic,
  };
}
