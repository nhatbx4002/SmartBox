import * as bcrypt from 'bcrypt';
import {BadRequestError, NotFoundError, UnauthorizedError} from '../lib/errors'
import {signAccessToken, signRefreshToken, verifyRefreshToken , signResetPasswordToken , verifyResetPasswordToken} from '../lib/jwt'
import { prisma } from  '../lib/prisma'
import { UserStatus } from '../generated/prisma'


//---- OTP store -- ---
type OtpRecord = {
    otp: string;
    userId: string;
    expiresAt: number;
    requestedAt: number;
    attemptedCount: number;
};
const otpStore = new Map<string,OtpRecord>();
const OTP_TTL = 10*60*1000;
const MAX_ATTEMPTS = 3;

function cleanupExpiredOtp() {
    const now = Date.now();
    for(const [key,r] of otpStore){
        if(r.expiresAt <= now){ otpStore.delete(key); }
    }
}

//-- register
export async function register(phone: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing?.passwordHash) throw new BadRequestError('Số điện thoại đã được đăng ký');

    const passwordHash = await bcrypt.hash(password, 10);
    const select = { id: true, phone: true, name: true, email: true, status: true, createdAt: true } as const;

    const user = existing
        ? await prisma.user.update({ where: { phone }, data: { passwordHash, status: UserStatus.ACTIVE }, select })
        : await prisma.user.create({ data: { phone, passwordHash, status: UserStatus.ACTIVE }, select });

    const payload = { sub: user.id, phone: user.phone, role: 'USER' };
    return {
        user,
        accessToken: signAccessToken(payload),
        refreshToken: signRefreshToken(payload),
    };
}

// ----- login -----
export async function login(phone: string, password: string){
    const user = await prisma.user.findUnique({where: {phone}});
    if(!user) throw new BadRequestError("Invalid phone or password!");
    if (!user.passwordHash) {
        throw new UnauthorizedError('Invalid phone or password!');
    }

    const valid = await bcrypt.compare(password,user.passwordHash);
    if(!valid) throw new UnauthorizedError('Invalid phone or password!');

    const payload = {sub: user.id, phone: user.phone, role: 'USER'};
    return {
        user: {
            id: user.id,
            phone: user.phone,
            name: user.name,
            email: user.email,
            status: user.status,
        },
        accessToken: signAccessToken(payload),
        refreshToken: signRefreshToken(payload),
    }
}

//------- refresh token ----
export async function refreshUserToken(token:string){
    const payload = verifyRefreshToken(token);
    if(!payload.sub) throw new UnauthorizedError('Invalid refresh token!');

    const user = await prisma.user.findUnique({where: {id: String(payload.sub)}});
    if(!user) throw new UnauthorizedError('User not found!');

    return {
        accessToken: signAccessToken({sub: user.id, phone: user.phone , role: 'USER'})
    }
}


//---- get profile---------
export async function getProfile(userId:string){
    const user = await prisma.user.findUnique({
        where: {id: userId},
        select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            status: true,
            createdAt: true,
        }
    })

    if(!user) throw new NotFoundError('User not found!');
    return user;
}


//---- update profile -----
export async function updateProfile(userId: string, data: { name?: string; email?: string; password?: string }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User not found!');

    if (data.email && data.email !== user.email) {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) throw new BadRequestError('Email already in use!');
    }

    const updateData: Record<string, unknown> = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.passwordHash = await bcrypt.hash(data.password, 10);

    return prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: { id: true, phone: true, name: true, email: true, status: true },
    });
}

//---- register device -----
export async function registerDevice(userId:string, fcmToken:string){
    return prisma.user.update({
        where: {id: userId},
        data: {
            fcmToken,
        },
        select: {
            id: true,
            phone: true,
            fcmToken: true,
        }
    });
}

// ------forgot password ------
export async function sendForgotPasswordOtp(phone: string) {
    cleanupExpiredOtp();

    const user = await prisma.user.findUnique({ where: { phone } }
    );
    if (!user) throw new NotFoundError('Phone not registered');

    const existing = otpStore.get(phone);
    if (existing && Date.now() - existing.requestedAt < 60_000) {
        const wait = Math.ceil((60_000 - (Date.now() - existing.
            requestedAt)) / 1000);
        throw new BadRequestError(`Please wait ${wait}s before requesting another OTP`);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).
    toString();
    otpStore.set(phone, { otp, userId: user.id, expiresAt: Date.
        now() + OTP_TTL, requestedAt: Date.now(), attemptedCount: 0 });

        console.log(`[OTP] Phone: ${phone}, OTP: ${otp}`);

    return { ok: true };
}


//---- verify OTP ---
export async function verifyOTP(phone: string , otp: string) {
    cleanupExpiredOtp();

    const record = otpStore.get(phone);
    if(!record) throw new NotFoundError('No OTP requested for this phone!');
    if(record.expiresAt < Date.now() ){
        otpStore.delete(phone);
        throw new BadRequestError('OTP has expired. Please request a new one!')
    }

    if(record.attemptedCount >= MAX_ATTEMPTS){
        otpStore.delete(phone);
        throw new BadRequestError('Too many failed attempts. Please request a new OTP!');
    }

    if(record.otp !== otp){
        record.attemptedCount++;
        throw new UnauthorizedError(`Invalid OTP. ${MAX_ATTEMPTS - record.attemptedCount} attempts remaining!`);
    }

    otpStore.delete(phone);
    const resetToken = signResetPasswordToken({sub: record.userId , email: '' , role: 'USER'});
    return {resetToken};
}


//------------ reset password ------
export async function resetPassword(token: string, newPassword: string) {
    const payload = verifyResetPasswordToken(token);
    if(!payload.sub) throw new UnauthorizedError('Invalid reset token!');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({where : {id : String(payload.sub)}, data: {passwordHash}});
    return {ok: true};
}

