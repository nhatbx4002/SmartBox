/**
 * @openapi
 * /api/users/register:
 *   post:
 *     tags: [Users]
 *     summary: Register new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: User + tokens
 *
 * /api/users/login:
 *   post:
 *     tags: [Users]
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: User + tokens
 *
 * /api/users/refresh:
 *   post:
 *     tags: [Users]
 *     summary: Refresh user access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: New access token
 *
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: User profile
 *   put:
 *     tags: [Users]
 *     summary: Update user profile
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Updated user
 *
 * /api/users/me/devices:
 *   post:
 *     tags: [Users]
 *     summary: Register FCM device token
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fcmToken: { type: string }
 *     responses:
 *       200:
 *         description: Device token saved
 *
 * /api/users/forgot-password:
 *   post:
 *     tags: [Users]
 *     summary: Send OTP to phone for password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone: { type: string }
 *     responses:
 *       200:
 *         description: OTP sent
 *
 * /api/users/verify-otp:
 *   post:
 *     tags: [Users]
 *     summary: Verify OTP and get reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone: { type: string }
 *               code: { type: string }
 *     responses:
 *       200:
 *         description: Reset token
 *
 * /api/users/reset-password:
 *   post:
 *     tags: [Users]
 *     summary: Reset password using reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Password reset
 * /api/users/me/rent:
 *   post:
 *     tags: [Users]
 *     summary: Create a rental (app flow)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [size, planId, cabinetId]
 *             properties:
 *               size: { type: string, enum: [SMALL, LARGE] }
 *               planId: { type: string }
 *               cabinetId: { type: string }
 *     responses:
 *       201:
 *         description: Rental created
 */

import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { requireUser } from '../middleware/auth';
import * as userService from '../services/user.services';
import * as rentalService from '../services/rental.services';
import { CompartmentSize } from '../generated/prisma';

const router = Router();

const registerSchema = z.object({
    phone: z.string().min(10),
    password: z.string().min(6),
});
const loginSchema = z.object({
    phone: z.string().min(10),
    password: z.string().min(6),
});
const refreshSchema = z.object({
    refreshToken: z.string().min(1),
});
const updateProfileSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
});
const deviceSchema = z.object({
    fcmToken: z.string().min(1),
})
const forgotPwdSchema = z.object({
    phone: z.string().min(10),
});
const verifyOtpSchema = z.object({
    phone: z.string().min(10),
    code: z.string().length(6),
})
const resetPwdSchema = z.object({
    token: z.string().min(1),
    newPassword: z.string().min(6),
})

const rentSchema = z.object({
    size: z.nativeEnum(CompartmentSize),
    planId: z.string().min(1),
    cabinetId: z.string().min(1),
});

router.post(
    '/register',
    validate(registerSchema),
    asyncHandler(async (req, res) => {
        const result = await userService.register(req.body.phone, req.body.password);
        res.status(201).json({data: result});
    })
)

router.post(
    '/login',
    validate(loginSchema),
    asyncHandler(async (req, res) => {
        const result = await userService.login(req.body.phone, req.body.password);
        res.json({data: result});
    })
)

router.post(
    '/refresh',
    validate(refreshSchema),
    asyncHandler(async (req, res) => {
        const result = await userService.refreshUserToken(req.body.refreshToken);
        res.json({data: result});
    })
)

router.get(
    '/me',
    requireUser,
    asyncHandler(async (req, res) => {
        const user = await userService.getProfile(req.user!.id);
        res.json({ data: user });
    })
)

router.put(
    '/me',
    requireUser,
    validate(updateProfileSchema),
    asyncHandler(async (req, res) => {
        const user = await userService.updateProfile(req.user!.id, req.body);
        res.json({data: user});
    })
)

router.post(
    '/me/devices',
    requireUser,
    validate(deviceSchema),
    asyncHandler(async (req, res) => {
        await userService.registerDevice(req.user!.id, req.body.fcmToken);
        res.json({ data: { ok: true } });
    })
)

router.post(
    '/forgot-password',
    validate(forgotPwdSchema),
    asyncHandler(async (req, res) => {
        await userService.sendForgotPasswordOtp(req.body.phone);
        res.json({data: {ok:true}});
    })
)

router.post(
    '/verify-otp',
    validate(verifyOtpSchema),
    asyncHandler(async (req, res) => {
        const result = await userService.verifyOTP(req.body.phone, req.body.code);
        res.json({data: result});
    })
)

router.post(
    '/reset-password',
    validate(resetPwdSchema),
    asyncHandler(async (req, res) => {
        await userService.resetPassword(req.body.token, req.body.newPassword);
        res.json({data: {ok: true}})
    })
)

router.post(
    '/me/rent',
    requireUser,
    validate(rentSchema),
    asyncHandler(async (req, res) => {
        const result = await rentalService.createRental({
            userId: req.user!.id,
            size: req.body.size,
            planId: req.body.planId,
            cabinetId: req.body.cabinetId,
        });
        res.status(201).json({ data: result });
    }),
);

export default router;