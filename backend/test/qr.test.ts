import assert from 'node:assert/strict';
import test from 'node:test';
import { signQrToken, verifyQrToken } from '../src/lib/qr';

test('verifies a QR token round-trip', () => {
  process.env.QR_SECRET = 'test-secret';

  const token = signQrToken('rental-1');
  const result = verifyQrToken(token);

  assert.deepEqual(result, { rentalId: 'rental-1' });
});

test('verifies a QR token round-trip with a UUID', () => {
  process.env.QR_SECRET = 'test-secret';
  const uuid = 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6';

  const token = signQrToken(uuid);
  assert.match(token, /^u:[A-Za-z0-9_-]{22}\.[A-Za-z0-9]{10}$/);

  const result = verifyQrToken(token);
  assert.deepEqual(result, { rentalId: uuid });
});

test('verifies a QR token round-trip with a pending UUID', () => {
  process.env.QR_SECRET = 'test-secret';
  const pendingId = 'pending-f81d4fae-7dec-11d0-a765-00a0c91e6bf6';

  const token = signQrToken(pendingId);
  assert.match(token, /^p:[A-Za-z0-9_-]{22}\.[A-Za-z0-9]{10}$/);

  const result = verifyQrToken(token);
  assert.deepEqual(result, { rentalId: pendingId });
});

test('rejects a tampered QR token', () => {
  process.env.QR_SECRET = 'test-secret';
  const token = signQrToken('rental-1');
  const [payload, sig] = token.split('.');
  const tamperedToken = `${payload}x.${sig}`;

  assert.equal(verifyQrToken(tamperedToken), null);
});
