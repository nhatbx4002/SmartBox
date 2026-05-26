"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_locations_routes_1 = __importDefault(require("./routes/admin.locations.routes"));
const audit_routes_1 = __importDefault(require("./routes/audit.routes"));
const cabinets_routes_1 = __importDefault(require("./routes/cabinets.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const locations_routes_1 = __importDefault(require("./routes/locations.routes"));
const lockers_routes_1 = __importDefault(require("./routes/lockers.routes"));
const notifications_routes_1 = __importDefault(require("./routes/notifications.routes"));
const provisioning_routes_1 = __importDefault(require("./routes/provisioning.routes"));
const rentals_admin_routes_1 = __importDefault(require("./routes/rentals.admin.routes"));
const rentals_routes_1 = __importDefault(require("./routes/rentals.routes"));
const system_routes_1 = __importDefault(require("./routes/system.routes"));
const expiryChecker_1 = require("./jobs/expiryChecker");
const heartbeatMonitor_1 = require("./jobs/heartbeatMonitor");
const mqtt_1 = require("./lib/mqtt");
const prisma_1 = require("./lib/prisma");
const socket_1 = require("./lib/socket");
const errorHandler_1 = require("./middleware/errorHandler");
const requestLogger_1 = require("./middleware/requestLogger");
const handlers_1 = require("./mqtt/handlers");
async function bootstrap() {
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN || '*' }));
    app.use(express_1.default.json());
    app.use(requestLogger_1.requestLogger);
    (0, socket_1.initSocket)(httpServer);
    await prisma_1.prisma.$connect();
    await (0, mqtt_1.connectMqtt)({ waitForConnect: process.env.MQTT_REQUIRED === 'true' });
    app.use('/api/auth', auth_routes_1.default);
    app.use('/api/rentals', rentals_routes_1.default);
    app.use('/api/lockers', lockers_routes_1.default);
    app.use('/api/provisioning', provisioning_routes_1.default);
    app.get('/api/plans', async (req, res, next) => {
        try {
            const rawSize = req.query.size?.toString();
            const plans = await prisma_1.prisma.pricePlan.findMany({
                where: {
                    isActive: true,
                    ...(rawSize ? { size: rawSize } : {}),
                },
                orderBy: [{ size: 'asc' }, { price: 'asc' }],
            });
            res.json({ data: plans });
        }
        catch (error) {
            next(error);
        }
    });
    app.use('/api/admin/cabinets', cabinets_routes_1.default);
    app.use('/api/admin/locations', admin_locations_routes_1.default);
    app.use('/api/public/locations', locations_routes_1.default);
    app.use('/api/admin/rentals', rentals_admin_routes_1.default);
    app.use('/api/audit-logs', audit_routes_1.default);
    app.use('/api/dashboard', dashboard_routes_1.default);
    app.use('/api/notifications', notifications_routes_1.default);
    app.use('/api/system', system_routes_1.default);
    app.get('/api/health', (_req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    app.use(errorHandler_1.errorHandler);
    (0, expiryChecker_1.startExpiryChecker)();
    (0, heartbeatMonitor_1.startHeartbeatMonitor)();
    (0, handlers_1.setupMqttHandlers)();
    const port = Number(process.env.PORT) || 3000;
    httpServer.listen(port, () => {
        console.log(`SmartBox Backend running on http://localhost:${port}`);
    });
}
bootstrap().catch((error) => {
    console.error('Bootstrap failed:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map