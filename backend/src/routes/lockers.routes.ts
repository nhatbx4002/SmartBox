import { Router } from 'express';
import { CompartmentSize } from '../generated/prisma';
import { BadRequestError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { getAvailableCompartments } from '../services/cabinet.service';

const router = Router();

router.get(
  '/available',
  asyncHandler(async (req, res) => {
    const rawSize = req.query.size?.toString();
    const size = rawSize ? parseCompartmentSize(rawSize) : undefined;
    const compartments = await getAvailableCompartments(size);
    res.json({ data: compartments });
  }),
);

router.get(
  '/plans',
  asyncHandler(async (req, res) => {
    const rawSize = req.query.size?.toString();
    const size = rawSize ? parseCompartmentSize(rawSize) : undefined;
    const plans = await prisma.pricePlan.findMany({
      where: { isActive: true, ...(size ? { size } : {}) },
      orderBy: [{ size: 'asc' }, { price: 'asc' }],
    });
    res.json({ data: plans });
  }),
);

function parseCompartmentSize(size: string): CompartmentSize {
  if (size !== CompartmentSize.SMALL && size !== CompartmentSize.LARGE) {
    throw BadRequestError('Invalid compartment size');
  }
  return size;
}

export default router;
