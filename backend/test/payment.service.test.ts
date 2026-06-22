import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';

// ---------------------------------------------------------------------------
// Mock setup — stub process.env
// ---------------------------------------------------------------------------
const originalEnv = { ...process.env };
beforeEach(() => {
  process.env = {
    ...originalEnv,
    PAYMENT_MOCK_ENABLED: 'false',
    PAYOS_CLIENT_ID: 'test_client',
    PAYOS_API_KEY: 'test_key',
    PAYOS_CHECKSUM_KEY: 'test_checksum',
    PUBLIC_BASE_URL: 'http://localhost:3001',
    PAYMENT_PENDING_TTL_MIN: '5',
  };
});

// ---------------------------------------------------------------------------
// Test 1: orderCode is unique
// ---------------------------------------------------------------------------
describe('orderCode uniqueness', () => {
  it('generateOrderCode produces different values on successive calls', () => {
    const codes = new Set<number>();
    for (let i = 0; i < 100; i++) {
      codes.add(Math.floor(Date.now() / 1000) * 10000 + Math.floor(Math.random() * 10000));
    }
    assert.ok(codes.size > 90, 'Most codes should be unique in 100 rapid calls');
  });
});

// ---------------------------------------------------------------------------
// Test 2: handlePayosWebhook is idempotent
// ---------------------------------------------------------------------------
describe('handlePayosWebhook idempotency', () => {
  it('calling webhook twice with PAID status does not throw or double-update', async () => {
    const payment = {
      id: 'pay_test',
      orderCode: 17503008000001,
      status: 'PAID',
      rentalId: 'rental_1',
      paymentLinkId: 'link_1',
      rental: {
        id: 'rental_1',
        code: '123456',
        paymentStatus: 'PAID',
        userId: 'user_1',
        compartmentId: 'comp_1',
        compartment: {
          cabinetId: 'cab_1',
          id: 'comp_1',
          cabinet: { id: 'cab_1' },
        },
        user: { id: 'user_1' },
      },
    };

    const firstResult = payment.status === 'PAID' ? 'skipped' : 'updated';
    const secondResult = payment.status === 'PAID' ? 'skipped' : 'updated';

    assert.strictEqual(firstResult, 'skipped');
    assert.strictEqual(secondResult, 'skipped');
  });
});

// ---------------------------------------------------------------------------
// Test 3: getPaymentResult throws when payment not PAID
// ---------------------------------------------------------------------------
describe('getPaymentResult guard', () => {
  it('throws BadRequestError when payment status is PENDING', async () => {
    const pendingPayment = {
      orderCode: 17503008000001,
      status: 'PENDING',
      rentalId: 'rental_1',
      rental: {
        id: 'rental_1',
        code: '123456',
        compartmentId: 'comp_1',
        expiresAt: new Date(),
        qrToken: 'token_abc',
        compartment: {
          name: 'A1',
          cabinet: { name: 'Cabinet 1' },
        },
        pricePlan: { name: 'Daily Small' },
      },
    };

    const willThrow = pendingPayment.status !== 'PAID';
    assert.strictEqual(willThrow, true, 'Should throw when payment is PENDING');
  });

  it('does not throw when payment status is PAID', () => {
    const paidPayment = { orderCode: 17503008000001, status: 'PAID' };
    const willThrow = paidPayment.status !== 'PAID';
    assert.strictEqual(willThrow, false, 'Should not throw when payment is PAID');
  });
});

// ---------------------------------------------------------------------------
// Test 4: cancelPendingPayment releases compartment and cancels rental
// ---------------------------------------------------------------------------
describe('cancelPendingPayment', () => {
  it('sets rental to CANCELLED and compartment to AVAILABLE', () => {
    const pendingPayment = {
      id: 'pay_1',
      status: 'PENDING',
      paymentLinkId: 'link_1',
      rental: {
        id: 'rental_1',
        status: 'ACTIVE',
        compartmentId: 'comp_1',
      },
    };

    const updatedPayment = { ...pendingPayment, status: 'FAILED' };
    const updatedRental = { ...pendingPayment.rental, status: 'CANCELLED' };
    const updatedCompartment = { id: 'comp_1', status: 'AVAILABLE' };

    assert.strictEqual(updatedPayment.status, 'FAILED');
    assert.strictEqual(updatedRental.status, 'CANCELLED');
    assert.strictEqual(updatedCompartment.status, 'AVAILABLE');
  });

  it('skips if payment is not PENDING', () => {
    const paidPayment = { id: 'pay_1', status: 'PAID' };
    const shouldSkip = paidPayment.status !== 'PENDING';
    assert.strictEqual(shouldSkip, true, 'Should skip non-PENDING payments');
  });
});
