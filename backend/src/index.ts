import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import swaggerUi from 'swagger-ui-express';
import { AppError } from './lib/errors';
import { requestLogger } from './middleware/requestLogger';
import { openapiSpec } from './lib/openapi';
import { connectMqtt, setMqttReconnectHandler } from './lib/mqtt';
import { setupMqttHandlers } from './mqtt/handlers';
import { initSocket } from './lib/socket';
import { startExpiryChecker } from './jobs/expiryChecker';
import { startHeartbeatMonitor } from './jobs/heartbeatMonitor';
import { startPaymentExpiryChecker } from './jobs/paymentExpiry';

import authRoutes from './routes/auth.routes';
import adminAdminsRoutes from './routes/admin.admins.routes';
import locationRoutes from './routes/location.routes';
import adminLocationsRoutes from './routes/admin.locations.routes';
import adminPricePlansRoutes from './routes/admin.priceplans.routes';
import plansRoutes from './routes/plans.routes';
import userRoutes from './routes/user.routes';
import userRentalsRoutes from './routes/user-rentals.routes';
import userLocationsRoutes from './routes/user-locations.routes';
import userNotificationsRoutes from './routes/user-notifications.routes';
import adminCabinetsRoutes from './routes/admin.cabinets.routes';
import cabinetsRoutes from './routes/cabinets.routes';
import pairingRoutes from './routes/pairing.routes';
import rentalsRoutes from './routes/rentals.routes';
import adminRentalsRoutes from './routes/admin.rentals.routes';
import lockersRoutes from './routes/lockers.routes';
import paymentsRoutes from './routes/payments.routes';
import notificationsRoutes from './routes/notifications.routes';
import auditRoutes from './routes/audit.routes';
import dashboardRoutes from './routes/dashboard.routes';
import systemRoutes from './routes/system.routes';

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(requestLogger);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get('/api-docs.json', (_req, res) => res.json(openapiSpec));


//state backend
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});



///route
app.use('/api/auth', authRoutes);
app.use('/api/admin/admins', adminAdminsRoutes);
app.use('/api/public/locations', locationRoutes);
app.use('/api/admin/locations', adminLocationsRoutes);
app.use('/api/admin/price-plans', adminPricePlansRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users/me/rentals', userRentalsRoutes);
app.use('/api/users/me/locations', userLocationsRoutes);
app.use('/api/users/me/notifications', userNotificationsRoutes);
app.use('/api/admin/cabinets', adminCabinetsRoutes);
app.use('/api/cabinets', cabinetsRoutes);
app.use('/api/pair', pairingRoutes);
app.use('/api/rentals', rentalsRoutes);
app.use('/api/admin/rentals', adminRentalsRoutes);
app.use('/api/lockers', lockersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/system', systemRoutes);



//middleware handle error chung
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: `Route not found: ${req.method} ${req.path}` } });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: { code: err.code || 'ERROR', message: err.message } });
    }
    console.error(err);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
});

initSocket(httpServer);

setMqttReconnectHandler(() => {
    setupMqttHandlers();
});

connectMqtt()
    .then(() => {
        setupMqttHandlers();
    })
    .catch((error) => {
        console.error('[MQTT] initial connect failed:', error.message);
    });

startExpiryChecker();
startHeartbeatMonitor();
startPaymentExpiryChecker();

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`[server] listening on port ${PORT}`);
});
