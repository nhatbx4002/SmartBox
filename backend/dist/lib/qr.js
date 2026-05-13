"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signQrToken = signQrToken;
exports.verifyQrToken = verifyQrToken;
const crypto_1 = __importDefault(require("crypto"));
function getQrSecret() {
    const secret = process.env.QR_SECRET;
    if (!secret) {
        throw new Error('QR_SECRET is required');
    }
    return secret;
}
function signPayload(payload) {
    return crypto_1.default.createHmac('sha256', getQrSecret()).update(payload).digest('hex');
}
function signQrToken(rentalId, expiresAt) {
    const payload = Buffer.from(JSON.stringify({ rentalId, expiresAt: expiresAt.toISOString() })).toString('base64url');
    const sig = signPayload(payload);
    return `${payload}.${sig}`;
}
function verifyQrToken(token) {
    try {
        const [payload, sig] = token.split('.');
        if (!payload || !sig)
            return null;
        const expected = signPayload(payload);
        const sigBuffer = Buffer.from(sig);
        const expectedBuffer = Buffer.from(expected);
        if (sigBuffer.length !== expectedBuffer.length || !crypto_1.default.timingSafeEqual(sigBuffer, expectedBuffer)) {
            return null;
        }
        const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        if (!parsed.rentalId || !parsed.expiresAt)
            return null;
        const expiresAt = new Date(parsed.expiresAt);
        if (Number.isNaN(expiresAt.getTime()) || expiresAt < new Date())
            return null;
        return { rentalId: parsed.rentalId, expiresAt };
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=qr.js.map