import crypto from 'crypto';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PENDING_UUID_REGEX = /^pending-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

function getQrSecret(): string {
  const secret = process.env.QR_SECRET;
  if (!secret) {
    throw new Error('QR_SECRET is required');
  }
  return secret;
}

function packId(id: string): string {
  if (UUID_REGEX.test(id)) {
    const cleanHex = id.replace(/-/g, '');
    return 'u:' + Buffer.from(cleanHex, 'hex').toString('base64url');
  }
  const pendingMatch = id.match(PENDING_UUID_REGEX);
  if (pendingMatch) {
    const cleanHex = pendingMatch[1].replace(/-/g, '');
    return 'p:' + Buffer.from(cleanHex, 'hex').toString('base64url');
  }
  return id;
}

function unpackId(packed: string): string {
  if (packed.startsWith('u:')) {
    const base64 = packed.slice(2);
    const buf = Buffer.from(base64, 'base64url');
    if (buf.length === 16) {
      const hex = buf.toString('hex');
      return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20),
      ].join('-');
    }
  }
  if (packed.startsWith('p:')) {
    const base64 = packed.slice(2);
    const buf = Buffer.from(base64, 'base64url');
    if (buf.length === 16) {
      const hex = buf.toString('hex');
      const uuid = [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20),
      ].join('-');
      return `pending-${uuid}`;
    }
  }
  return packed;
}

function signPayload(payload: string): string {
  return crypto.createHmac('sha256', getQrSecret()).update(payload).digest('hex').substring(0, 10);
}

export function signQrToken(rentalId: string): string {
  const payload = packId(rentalId);
  const sig = signPayload(payload);
  return `${payload}.${sig}`;
}

export function verifyQrToken(token: string): { rentalId: string } | null {
  try {
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return null;

    const expected = signPayload(payload);
    const sigBuffer = Buffer.from(sig);
    const expectedBuffer = Buffer.from(expected);
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    const rentalId = unpackId(payload);
    if (!rentalId) return null;

    return { rentalId };
  } catch {
    return null;
  }
}
