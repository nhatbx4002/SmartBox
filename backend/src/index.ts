import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import authRoutes from './routes/auth.routes';
import adminLocationsRoutes from './routes/admin.locations.routes';
import adminProfilesRoutes from './routes/admin.profiles.routes';
import auditRoutes from './routes/audit.routes';
import adminCabinetsRoutes from './routes/admin.cabinets.routes';
import adminCompartmentsRoutes from './routes/admin.compartments.routes';
import cabinetsRoutes from './routes/cabinets.routes';
import dashboardRoutes from './routes/dashboard.routes';
import cabinetsRoutes from './routes/cabinets.routes';
import locationsRoutes from './routes/locations.routes';
import lockersRoutes from './routes/lockers.routes';
import notificationsRoutes from './routes/notifications.routes';
import pairingRoutes from './routes/pairing.routes';
import provisioningRoutes from './routes/provisioning.routes';
import rentalsAdminRoutes from './routes/rentals.admin.routes';
import rentalsRoutes from './routes/rentals.routes';
import userNotificationsRoutes from './routes/user-notifications.routes';
import userRentalsRoutes from './routes/user-rentals.routes';
import userLocationsRoutes from './routes/user-locations.routes';
import usersRoutes from './routes/users.routes';
import systemRoutes from './routes/system.routes';
import { startExpiryChecker } from './jobs/expiryChecker';
import { startHeartbeatMonitor } from './jobs/heartbeatMonitor';
import { connectMqtt } from './lib/mqtt';
import { prisma } from './lib/prisma';
import { initSocket } from './lib/socket';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { setupMqttHandlers } from './mqtt/handlers';

async function bootstrap() {
  const app = express();
  const httpServer = createServer(app);

  app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
  app.use(express.json());
  app.use(requestLogger);

  initSocket(httpServer);
  await prisma.$connect();
  await connectMqtt({ waitForConnect: process.env.MQTT_REQUIRED === 'true' });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/users/me/rentals', userRentalsRoutes);
  app.use('/api/users/me/locations', userLocationsRoutes);
  app.use('/api/users/me/notifications', userNotificationsRoutes);
  app.use('/api/rentals', rentalsRoutes);
  app.use('/api/lockers', lockersRoutes);
  app.use('/api/cabinets', cabinetsRoutes);
  app.use('/api/pair', pairingRoutes);
  app.use('/api/provisioning', provisioningRoutes);
  app.get('/api/plans', async (req, res, next) => {
    try {
      const rawSize = req.query.size?.toString();
      const plans = await prisma.pricePlan.findMany({
        where: {
          isActive: true,
          ...(rawSize ? { size: rawSize as never } : {}),
        },
        orderBy: [{ size: 'asc' }, { price: 'asc' }],
      });
      res.json({ data: plans });
    } catch (error) {
      next(error);
    }
  });
  app.use('/api/admin/cabinets', adminCabinetsRoutes);
  app.use('/api/admin/cabinets', cabinetsRoutes);
  app.use('/api/admin/compartments', adminCompartmentsRoutes);
  app.use('/api/admin/locations', adminLocationsRoutes);
  app.use('/api/admin/profiles', adminProfilesRoutes);
  app.use('/api/public/locations', locationsRoutes);
  app.use('/api/locations', locationsRoutes);
  app.use('/api/admin/rentals', rentalsAdminRoutes);
  app.use('/api/audit-logs', auditRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/notifications', notificationsRoutes);
  app.use('/api/system', systemRoutes);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use(errorHandler);

  startExpiryChecker();
  startHeartbeatMonitor();
  setupMqttHandlers();

  const port = Number(process.env.PORT) || 3000;
  httpServer.listen(port, () => {
    console.log(`SmartBox Backend running on http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Bootstrap failed:', error);
  process.exit(1);
});
