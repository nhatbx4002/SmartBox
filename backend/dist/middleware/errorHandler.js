"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const errors_1 = require("../lib/errors");
function errorHandler(error, _req, res, _next) {
    if (error instanceof errors_1.AppError) {
        return res.status(error.status).json({ error: { code: error.code, message: error.message } });
    }
    console.error('[Unhandled Error]', error);
    return res.status(500).json({ error: { code: 'INTERNAL', message: 'Server error' } });
}
//# sourceMappingURL=errorHandler.js.map