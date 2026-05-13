export declare function signQrToken(rentalId: string, expiresAt: Date): string;
export declare function verifyQrToken(token: string): {
    rentalId: string;
    expiresAt: Date;
} | null;
//# sourceMappingURL=qr.d.ts.map