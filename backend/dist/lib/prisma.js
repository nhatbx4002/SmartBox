"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const prisma_1 = require("../generated/prisma");
exports.prisma = globalThis.__smartboxPrisma ??
    new prisma_1.PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
if (process.env.NODE_ENV !== 'production') {
    globalThis.__smartboxPrisma = exports.prisma;
}
//# sourceMappingURL=prisma.js.map