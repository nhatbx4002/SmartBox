import { JwtPayload } from 'jsonwebtoken';
export declare function signToken(payload: object, secret: string, expiresIn: string): string;
export declare function verifyToken(token: string, secret: string): JwtPayload;
//# sourceMappingURL=jwt.d.ts.map