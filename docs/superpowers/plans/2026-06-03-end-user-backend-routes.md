# End-User Backend Routes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add all backend routes and middleware needed for the end-user mobile app (auth, rentals, notifications, locations, FCM device registration).

**Architecture:** 5 new route files + 1 new middleware under `backend/src/`. Follow existing Express patterns (Router + Zod validation + asyncHandler). User JWT payload: `{ sub: userId, phone, email }`. Prisma model `User` already exists with passwordHash — reuse it.

**Tech Stack:** Node.js, TypeScript, Express, Prisma, bcrypt, Zod, JWT (jsonwebtoken), existing backend patterns.

---

## File Map

```
backend/src/
├── middleware/
│   └── requireUser.ts          # Create — JWT validation for end-users
├── services/
│   └── user.service.ts         # Create — user auth & profile logic
├── routes/
│   ├── users.routes.ts         # Create — register, login, refresh, forgot, reset, me
│   ├── user-rentals.routes.ts  # Create — my rentals, detail, unlock, complete
│   ├── user-locations.routes.ts # Create — locations with available count
│   └── user-notifications.routes.ts # Create — notifications, read, FCM
└── index.ts                    # Modify — register new routes
```

---

## Task 1: Update Prisma Schema

**Files:**
- Modify: `backend/prisma/schema.prisma:134-149`

- [ ] **Step 1: Add fcmToken field to User model**

Locate the `User` model in `backend/prisma/schema.prisma` (around line 134). Add `fcmToken String?` before `status`:

```prisma
model User {
  id            String         @id @default(cuid())
  email         String?        @unique
  phone         String         @unique
  passwordHash  String?
  name          String?
  fcmToken      String?
  status        UserStatus     @default(ACTIVE)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  rentals       Rental[]
  notifications Notification[]
  sessions      UserSession[]

  @@index([phone])
  @@index([email])
}
```

- [ ] **Step 2: Generate Prisma client**

Run: `cd backend && npm run db:generate`
Expected: `Prisma client generated successfully`

- [ ] **Step 3: Push schema to database**

Run: `cd backend && npm run db:push`
Expected: `The database is now in sync with the Prisma schema`

- [ ] **Step 4: Commit**

```bash
git add backend/prisma/schema.prisma backend/src/generated/
git commit -m "feat: add fcmToken to User model for FCM push notifications"
```

---

## Task 2: Create `requireUser` Middleware

**Files:**
- Create: `backend/src/middleware/requireUser.ts`

- [ ] **Step 1: Write the middleware**

```typescript
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../lib/errors';
import { verifyToken } from '../lib/jwt';

declare module 'express' {
  interface Request {
    user?: { id: string; phone: string; email: string | null };
  }
}

export function requireUser(req: Request, _res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw UnauthorizedError('Missing token');
    }

    const payload = verifyToken(auth.slice(7), process.env.JWT_SECRET || '');
    if (!payload.sub) {
      throw UnauthorizedError('Invalid token');
    }

    req.user = {
      id: String(payload.sub),
      phone: String(payload.phone || ''),
      email: payload.email ? String(payload.email) : null,
    };
    next();
  } catch {
    next(UnauthorizedError('Invalid token'));
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/middleware/requireUser.ts
git commit -m "feat(middleware): add requireUser JWT middleware"
```

---

## Task 3: Create `user.service.ts`

**Files:**
- Create: `backend/src/services/user.service.ts`
- Read for reference: `backend/src/services/auth.service.ts`

- [ ] **Step 1: Write user service**

```typescript
import bcrypt from 'bcrypt';
import { UserStatus } from '../generated/prisma';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../lib/errors';
import { signToken, verifyToken } from '../lib/jwt';
import { prisma } from '../lib/prisma';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

export async function userRegister(phone: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) throw BadRequestError('Phone number already registered');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { phone, passwordHash, status: UserStatus.ACTIVE },
  });

  const payload = { sub: user.id, phone: user.phone, email: user.email };
  return {
    user: { id: user.id, phone: user.phone, email: user.email, name: user.name, status: user.status },
    accessToken: signToken(payload, requireEnv('JWT_SECRET'), process.env.JWT_EXPIRES_IN || '15m'),
    refreshToken: signToken(payload, requireEnv('JWT_REFRESH_SECRET'), process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
  };
}

export async function userLogin(phone: string, password: string) {
  const user = await prisma.user.findUnique({ where: { phone } });

  // Always run bcrypt with a dummy hash so timing is constant regardless of user existence.
  // Use the user's real hash if found, otherwise a static dummy hash (10 rounds).
  const storedHash = user?.passwordHash ?? '$2b$10$eqQeqQeqQeqQeqQeqQeqQeqQeqQeqQeqQeqQeqQeqQeqQeqQeqQ'; // dummy
  const valid = await bcrypt.compare(password, storedHash);

  // Only check user existence after bcrypt to prevent timing attacks
  if (!user || !valid) throw UnauthorizedError('Invalid phone or password');
  if (!user.passwordHash) throw UnauthorizedError('Account not set up. Please register first.');

  const payload = { sub: user.id, phone: user.phone, email: user.email };
  return {
    user: { id: user.id, phone: user.phone, email: user.email, name: user.name, status: user.status },
    accessToken: signToken(payload, requireEnv('JWT_SECRET'), process.env.JWT_EXPIRES_IN || '15m'),
    refreshToken: signToken(payload, requireEnv('JWT_REFRESH_SECRET'), process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
  };
}

export async function refreshUserToken(refreshTokenValue: string) {
  const payload = verifyToken(refreshTokenValue, requireEnv('JWT_REFRESH_SECRET'));
  if (!payload.sub) throw UnauthorizedError('Invalid refresh token');

  return {
    accessToken: signToken(
      { sub: payload.sub, phone: payload.phone, email: payload.email },
      requireEnv('JWT_SECRET'),
      process.env.JWT_EXPIRES_IN || '15m',
    ),
  };
}

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw NotFoundError('User not found');
  return { id: user.id, phone: user.phone, email: user.email, name: user.name, status: user.status };
}

export async function updateUserProfile(userId: string, input: { name?: string; email?: string; password?: string }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw NotFoundError('User not found');

  const updateData: { name?: string; email?: string; passwordHash?: string } = {};
  if (input.name !== undefined) updateData.name = input.name;
  if (input.email !== undefined) {
    // Check for duplicate email (ignore if same as current)
    if (input.email) {
      const existing = await prisma.user.findFirst({ where: { email: input.email, id: { not: userId } } });
      if (existing) throw BadRequestError('Email already in use');
    }
    updateData.email = input.email || null;
  }
  if (input.password !== undefined) updateData.passwordHash = await bcrypt.hash(input.password, 10);

  const updated = await prisma.user.update({ where: { id: userId }, data: updateData });
  return { id: updated.id, phone: updated.phone, email: updated.email, name: updated.name, status: updated.status };
}

export async function registerFcmToken(userId: string, fcmToken: string) {
  await prisma.user.update({ where: { id: userId }, data: { fcmToken } });
  return { ok: true };
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/services/user.service.ts
git commit -m "feat(services): add user.service for end-user auth and profile"
```

---

## Task 4: Create `users.routes.ts`

**Files:**
- Create: `backend/src/routes/users.routes.ts`
- Modify: `backend/src/index.ts` (register the route)

- [ ] **Step 1: Write users routes**

```typescript
import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler';
import { BadRequestError } from '../lib/errors';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import { getUserProfile, refreshUserToken, registerFcmToken, updateUserProfile, userLogin, userRegister } from '../services/user.service';

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

export default router;
```

- [ ] **Step 2: Register route in index.ts**

Find the line `app.use('/api/auth', authRoutes);` in `backend/src/index.ts` and add after it:

```typescript
app.use('/api/users', usersRoutes);
```

Add import at top:
```typescript
import usersRoutes from './routes/users.routes';
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/routes/users.routes.ts backend/src/index.ts
git commit -m "feat: add users routes (register, login, refresh, profile, FCM)"
```

---

## Task 5: Create `user-rentals.routes.ts`

**Files:**
- Create: `backend/src/routes/user-rentals.routes.ts`

- [ ] **Step 1: Write user-rentals routes**

```typescript
import { Router } from 'express';
import { RentalStatus } from '../generated/prisma';
import { BadRequestError, NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireUser } from '../middleware/requireUser';
import { completeRental, handleUnlock } from '../services/rental.service';

const router = Router();

router.get(
  '/',
  requireUser,
  asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const status = req.query.status as string | undefined;

    const where = {
      userId: req.user!.id,
      ...(status ? { status: status as never } : {}),
    };

    const [rentals, total] = await Promise.all([
      prisma.rental.findMany({
        where,
        include: {
          compartment: { include: { cabinet: true } },
          pricePlan: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.rental.count({ where }),
    ]);

    res.json({
      data: rentals,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  }),
);

router.get(
  '/:id',
  requireUser,
  asyncHandler(async (req, res) => {
    const rental = await prisma.rental.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      include: {
        compartment: { include: { cabinet: true } },
        pricePlan: true,
        logs: { orderBy: { createdAt: 'desc' }, take: 50 },
      },
    });
    if (!rental) throw NotFoundError('Rental not found');
    res.json({ data: rental });
  }),
);

router.post(
  '/:id/unlock',
  requireUser,
  asyncHandler(async (req, res) => {
    const rental = await prisma.rental.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!rental) throw NotFoundError('Rental not found');
    if (rental.status !== RentalStatus.ACTIVE) throw BadRequestError(`Cannot unlock rental with status: ${rental.status}`);

    const updated = await handleUnlock(req.params.id);
    if (!updated) throw NotFoundError('Rental not found');
    res.json({ data: updated });
  }),
);

router.post(
  '/:id/complete',
  requireUser,
  asyncHandler(async (req, res) => {
    const rental = await prisma.rental.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!rental) throw NotFoundError('Rental not found');

    await completeRental(req.params.id);
    res.json({ data: { ok: true } });
  }),
);

export default router;
```

- [ ] **Step 2: Register route in index.ts**

Add import:
```typescript
import userRentalsRoutes from './routes/user-rentals.routes';
```

Add mount:
```typescript
app.use('/api/users/me/rentals', userRentalsRoutes);
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/routes/user-rentals.routes.ts backend/src/index.ts
git commit -m "feat: add user-rentals routes (list, detail, unlock, complete)"
```

---

## Task 6: Create `user-locations.routes.ts`

**Files:**
- Create: `backend/src/routes/user-locations.routes.ts`

> Note: These routes are public (no auth required) — they expose location availability info. The `requireUser` import is not needed here.

- [ ] **Step 1: Write user-locations routes**

```typescript
import { Router } from 'express';
import { LocationStatus } from '../generated/prisma';
import { NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const locations = await prisma.location.findMany({
      where: { status: LocationStatus.ACTIVE },
      include: {
        cabinets: {
          include: {
            compartments: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const result = locations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      address: loc.address,
      latitude: loc.latitude,
      longitude: loc.longitude,
      googlePlaceId: loc.googlePlaceId,
      mapImageUrl: loc.mapImageUrl,
      availableCount: loc.cabinets.reduce(
        (sum, cab) => sum + cab.compartments.filter((c) => c.status === 'AVAILABLE').length,
        0,
      ),
      totalCount: loc.cabinets.reduce((sum, cab) => sum + cab.compartments.length, 0),
    }));

    res.json({ data: result });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const location = await prisma.location.findUnique({
      where: { id: req.params.id },
      include: {
        cabinets: {
          include: {
            compartments: { include: { realtimeStatus: true } },
          },
          orderBy: { name: 'asc' },
        },
      },
    });
    if (!location) throw NotFoundError('Location not found');

    const result = {
      ...location,
      cabinets: location.cabinets.map((cab) => ({
        id: cab.id,
        name: cab.name,
        status: cab.status,
        lastHeartbeatAt: cab.lastHeartbeatAt,
        compartments: cab.compartments.map((comp) => ({
          id: comp.id,
          name: comp.name,
          size: comp.size,
          status: comp.status,
          lockStatus: comp.realtimeStatus?.lockStatus ?? 'UNKNOWN',
          doorStatus: comp.realtimeStatus?.doorStatus ?? 'UNKNOWN',
        })),
      })),
    };

    res.json({ data: result });
  }),
);

export default router;
```

- [ ] **Step 2: Register route in index.ts**

Add import:
```typescript
import userLocationsRoutes from './routes/user-locations.routes';
```

Add mount:
```typescript
app.use('/api/users/me/locations', userLocationsRoutes);
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/routes/user-locations.routes.ts backend/src/index.ts
git commit -m "feat: add user-locations routes with available count"
```

---

## Task 7: Create `user-notifications.routes.ts`

**Files:**
- Create: `backend/src/routes/user-notifications.routes.ts`

- [ ] **Step 1: Write user-notifications routes**

```typescript
import { Router } from 'express';
import { NotFoundError } from '../lib/errors';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireUser } from '../middleware/requireUser';

const router = Router();

router.get(
  '/',
  requireUser,
  asyncHandler(async (req, res) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ data: notifications });
  }),
);

router.put(
  '/read-all',
  requireUser,
  asyncHandler(async (req, res) => {
    const result = await prisma.notification.updateMany({
      where: { userId: req.user!.id, isRead: false },
      data: { isRead: true },
    });
    res.json({ data: { ok: true, count: result.count } });
  }),
);

router.put(
  '/:id/read',
  requireUser,
  asyncHandler(async (req, res) => {
    const existing = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw NotFoundError('Notification not found');
    if (existing.userId !== req.user!.id) throw NotFoundError('Notification not found');

    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });
    res.json({ data: notification });
  }),
);

export default router;
```

- [ ] **Step 2: Register route in index.ts**

Add import:
```typescript
import userNotificationsRoutes from './routes/user-notifications.routes';
```

Add mount:
```typescript
app.use('/api/users/me/notifications', userNotificationsRoutes);
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/routes/user-notifications.routes.ts backend/src/index.ts
git commit -m "feat: add user-notifications routes (list, read, read-all)"
```

---

## Task 8: Add `/rent` Endpoint Under User Routes

**Files:**
- Modify: `backend/src/routes/users.routes.ts`

The `POST /api/users/me/rent` endpoint reuses the existing `createRental` service. Add to `users.routes.ts`:

- [ ] **Step 1: Add imports and rent endpoint to users.routes.ts**

Add to the import block at the top of the file:
```typescript
import { CompartmentSize, PaymentMethod } from '../generated/prisma';
import { createRental } from '../services/rental.service';
```

Find the existing `export default router;` and add before it:

```typescript
import { createRental } from '../services/rental.service';

const rentSchema = z.object({
  size: z.nativeEnum(CompartmentSize),
  planId: z.string().min(1),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  cabinetId: z.string().min(1).optional(),
});

router.post(
  '/me/rent',
  requireUser,
  validate(rentSchema),
  asyncHandler(async (req, res) => {
    if (!req.user!.phone) throw BadRequestError('Phone number required to rent. Please update your profile first.');

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
```

Update imports at top of file to include `CompartmentSize`, `PaymentMethod`, `createRental`.

- [ ] **Step 2: Commit**

```bash
git add backend/src/routes/users.routes.ts
git commit -m "feat: add POST /users/me/rent endpoint"
```

---

## Task 9: Add Forgot/Reset Password

**Files:**
- Modify: `backend/src/services/user.service.ts`
- Modify: `backend/src/routes/users.routes.ts`

For simplicity (MVP), use a 6-digit OTP code sent via SMS-style notification. Since real SMS gateway is out of scope, store OTP in memory and return it via API (backend logs it / returns it for demo purposes).

- [ ] **Step 1: Add OTP store and forgot/reset functions to user.service.ts**

Add at the top of `user.service.ts`:

```typescript
// In-memory OTP store with rate limiting and cleanup
const otpStore = new Map<string, { otp: string; expiresAt: Date; userId: string; attemptCount: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 request per minute per phone
const MAX_OTP_ATTEMPTS = 3; // max wrong OTP attempts before lockout

export async function sendForgotPasswordOtp(phone: string) {
  // Rate limiting: prevent OTP spam
  const existing = otpStore.get(phone);
  if (existing && existing.expiresAt > new Date()) {
    const timeLeft = Math.ceil((existing.expiresAt.getTime() - Date.now()) / 1000);
    throw BadRequestError(`Please wait ${timeLeft}s before requesting another OTP`);
  }

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) return { ok: true }; // Don't reveal if phone exists

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  otpStore.set(phone, { otp, expiresAt, userId: user.id, attemptCount: 0 });

  // In production, send SMS here. For now, log it.
  console.log(`[OTP] Phone: ${phone}, OTP: ${otp}`);

  return { ok: true };
}

export async function resetPasswordWithOtp(phone: string, otp: string, newPassword: string) {
  const record = otpStore.get(phone);
  if (!record) throw BadRequestError('No OTP requested for this phone');
  if (record.expiresAt < new Date()) {
    otpStore.delete(phone);
    throw BadRequestError('OTP has expired. Please request a new one.');
  }

  if (record.attemptCount >= MAX_OTP_ATTEMPTS) {
    otpStore.delete(phone);
    throw BadRequestError('Too many failed attempts. Please request a new OTP.');
  }

  if (record.otp !== otp) {
    record.attemptCount += 1;
    const remaining = MAX_OTP_ATTEMPTS - record.attemptCount;
    throw UnauthorizedError(`Invalid OTP. ${remaining} attempt(s) remaining.`);
  }

  otpStore.delete(phone);

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: record.userId }, data: { passwordHash } });

  return { ok: true };
}

// Periodic cleanup of expired OTPs (call this from a cron job or on each request)
export function cleanupExpiredOtps() {
  const now = Date.now();
  for (const [phone, record] of otpStore.entries()) {
    if (record.expiresAt.getTime() < now) {
      otpStore.delete(phone);
    }
  }
}
```

- [ ] **Step 2: Add forgot/reset routes to users.routes.ts**

```typescript
const forgotSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Invalid Vietnamese mobile number'),
});

const resetSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Invalid Vietnamese mobile number'),
  otp: z.string().length(6).regex(/^\d+$/, 'OTP must be 6 digits'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

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
```

Import `sendForgotPasswordOtp` and `resetPasswordWithOtp` from user.service.

- [ ] **Step 3: Commit**

```bash
git add backend/src/services/user.service.ts backend/src/routes/users.routes.ts
git commit -m "feat: add forgot-password and reset-password with OTP"
```

---

## Task 10: Verify Build

- [ ] **Step 1: Run TypeScript build**

Run: `cd backend && npm run build`
Expected: No errors, `dist/` updated

- [ ] **Step 2: Run tests**

Run: `cd backend && npm test`
Expected: All existing tests pass

- [ ] **Step 3: Final commit (if any uncommitted changes)**

```bash
git add -A && git commit -m "feat: complete end-user backend routes"
```

---
