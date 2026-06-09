import bcrypt from 'bcrypt';
import { UserStatus } from '../generated/prisma';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../lib/errors';
import { signToken, verifyToken } from '../lib/jwt';
import { prisma } from '../lib/prisma';

type UserProfile = {
  id: string;
  phone: string;
  email: string | null;
  name: string | null;
  status: UserStatus;
};

type OtpRecord = {
  otp: string;
  userId: string;
  expiresAt: number;
  requestedAt: number;
  attemptCount: number;
};

const otpStore = new Map<string, OtpRecord>();
const OTP_TTL_MS = 10 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 3;
const DUMMY_PASSWORD_HASH = bcrypt.hashSync('__smartbox_user_login_dummy__', 10);

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function toUserProfile(user: {
  id: string;
  phone: string;
  email: string | null;
  name: string | null;
  status: UserStatus;
}): UserProfile {
  return {
    id: user.id,
    phone: user.phone,
    email: user.email,
    name: user.name,
    status: user.status,
  };
}

function cleanupExpiredOtps() {
  const now = Date.now();
  for (const [phone, record] of otpStore.entries()) {
    if (record.expiresAt <= now) {
      otpStore.delete(phone);
    }
  }
}

function buildUserTokenPayload(user: { id: string; phone: string; email: string | null }) {
  return {
    sub: user.id,
    phone: user.phone,
    email: user.email,
  };
}

export async function userRegister(phone: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) throw BadRequestError('Phone number already registered');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { phone, passwordHash, status: UserStatus.ACTIVE },
  });

  const payload = buildUserTokenPayload(user);
  return {
    user: toUserProfile(user),
    accessToken: signToken(payload, requireEnv('JWT_SECRET'), process.env.JWT_EXPIRES_IN || '15m'),
    refreshToken: signToken(payload, requireEnv('JWT_REFRESH_SECRET'), process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
  };
}

export async function userLogin(phone: string, password: string) {
  const user = await prisma.user.findUnique({ where: { phone } });
  const storedHash = user?.passwordHash ?? DUMMY_PASSWORD_HASH;
  const valid = await bcrypt.compare(password, storedHash);

  if (!user || !valid) throw UnauthorizedError('Invalid phone or password');
  if (!user.passwordHash) throw UnauthorizedError('Account not set up. Please register first.');

  const payload = buildUserTokenPayload(user);
  return {
    user: toUserProfile(user),
    accessToken: signToken(payload, requireEnv('JWT_SECRET'), process.env.JWT_EXPIRES_IN || '15m'),
    refreshToken: signToken(payload, requireEnv('JWT_REFRESH_SECRET'), process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
  };
}

export async function refreshUserToken(refreshTokenValue: string) {
  const payload = verifyToken(refreshTokenValue, requireEnv('JWT_REFRESH_SECRET'));
  if (!payload.sub) throw UnauthorizedError('Invalid refresh token');

  return {
    accessToken: signToken(
      {
        sub: String(payload.sub),
        phone: payload.phone ? String(payload.phone) : undefined,
        email: payload.email ? String(payload.email) : undefined,
      },
      requireEnv('JWT_SECRET'),
      process.env.JWT_EXPIRES_IN || '15m',
    ),
  };
}

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw NotFoundError('User not found');
  return toUserProfile(user);
}

export async function updateUserProfile(
  userId: string,
  input: { name?: string; email?: string | ''; password?: string },
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw NotFoundError('User not found');

  const updateData: { name?: string; email?: string | null; passwordHash?: string } = {};
  if (input.name !== undefined) updateData.name = input.name;

  if (input.email !== undefined) {
    const normalizedEmail = input.email.trim();
    if (normalizedEmail) {
      const existing = await prisma.user.findFirst({
        where: { email: normalizedEmail, id: { not: userId } },
      });
      if (existing) throw BadRequestError('Email already in use');
      updateData.email = normalizedEmail;
    } else {
      updateData.email = null;
    }
  }

  if (input.password !== undefined) {
    updateData.passwordHash = await bcrypt.hash(input.password, 10);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return toUserProfile(updated);
}

export async function registerFcmToken(userId: string, fcmToken: string) {
  await prisma.user.update({ where: { id: userId }, data: { fcmToken } as never });
  return { ok: true };
}

export async function sendForgotPasswordOtp(phone: string) {
  cleanupExpiredOtps();

  const existing = otpStore.get(phone);
  if (existing && Date.now() - existing.requestedAt < RATE_LIMIT_WINDOW_MS) {
    const timeLeft = Math.ceil((RATE_LIMIT_WINDOW_MS - (Date.now() - existing.requestedAt)) / 1000);
    throw BadRequestError(`Please wait ${timeLeft}s before requesting another OTP`);
  }

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) return { ok: true };

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const now = Date.now();
  otpStore.set(phone, {
    otp,
    userId: user.id,
    expiresAt: now + OTP_TTL_MS,
    requestedAt: now,
    attemptCount: 0,
  });

  console.log(`[OTP] Phone: ${phone}, OTP: ${otp}`);

  return { ok: true };
}

export async function verifyOtp(phone: string, otp: string) {
  cleanupExpiredOtps();

  const record = otpStore.get(phone);
  if (!record) throw BadRequestError('No OTP requested for this phone');
  if (record.expiresAt < Date.now()) {
    otpStore.delete(phone);
    throw BadRequestError('OTP has expired. Please request a new one.');
  }

  if (record.attemptCount >= MAX_OTP_ATTEMPTS) {
    otpStore.delete(phone);
    throw BadRequestError('Too many failed attempts. Please request a new OTP.');
  }

  if (record.otp !== otp) {
    record.attemptCount += 1;
    const remaining = MAX_OTP_ATTEMPTS - record.attemptCount;
    throw UnauthorizedError(`Invalid OTP. ${remaining} attempt(s) remaining.`);
  }

  // Consume OTP — generate a short-lived reset token
  otpStore.delete(phone);
  const resetToken = signToken(
    { sub: record.userId, phone },
    requireEnv('JWT_SECRET'),
    '5m',
  );

  return { resetToken };
}

export async function resetPasswordWithOtp(token: string, newPassword: string) {
  const payload = verifyToken(token, requireEnv('JWT_SECRET'));
  const userId = payload.sub as string;
  if (!userId) throw UnauthorizedError('Invalid reset token');

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  return { ok: true };
}

export { cleanupExpiredOtps };
