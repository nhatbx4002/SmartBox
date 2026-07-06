import jwt, {JwtPayload , SignOptions } from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-token';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-token';
const CABINET_SECRET = process.env.JWT_CABINET_SECRET || 'cabinet-token';

export function signAccessToken(payload: {
    sub: string;
    email?: string;
    phone?: string;
    role?: string;
}): string {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1h' });
}
export function signRefreshToken (payload: {sub:string }):string {
    return jwt.sign(payload, REFRESH_SECRET , {expiresIn: '7d'});
}

export function verifyAccessToken(token: string):JwtPayload{
    return jwt.verify(token,ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload{
    return jwt.verify(token,REFRESH_SECRET) as JwtPayload;
}

export function signCabinetToken(payload: {cabinetId:string}):string {
    return jwt.sign(payload,CABINET_SECRET,{expiresIn: '365d'});
}

export function verifyCabinetToken(token: string): JwtPayload {
    return jwt.verify(token, CABINET_SECRET) as JwtPayload;
}

export function signResetPasswordToken(payload: object) {
    return jwt.sign(payload, process.env.JWT_RESET_SECRET!, {
        expiresIn: '10m',
    });
}

export function verifyResetPasswordToken(token: string) {
    return jwt.verify(token, process.env.JWT_RESET_SECRET!) as JwtPayload;
}