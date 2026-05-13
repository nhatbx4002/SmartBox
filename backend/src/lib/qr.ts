import crypto from 'crypto';

type QrPayload = {
  rentalId: string;
  expiresAt: string;
};

function getQrSecret(): string {
  const secret = process.env.QR_SECRET;
  if (!secret) {
    throw new Error('QR_SECRET is required');
  }
  return secret;
}

function signPayload(payload: string): string {
  return crypto.createHmac('sha256', getQrSecret()).update(payload).digest('hex');
}

export function signQrToken(rentalId: string, expiresAt: Date): string {
  const payload = Buffer.from(
    JSON.stringify({ rentalId, expiresAt: expiresAt.toISOString() } satisfies QrPayload),
  ).toString('base64url');
  const sig = signPayload(payload);
  return `${payload}.${sig}`;
}

export function verifyQrToken(token: string): { rentalId: string; expiresAt: Date } | null {
  try {
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return null;

    const expected = signPayload(payload);
    const sigBuffer = Buffer.from(sig);
    const expectedBuffer = Buffer.from(expected);
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as QrPayload;
    if (!parsed.rentalId || !parsed.expiresAt) return null;

    const expiresAt = new Date(parsed.expiresAt);
    if (Number.isNaN(expiresAt.getTime()) || expiresAt < new Date()) return null;

    return { rentalId: parsed.rentalId, expiresAt };
  } catch {
    return null;
  }
}
