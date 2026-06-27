"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var strict_1 = require("node:assert/strict");
var node_test_1 = require("node:test");
var prisma_1 = require("../src/generated/prisma");
var prisma_2 = require("../src/lib/prisma");
var rental_service_1 = require("../src/services/rental.service");
(0, node_test_1.default)('createRental filters available compartments by cabinetId when provided', function (t) { return __awaiter(void 0, void 0, void 0, function () {
    var compartmentFindCalls, rental, originals, availabilityQuery;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                process.env.QR_SECRET = 'test-secret';
                process.env.PAYMENT_MOCK_ENABLED = 'true';
                compartmentFindCalls = [];
                rental = {
                    id: 'rental-1',
                    userId: 'user-1',
                    compartmentId: 'compartment-a1',
                    code: '123456',
                    qrToken: 'pending-token',
                    expiresAt: new Date(Date.now() + 86400000),
                    compartment: {
                        id: 'compartment-a1',
                        name: 'A1',
                        cabinetId: 'cabinet-a',
                        size: prisma_1.CompartmentSize.SMALL,
                        cabinet: { id: 'cabinet-a', name: 'Tu A', status: prisma_1.CabinetStatus.ACTIVE },
                    },
                };
                originals = {
                    pricePlanFindFirst: prisma_2.prisma.pricePlan.findFirst,
                    cabinetFindFirst: prisma_2.prisma.cabinet.findFirst,
                    compartmentFindFirst: prisma_2.prisma.compartment.findFirst,
                    compartmentFindMany: prisma_2.prisma.compartment.findMany,
                    rentalFindUnique: prisma_2.prisma.rental.findUnique,
                    rentalUpdate: prisma_2.prisma.rental.update,
                    notificationCreate: prisma_2.prisma.notification.create,
                    lockerLogCreate: prisma_2.prisma.lockerLog.create,
                    transaction: prisma_2.prisma.$transaction,
                };
                t.after(function () {
                    prisma_2.prisma.pricePlan.findFirst = originals.pricePlanFindFirst;
                    prisma_2.prisma.cabinet.findFirst = originals.cabinetFindFirst;
                    prisma_2.prisma.compartment.findFirst = originals.compartmentFindFirst;
                    prisma_2.prisma.compartment.findMany = originals.compartmentFindMany;
                    prisma_2.prisma.rental.findUnique = originals.rentalFindUnique;
                    prisma_2.prisma.rental.update = originals.rentalUpdate;
                    prisma_2.prisma.notification.create = originals.notificationCreate;
                    prisma_2.prisma.lockerLog.create = originals.lockerLogCreate;
                    prisma_2.prisma.$transaction = originals.transaction;
                });
                prisma_2.prisma.pricePlan.findFirst = function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, ({
                                id: 'small-1-day',
                                size: prisma_1.CompartmentSize.SMALL,
                                isActive: true,
                                durationDays: 1,
                                maxOpens: 2,
                            })];
                    });
                }); };
                prisma_2.prisma.compartment.findFirst = function (args) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        compartmentFindCalls.push(args);
                        return [2 /*return*/, rental.compartment];
                    });
                }); };
                prisma_2.prisma.compartment.findMany = function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, [
                                {
                                    id: 'compartment-a1',
                                    name: 'A1',
                                    size: prisma_1.CompartmentSize.SMALL,
                                    status: prisma_1.CompartmentAvailability.AVAILABLE,
                                },
                            ]];
                    });
                }); };
                prisma_2.prisma.rental.findUnique = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, null];
                }); }); };
                prisma_2.prisma.rental.update = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, rental];
                }); }); };
                prisma_2.prisma.notification.create = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ id: 'notification-1' })];
                }); }); };
                prisma_2.prisma.lockerLog.create = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ id: 'locker-log-1' })];
                }); }); };
                prisma_2.prisma.$transaction = (function (callback) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, callback({
                                user: { upsert: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, ({ id: 'user-1', phone: '0909123456' })];
                                    }); }); } },
                                rental: { create: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, rental];
                                    }); }); }, update: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, rental];
                                    }); }); } },
                                compartment: { update: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, ({ id: 'compartment-a1' })];
                                    }); }); }, updateMany: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, ({ count: 1 })];
                                    }); }); } },
                                lockerLog: { create: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, ({ id: 'locker-log-transaction' })];
                                    }); }); } },
                            })];
                    });
                }); });
                return [4 /*yield*/, (0, rental_service_1.createRental)({
                        phone: '0909123456',
                        size: prisma_1.CompartmentSize.SMALL,
                        planId: 'small-1-day',
                        paymentMethod: prisma_1.PaymentMethod.CASH,
                        cabinetId: 'cabinet-a',
                    })];
            case 1:
                _c.sent();
                availabilityQuery = compartmentFindCalls[0];
                strict_1.default.equal((_b = (_a = availabilityQuery.where) === null || _a === void 0 ? void 0 : _a.cabinet) === null || _b === void 0 ? void 0 : _b.id, 'cabinet-a');
                return [2 /*return*/];
        }
    });
}); });
