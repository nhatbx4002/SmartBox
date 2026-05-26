import assert from 'node:assert/strict';
import test from 'node:test';
import { signQrToken, verifyQrToken } from '../src/lib/qr';

test('verifies a QR token whose ISO expiry contains colon characters', () => {
  process.env.QR_SECRET = 'test-secret';
  const expiresAt = new Date(Date.now() + 60_000);

  const token = signQrToken('rental-1', expiresAt);
  const result = verifyQrToken(token);

  assert.deepEqual(result, { rentalId: 'rental-1', expiresAt });
});

test('rejects an expired QR token', () => {
  process.env.QR_SECRET = 'test-secret';
  const token = signQrToken('rental-1', new Date(Date.now() - 60_000));

  assert.equal(verifyQrToken(token), null);
});
