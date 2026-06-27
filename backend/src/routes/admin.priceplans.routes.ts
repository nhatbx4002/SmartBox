import { Router } from 'express';
import { z } from 'zod';
import { CompartmentSize, RentalType } from '../generated/prisma';
import { prisma } from '../lib/prisma';
import { NotFoundError } from '../lib/errors';
import { requireSuperAdmin } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate } from '../middleware/validate';
import { auditFromRequest } from '../services/audit.service';

const router = Router();

router.use(requireSuperAdmin);

const createPlanSchema = z.object({
  name: z.string().min(1),
  size: z.nativeEnum(CompartmentSize),
  rentalType: z.nativeEnum(RentalType),
  price: z.number().int().positive(),
  maxOpens: z.number().int().positive().optional(),
  durationDays: z.number().int().positive(),
  description: z.string().optional(),
});

const updatePlanSchema = createPlanSchema.partial();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const plans = await prisma.pricePlan.findMany({ orderBy: [{ size: 'asc' }, { price: 'asc' }] });
    res.json({ data: plans });
  }),
);

router.post(
  '/',
  validate(createPlanSchema),
  asyncHandler(async (req, res) => {
    const plan = await prisma.pricePlan.create({ data: req.body });
    await auditFromRequest(req, 'CREATE_PRICE_PLAN' as never, 'PricePlan', plan.id, req.body);
    res.status(201).json({ data: plan });
  }),
);

router.put(
  '/:id',
  validate(updatePlanSchema),
  asyncHandler(async (req, res) => {
    const existing = await prisma.pricePlan.findUnique({ where: { id: req.params.id } });
    if (!existing) throw NotFoundError('PricePlan not found');
    const plan = await prisma.pricePlan.update({ where: { id: req.params.id }, data: req.body });
    await auditFromRequest(req, 'UPDATE_PRICE_PLAN' as never, 'PricePlan', plan.id, req.body);
    res.json({ data: plan });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await prisma.pricePlan.findUnique({ where: { id: req.params.id } });
    if (!existing) throw NotFoundError('PricePlan not found');
    const plan = await prisma.pricePlan.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    await auditFromRequest(req, 'DELETE_PRICE_PLAN' as never, 'PricePlan', plan.id, { isActive: false });
    res.json({ data: { ok: true } });
  }),
);

export default router;
