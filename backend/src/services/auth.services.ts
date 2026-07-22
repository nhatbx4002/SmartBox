import * as bcrypt from 'bcrypt'
import {UnauthorizedError} from '../lib/errors'
import {signAccessToken,signRefreshToken,verifyRefreshToken} from '../lib/jwt'
import {prisma} from '../lib/prisma'

export async function adminLogin(email: string, password: string) {
    const admin = await prisma.admin.findUnique({where : {email}});
    if(!admin) throw new UnauthorizedError('Invalid Email or Password!');

    const valid = await bcrypt.compare(password,admin.passwordHash);
    if(!valid) throw new UnauthorizedError('Invalid Password!');

    const payload = {sub: admin.id, email: admin.email, role: admin.role};
    return {
        admin: {id: admin.id, email: admin.email, name: admin.name, role: admin.role},
        accessToken: signAccessToken(payload),
        refreshToken: signRefreshToken(payload),
    };
}

export async function refreshToken(token: string) {
    const payload = verifyRefreshToken(token);
    if(!payload.sub || !payload.email || !payload.role) throw new UnauthorizedError('Invalid Refresh Token!');
    return {
        accessToken: signAccessToken({sub: String(payload.sub), email: String(payload.email), role: String(payload.role)}),
    }
}

