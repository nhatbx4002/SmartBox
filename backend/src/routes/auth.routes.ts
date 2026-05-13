import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { adminLogin, refreshToken, verifyPin } from '../services/auth.service';

const router = Router();

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

const verifyPinSchema = z.object({
  code: z.string().length(6).regex(/^\d+$/),
  mode: z.enum(['deposit', 'pickup']).optional(),
});

router.post(
  '/admin/login',
  validate(adminLoginSchema),
  asyncHandler(async (req, res) => {
    const result = await adminLogin(req.body.email, req.body.password);
    res.json({ data: result });
  }),
);

router.post(
  '/refresh',
  validate(refreshSchema),
  asyncHandler(async (req, res) => {
    const result = await refreshToken(req.body.refreshToken);
    res.json({ data: result });
  }),
);

router.post(
  '/verify-pin',
  validate(verifyPinSchema),
  asyncHandler(async (req, res) => {
    const result = await verifyPin(req.body.code);
    res.json({ data: result });
  }),
);

export default router;
