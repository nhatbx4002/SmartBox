"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const message = result.error.errors.map((error) => error.message).join(', ');
            return res.status(400).json({ error: { code: 'VALIDATION', message } });
        }
        req.body = result.data;
        return next();
    };
}
//# sourceMappingURL=validate.js.map