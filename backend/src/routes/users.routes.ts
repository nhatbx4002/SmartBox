import { Router } from 'express';
import { z } from 'zod';
import { CompartmentSize, PaymentMethod } from '../generated/prisma';
import { BadRequestError } from '../lib/errors';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import { createRental } from '../services/rental.service';
import {
  getUserProfile,
  registerFcmToken,
  refreshUserToken,
  resetPasswordWithOtp,
  sendForgotPasswordOtp,
  updateUserProfile,
  userLogin,
  userRegister,
} from '../services/user.service';

const router = Router();
const phoneRegex = /^0[0-9]{9,10}$/;

const registerSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Invalid Vietnamese mobile number (e.g. 0912345678)'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Invalid Vietnamese mobile number'),
  password: z.string().min(1).max(100),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional().or(z.literal('')),
  password: z.string().min(6).optional(),
});

const fcmSchema = z.object({
  fcmToken: z.string().min(1),
});

const rentSchema = z.object({
  size: z.nativeEnum(CompartmentSize),
  planId: z.string().min(1),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  cabinetId: z.string().min(1).optional(),
});

const forgotSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Invalid Vietnamese mobile number'),
});

const resetSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Invalid Vietnamese mobile number'),
  otp: z.string().length(6).regex(/^\d+$/, 'OTP must be 6 digits'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

router.post(
  '/register',
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const result = await userRegister(req.body.phone, req.body.password);
    res.status(201).json({ data: result });
  }),
);

router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const result = await userLogin(req.body.phone, req.body.password);
    res.json({ data: result });
  }),
);

router.post(
  '/refresh',
  validate(refreshSchema),
  asyncHandler(async (req, res) => {
    const result = await refreshUserToken(req.body.refreshToken);
    res.json({ data: result });
  }),
);

router.get(
  '/me',
  requireUser,
  asyncHandler(async (req, res) => {
    const profile = await getUserProfile(req.user!.id);
    res.json({ data: profile });
  }),
);

router.put(
  '/me',
  requireUser,
  validate(updateProfileSchema),
  asyncHandler(async (req, res) => {
    const profile = await updateUserProfile(req.user!.id, req.body);
    res.json({ data: profile });
  }),
);

router.post(
  '/me/devices',
  requireUser,
  validate(fcmSchema),
  asyncHandler(async (req, res) => {
    await registerFcmToken(req.user!.id, req.body.fcmToken);
    res.json({ data: { ok: true } });
  }),
);

router.post(
  '/me/rent',
  requireUser,
  validate(rentSchema),
  asyncHandler(async (req, res) => {
    if (!req.user!.phone) {
      throw BadRequestError('Phone number required to rent. Please update your profile first.');
    }

    const result = await createRental({
      phone: req.user!.phone,
      size: req.body.size,
      planId: req.body.planId,
      paymentMethod: req.body.paymentMethod,
      cabinetId: req.body.cabinetId,
    });
    res.status(201).json({ data: result });
  }),
);

router.post(
  '/forgot-password',
  validate(forgotSchema),
  asyncHandler(async (req, res) => {
    await sendForgotPasswordOtp(req.body.phone);
    res.json({ data: { ok: true } });
  }),
);

router.post(
  '/reset-password',
  validate(resetSchema),
  asyncHandler(async (req, res) => {
    await resetPasswordWithOtp(req.body.phone, req.body.otp, req.body.newPassword);
    res.json({ data: { ok: true } });
  }),
);

export default router;
