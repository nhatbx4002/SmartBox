import assert from 'node:assert/strict';
import test from 'node:test';
import { signToken } from '../src/lib/jwt';
import { requireUser } from '../src/middleware/requireUser';

test('requireUser attaches the authenticated user to the request', () => {
  process.env.JWT_SECRET = 'user-test-secret';
  const token = signToken(
    { sub: 'user-1', phone: '0909123456', email: 'user@example.com' },
    process.env.JWT_SECRET,
    '15m',
  );

  const req = {
    headers: { authorization: `Bearer ${token}` },
  } as never;
  const res = {} as never;
  let nextArg: unknown;

  requireUser(req, res, (value?: unknown) => {
    nextArg = value;
  });

  assert.equal(nextArg, undefined);
  assert.deepEqual((req as { user?: unknown }).user, {
    id: 'user-1',
    phone: '0909123456',
    email: 'user@example.com',
  });
});
