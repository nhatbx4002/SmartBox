import assert from 'node:assert/strict';
import test from 'node:test';
import { signToken } from '../src/lib/jwt';
import { authenticateSocketHandshake, extractSocketToken } from '../src/lib/socket';

const secret = 'socket-test-secret';

function tokenFor(role: string) {
  return signToken({ sub: 'admin-1', email: 'admin@example.com', role }, secret, '15m');
}

test('extractSocketToken reads socket auth token before authorization header', () => {
  const token = extractSocketToken({
    auth: { token: 'auth-token' },
    headers: { authorization: 'Bearer header-token' },
  });

  assert.equal(token, 'auth-token');
});

test('extractSocketToken falls back to bearer authorization header', () => {
  const token = extractSocketToken({
    auth: {},
    headers: { authorization: 'Bearer header-token' },
  });

  assert.equal(token, 'header-token');
});

test('authenticateSocketHandshake accepts current admin roles', () => {
  for (const role of ['SUPER_ADMIN', 'CABINET_ADMIN']) {
    const admin = authenticateSocketHandshake(
      { auth: { token: tokenFor(role) }, headers: {} },
      secret,
    );

    assert.equal(admin.id, 'admin-1');
    assert.equal(admin.email, 'admin@example.com');
    assert.equal(admin.role, role);
  }
});

test('authenticateSocketHandshake rejects missing token and non-admin role', () => {
  assert.throws(
    () => authenticateSocketHandshake({ auth: {}, headers: {} }, secret),
    /Unauthorized/,
  );
  assert.throws(
    () => authenticateSocketHandshake({ auth: { token: tokenFor('USER') }, headers: {} }, secret),
    /Unauthorized/,
  );
});
