/**
 * @openapi
 * /api/auth/admin/login:
 *   post:
 *     tags: [Auth]
 *     summary: Admin login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Admin + accessToken + refreshToken
 *
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh admin access token
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
 *         description: New accessToken
 *
 * /api/auth/verify-pin:
 *   post:
 *     tags: [Auth]
 *     summary: Verify rental PIN code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code: { type: string }
 *               mode: { type: string }
 *     responses:
 *       200:
 *         description: Rental + compartment info
 */

import {Router} from 'express'
import {z} from 'zod'
import {asyncHandler} from '../middleware/asyncHandler'
import {validate} from '../middleware/validate'
import * as authService from '../services/auth.services'
import * as rentalService from '../services/rental.services'

const router = Router()

const loginSchema = z.object({email: z.string().email(), password: z.string().min(1)});
const refreshSchema = z.object({refreshToken: z.string().min(1)});
const verifyPinSchema = z.object({code: z.string().min(1), mode: z.string().optional()});

router.post(
    '/admin/login',
    validate(loginSchema),
    asyncHandler(async (req, res) => {
        const result = await authService.adminLogin(req.body.email,req.body.password);
        res.json({data: result});
    })
);

router.post(
    '/refresh',
    validate(refreshSchema),
    asyncHandler(async (req, res) => {
        const result = await authService.refreshToken(req.body.refreshToken);
        res.json({data: result});
    })
);

router.post(
    '/verify-pin',
    validate(verifyPinSchema),
    asyncHandler(async (req,res) => {
        const {rental, compartment} = await rentalService.verifyPin(req.body.code);
        res.json({
            data: {
                id: rental.id , rentalId: rental.id , pin: rental.code, compartmentId: compartment.id, compartmentName: compartment.name,
                lockerName: compartment.cabinet.name, size: compartment.size,
                expiresAt: rental.expiresAt, qrData: rental.qrToken,
            },
        });
    }),
);

export default router;