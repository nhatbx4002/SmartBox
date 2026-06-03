import assert from 'node:assert/strict';
import test from 'node:test';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserStatus } from '../src/generated/prisma';
import { prisma } from '../src/lib/prisma';
import { signToken } from '../src/lib/jwt';
import {
  getUserProfile,
  refreshUserToken,
  registerFcmToken,
  resetPasswordWithOtp,
  sendForgotPasswordOtp,
  updateUserProfile,
  userLogin,
  userRegister,
} from '../src/services/user.service';

test('userRegister creates a user and returns signed tokens', async (t) => {
  process.env.JWT_SECRET = 'user-test-secret';
  process.env.JWT_REFRESH_SECRET = 'user-test-refresh-secret';

  const originals = {
    findUnique: prisma.user.findUnique,
    create: prisma.user.create,
    hash: bcrypt.hash,
  };

  t.after(() => {
    (prisma.user.findUnique as unknown) = originals.findUnique;
    (prisma.user.create as unknown) = originals.create;
    (bcrypt.hash as unknown) = originals.hash;
  });

  const createCalls: unknown[] = [];
  (prisma.user.findUnique as unknown) = async () => null;
  (prisma.user.create as unknown) = async (args: unknown) => {
    createCalls.push(args);
    return {
      id: 'user-1',
      phone: '0909123456',
      email: null,
      name: null,
      status: UserStatus.ACTIVE,
    };
  };
  (bcrypt.hash as unknown) = async () => 'hashed-password';

  const result = await userRegister('0909123456', 'secret123');

  assert.deepEqual(createCalls[0], {
    data: {
      phone: '0909123456',
      passwordHash: 'hashed-password',
      status: UserStatus.ACTIVE,
    },
  });
  assert.deepEqual(result.user, {
    id: 'user-1',
    phone: '0909123456',
    email: null,
    name: null,
    status: UserStatus.ACTIVE,
  });
  assert.equal(typeof result.accessToken, 'string');
  assert.equal(typeof result.refreshToken, 'string');
  assert.equal((jwt.decode(result.accessToken) as jwt.JwtPayload)?.sub, 'user-1');
});

test('userLogin returns tokens for a valid user password pair', async (t) => {
  process.env.JWT_SECRET = 'user-test-secret';
  process.env.JWT_REFRESH_SECRET = 'user-test-refresh-secret';

  const originals = {
    findUnique: prisma.user.findUnique,
    compare: bcrypt.compare,
  };

  t.after(() => {
    (prisma.user.findUnique as unknown) = originals.findUnique;
    (bcrypt.compare as unknown) = originals.compare;
  });

  (prisma.user.findUnique as unknown) = async () => ({
    id: 'user-1',
    phone: '0909123456',
    email: 'user@example.com',
    name: 'User One',
    status: UserStatus.ACTIVE,
    passwordHash: 'stored-hash',
  });
  (bcrypt.compare as unknown) = async () => true;

  const result = await userLogin('0909123456', 'secret123');

  assert.equal(result.user.id, 'user-1');
  assert.equal((jwt.decode(result.accessToken) as jwt.JwtPayload)?.phone, '0909123456');
  assert.equal((jwt.decode(result.refreshToken) as jwt.JwtPayload)?.sub, 'user-1');
});

test('refreshUserToken signs a new access token from the refresh payload', async (t) => {
  process.env.JWT_SECRET = 'user-test-secret';
  process.env.JWT_REFRESH_SECRET = 'user-test-refresh-secret';

  const refreshToken = signToken(
    { sub: 'user-1', phone: '0909123456', email: 'user@example.com' },
    process.env.JWT_REFRESH_SECRET,
    '7d',
  );
  const result = await refreshUserToken(refreshToken);

  assert.equal((jwt.decode(result.accessToken) as jwt.JwtPayload)?.sub, 'user-1');
  assert.equal((jwt.decode(result.accessToken) as jwt.JwtPayload)?.phone, '0909123456');
});

test('getUserProfile returns a user profile by id', async (t) => {
  const original = prisma.user.findUnique;
  t.after(() => {
    (prisma.user.findUnique as unknown) = original;
  });

  (prisma.user.findUnique as unknown) = async () => ({
    id: 'user-1',
    phone: '0909123456',
    email: 'user@example.com',
    name: 'User One',
    status: UserStatus.ACTIVE,
  });

  const profile = await getUserProfile('user-1');

  assert.deepEqual(profile, {
    id: 'user-1',
    phone: '0909123456',
    email: 'user@example.com',
    name: 'User One',
    status: UserStatus.ACTIVE,
  });
});

test('updateUserProfile updates the requested fields', async (t) => {
  process.env.JWT_SECRET = 'user-test-secret';

  const originals = {
    findUnique: prisma.user.findUnique,
    findFirst: prisma.user.findFirst,
    update: prisma.user.update,
  };

  t.after(() => {
    (prisma.user.findUnique as unknown) = originals.findUnique;
    (prisma.user.findFirst as unknown) = originals.findFirst;
    (prisma.user.update as unknown) = originals.update;
  });

  const updateCalls: unknown[] = [];
  (prisma.user.findUnique as unknown) = async () => ({
    id: 'user-1',
    phone: '0909123456',
    email: 'user@example.com',
    name: 'User One',
    status: UserStatus.ACTIVE,
  });
  (prisma.user.findFirst as unknown) = async () => null;
  (prisma.user.update as unknown) = async (args: unknown) => {
    updateCalls.push(args);
    return {
      id: 'user-1',
      phone: '0909123456',
      email: null,
      name: 'Updated Name',
      status: UserStatus.ACTIVE,
    };
  };

  const profile = await updateUserProfile('user-1', {
    name: 'Updated Name',
    email: '',
    password: 'new-secret',
  });

  const updateArgs = updateCalls[0] as {
    where: { id: string };
    data: { name?: string; email?: string | null; passwordHash?: string };
  };
  assert.deepEqual(updateCalls[0], {
    where: { id: 'user-1' },
    data: {
      name: 'Updated Name',
      email: null,
      passwordHash: updateArgs.data.passwordHash,
    },
  });
  assert.equal(profile.name, 'Updated Name');
  assert.equal(profile.email, null);
});

test('registerFcmToken stores the push token on the user record', async (t) => {
  const original = prisma.user.update;
  t.after(() => {
    (prisma.user.update as unknown) = original;
  });

  const updateCalls: unknown[] = [];
  (prisma.user.update as unknown) = async (args: unknown) => {
    updateCalls.push(args);
    return { id: 'user-1' };
  };

  const result = await registerFcmToken('user-1', 'fcm-token-1');

  assert.deepEqual(updateCalls[0], {
    where: { id: 'user-1' },
    data: { fcmToken: 'fcm-token-1' },
  });
  assert.deepEqual(result, { ok: true });
});

test('forgot and reset password flow uses a one-time OTP', async (t) => {
  process.env.JWT_SECRET = 'user-test-secret';

  const originals = {
    findUnique: prisma.user.findUnique,
    update: prisma.user.update,
    log: console.log,
    random: Math.random,
  };

  t.after(() => {
    (prisma.user.findUnique as unknown) = originals.findUnique;
    (prisma.user.update as unknown) = originals.update;
    console.log = originals.log;
    Math.random = originals.random;
  });

  const logLines: string[] = [];
  (prisma.user.findUnique as unknown) = async () => ({
    id: 'user-otp-1',
    phone: '0909555666',
    email: 'otp@example.com',
    name: 'OTP User',
    status: UserStatus.ACTIVE,
  });
  (prisma.user.update as unknown) = async (args: unknown) => args as never;
  console.log = ((...args: unknown[]) => {
    logLines.push(args.map(String).join(' '));
  }) as never;
  Math.random = () => 0.123456;

  const forgot = await sendForgotPasswordOtp('0909555666');
  const otpMatch = logLines.join('\n').match(/OTP: (\d{6})/);

  assert.deepEqual(forgot, { ok: true });
  assert.ok(otpMatch);

  const otp = otpMatch?.[1];
  if (!otp) throw new Error('OTP missing');

  const reset = await resetPasswordWithOtp('0909555666', otp, 'new-secret');

  assert.deepEqual(reset, { ok: true });
});
