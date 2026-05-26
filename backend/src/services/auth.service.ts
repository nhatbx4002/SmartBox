import bcrypt from 'bcrypt';
import { RentalStatus } from '../generated/prisma';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../lib/errors';
import { signToken, verifyToken } from '../lib/jwt';
import { prisma } from '../lib/prisma';

export async function adminLogin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) throw UnauthorizedError('Invalid email or password');

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) throw UnauthorizedError('Invalid email or password');

  const payload = { sub: admin.id, email: admin.email, role: admin.role };
  return {
    admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    accessToken: signToken(payload, requireEnv('JWT_SECRET'), process.env.JWT_EXPIRES_IN || '15m'),
    refreshToken: signToken(payload, requireEnv('JWT_REFRESH_SECRET'), process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
  };
}

export async function refreshToken(refreshTokenValue: string) {
  const payload = verifyToken(refreshTokenValue, requireEnv('JWT_REFRESH_SECRET'));
  if (!payload.sub || !payload.email || !payload.role) {
    throw UnauthorizedError('Invalid refresh token');
  }

  return {
    accessToken: signToken(
      { sub: payload.sub, email: payload.email, role: payload.role },
      requireEnv('JWT_SECRET'),
      process.env.JWT_EXPIRES_IN || '15m',
    ),
  };
}

export async function verifyPin(code: string) {
  const rental = await prisma.rental.findUnique({
    where: { code },
    include: { compartment: { include: { cabinet: true, realtimeStatus: true } }, pricePlan: true, user: true },
  });

  if (!rental || rental.status !== RentalStatus.ACTIVE) {
    throw NotFoundError('Rental not found');
  }

  const hashMatches = await bcrypt.compare(code, rental.codeHash);
  if (!hashMatches) throw UnauthorizedError('Invalid code');

  if (rental.expiresAt < new Date()) {
    throw BadRequestError('Rental expired');
  }

  if (rental.openCount >= rental.maxOpens) {
    throw BadRequestError('Open limit reached');
  }

  return { authorized: true, rental, compartment: rental.compartment };
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}
