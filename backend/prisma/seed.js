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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
// @ts-ignore
var bcrypt_1 = require("bcrypt");
var prisma_1 = require("../src/generated/prisma");
var prisma = new prisma_1.PrismaClient();
var smallPlans = [
    { id: 'small-1-day', name: '1 ngay', size: prisma_1.CompartmentSize.SMALL, rentalType: prisma_1.RentalType.ONCE, price: 10000, maxOpens: 2, durationDays: 1 },
    { id: 'small-7-days', name: '7 ngay', size: prisma_1.CompartmentSize.SMALL, rentalType: prisma_1.RentalType.ONCE, price: 15000, maxOpens: 2, durationDays: 7 },
    { id: 'small-5-opens-30-days', name: '5 luot / 30 ngay', size: prisma_1.CompartmentSize.SMALL, rentalType: prisma_1.RentalType.DAILY, price: 50000, maxOpens: 5, durationDays: 30 },
    { id: 'small-10-opens-90-days', name: '10 luot / 90 ngay', size: prisma_1.CompartmentSize.SMALL, rentalType: prisma_1.RentalType.DAILY, price: 90000, maxOpens: 10, durationDays: 90 },
    { id: 'small-1-month', name: '1 thang', size: prisma_1.CompartmentSize.SMALL, rentalType: prisma_1.RentalType.MONTHLY, price: 150000, maxOpens: null, durationDays: 30 },
    { id: 'small-3-months', name: '3 thang', size: prisma_1.CompartmentSize.SMALL, rentalType: prisma_1.RentalType.MONTHLY, price: 400000, maxOpens: null, durationDays: 90 },
    { id: 'small-6-months', name: '6 thang', size: prisma_1.CompartmentSize.SMALL, rentalType: prisma_1.RentalType.MONTHLY, price: 700000, maxOpens: null, durationDays: 180 },
];
var largePlans = [
    { id: 'large-1-day', name: '1 ngay', size: prisma_1.CompartmentSize.LARGE, rentalType: prisma_1.RentalType.ONCE, price: 15000, maxOpens: 2, durationDays: 1 },
    { id: 'large-7-days', name: '7 ngay', size: prisma_1.CompartmentSize.LARGE, rentalType: prisma_1.RentalType.ONCE, price: 20000, maxOpens: 2, durationDays: 7 },
    { id: 'large-5-opens-30-days', name: '5 luot / 30 ngay', size: prisma_1.CompartmentSize.LARGE, rentalType: prisma_1.RentalType.DAILY, price: 80000, maxOpens: 5, durationDays: 30 },
    { id: 'large-10-opens-90-days', name: '10 luot / 90 ngay', size: prisma_1.CompartmentSize.LARGE, rentalType: prisma_1.RentalType.DAILY, price: 140000, maxOpens: 10, durationDays: 90 },
    { id: 'large-1-month', name: '1 thang', size: prisma_1.CompartmentSize.LARGE, rentalType: prisma_1.RentalType.MONTHLY, price: 250000, maxOpens: null, durationDays: 30 },
    { id: 'large-3-months', name: '3 thang', size: prisma_1.CompartmentSize.LARGE, rentalType: prisma_1.RentalType.MONTHLY, price: 650000, maxOpens: null, durationDays: 90 },
    { id: 'large-6-months', name: '6 thang', size: prisma_1.CompartmentSize.LARGE, rentalType: prisma_1.RentalType.MONTHLY, price: 1100000, maxOpens: null, durationDays: 180 },
];
function seedPlans() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, plan;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = __spreadArray(__spreadArray([], smallPlans, true), largePlans, true);
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    plan = _a[_i];
                    return [4 /*yield*/, prisma.pricePlan.upsert({
                            where: { id: plan.id },
                            update: plan,
                            create: plan,
                        })];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function seedAdmin() {
    return __awaiter(this, void 0, void 0, function () {
        var email, password, name, passwordHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    email = process.env.ADMIN_EMAIL || 'admin@smartbox.io';
                    password = process.env.ADMIN_PASSWORD || 'SmartBox@2026';
                    name = process.env.ADMIN_NAME || 'SmartBox Admin';
                    return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                case 1:
                    passwordHash = _a.sent();
                    return [4 /*yield*/, prisma.admin.upsert({
                            where: { email: email },
                            update: { passwordHash: passwordHash, name: name, role: prisma_1.AdminRole.SUPER_ADMIN },
                            create: { email: email, passwordHash: passwordHash, name: name, role: prisma_1.AdminRole.SUPER_ADMIN },
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function seedLocation() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.location.upsert({
                        where: { id: 'loc-bach-khoa' },
                        update: {},
                        create: {
                            id: 'loc-bach-khoa',
                            name: 'SmartBox Truong DH Bach Khoa',
                            address: '268 Ly Thuong Kiet, P.14, Q.10, TP.HCM',
                            latitude: 10.7795,
                            longitude: 106.6989,
                        },
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, seedPlans()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, seedAdmin()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, seedLocation()];
                case 3:
                    _a.sent();
                    console.log('Seed completed');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (error) {
    console.error(error);
    process.exitCode = 1;
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
