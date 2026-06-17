import assert from 'node:assert/strict';
import test from 'node:test';
import { RentalStatus } from '../src/generated/prisma';
import { signQrToken } from '../src/lib/qr';
import { prisma } from '../src/lib/prisma';
import { verifyQrRental } from '../src/services/rental.service';

test('verifyQrRental returns active rental data for a valid QR token', async (t) => {
  process.env.QR_SECRET = 'test-secret';
  const expiresAt = new Date(Date.now() + 60_000);
  const token = signQrToken('rental-qr-1');
  const rental = {
    id: 'rental-qr-1',
    status: RentalStatus.ACTIVE,
    expiresAt,
    openCount: 0,
    maxOpens: 2,
    compartment: {
      id: 'compartment-a1',
      name: 'A1',
      size: 'SMALL',
      cabinet: { id: 'cabinet-a', name: 'Tu A' },
      realtimeStatus: null,
    },
    pricePlan: { id: 'small-1-day', name: '1 ngay' },
    user: { id: 'user-1', phone: '0909123456' },
  };

  const originalFindUnique = prisma.rental.findUnique;
  t.after(() => {
    (prisma.rental.findUnique as unknown) = originalFindUnique;
  });

  (prisma.rental.findUnique as unknown) = async (args: { where?: { id?: string } }) => {
    assert.equal(args.where?.id, 'rental-qr-1');
    return rental as never;
  };

  const result = await verifyQrRental(token);

  assert.equal(result.authorized, true);
  assert.equal(result.rental.id, 'rental-qr-1');
  assert.equal(result.compartment.id, 'compartment-a1');
});

test('verifyQrRental rejects a QR token with an invalid signature', async () => {
  process.env.QR_SECRET = 'test-secret';

  await assert.rejects(
    () => verifyQrRental('not-a-valid-token'),
    /Invalid QR code/,
  );
});
