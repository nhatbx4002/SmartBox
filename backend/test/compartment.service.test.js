"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var compartment_service_1 = require("../src/services/compartment.service");
(0, node_test_1.default)('createCompartment rejects duplicate lock pin on the same MCP device', function (t) { return __awaiter(void 0, void 0, void 0, function () {
    var originals;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                originals = {
                    cabinetFindUnique: prisma_2.prisma.cabinet.findUnique,
                    mcpDeviceFindFirst: prisma_2.prisma.mcpDevice.findFirst,
                    compartmentFindFirst: prisma_2.prisma.compartment.findFirst,
                };
                t.after(function () {
                    prisma_2.prisma.cabinet.findUnique = originals.cabinetFindUnique;
                    prisma_2.prisma.mcpDevice.findFirst = originals.mcpDeviceFindFirst;
                    prisma_2.prisma.compartment.findFirst = originals.compartmentFindFirst;
                });
                prisma_2.prisma.cabinet.findUnique = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ id: 'cabinet-1', status: prisma_1.CabinetStatus.ACTIVE })];
                }); }); };
                prisma_2.prisma.mcpDevice.findFirst = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ id: 'mcp-1', cabinetId: 'cabinet-1' })];
                }); }); };
                prisma_2.prisma.compartment.findFirst = function (args) { return __awaiter(void 0, void 0, void 0, function () {
                    var or, _i, or_1, condition;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        or = (_b = (_a = args.where) === null || _a === void 0 ? void 0 : _a.OR) !== null && _b !== void 0 ? _b : [];
                        for (_i = 0, or_1 = or; _i < or_1.length; _i++) {
                            condition = or_1[_i];
                            if (condition.lockMcpDeviceId === 'mcp-1' && condition.mcp23017PinLock === 4) {
                                return [2 /*return*/, { id: 'existing-compartment' }];
                            }
                        }
                        return [2 /*return*/, null];
                    });
                }); };
                return [4 /*yield*/, strict_1.default.rejects(function () {
                        return (0, compartment_service_1.createCompartment)('cabinet-1', {
                            name: 'A3',
                            size: prisma_1.CompartmentSize.SMALL,
                            lockMcpDeviceId: 'mcp-1',
                            sensorMcpDeviceId: 'mcp-1',
                            mcp23017PinLock: 4,
                            mcp23017PinSensor: 5,
                        });
                    }, /Pin already in use/)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, node_test_1.default)('createCompartment creates compartment and increments cabinet configVersion', function (t) { return __awaiter(void 0, void 0, void 0, function () {
    var originals, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                originals = {
                    cabinetFindUnique: prisma_2.prisma.cabinet.findUnique,
                    cabinetUpdate: prisma_2.prisma.cabinet.update,
                    mcpDeviceFindFirst: prisma_2.prisma.mcpDevice.findFirst,
                    compartmentFindFirst: prisma_2.prisma.compartment.findFirst,
                    transaction: prisma_2.prisma.$transaction,
                };
                t.after(function () {
                    prisma_2.prisma.cabinet.findUnique = originals.cabinetFindUnique;
                    prisma_2.prisma.cabinet.update = originals.cabinetUpdate;
                    prisma_2.prisma.mcpDevice.findFirst = originals.mcpDeviceFindFirst;
                    prisma_2.prisma.compartment.findFirst = originals.compartmentFindFirst;
                    prisma_2.prisma.$transaction = originals.transaction;
                });
                prisma_2.prisma.cabinet.findUnique = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ id: 'cabinet-1', status: prisma_1.CabinetStatus.ACTIVE })];
                }); }); };
                prisma_2.prisma.mcpDevice.findFirst = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ id: 'mcp-1', cabinetId: 'cabinet-1' })];
                }); }); };
                prisma_2.prisma.compartment.findFirst = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, null];
                }); }); };
                prisma_2.prisma.$transaction = function (fn) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, fn({
                                compartment: {
                                    create: function () { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, ({
                                                    id: 'comp-3',
                                                    cabinetId: 'cabinet-1',
                                                    name: 'A3',
                                                    status: prisma_1.CompartmentAvailability.AVAILABLE,
                                                })];
                                        });
                                    }); },
                                },
                                cabinet: {
                                    update: function () { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, ({
                                                    id: 'cabinet-1',
                                                    configVersion: 2,
                                                })];
                                        });
                                    }); },
                                },
                            })];
                    });
                }); };
                prisma_2.prisma.cabinet.findUnique = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ id: 'cabinet-1', status: prisma_1.CabinetStatus.ACTIVE, mcpDevices: [], compartments: [] })];
                }); }); };
                return [4 /*yield*/, (0, compartment_service_1.createCompartment)('cabinet-1', {
                        name: 'A3',
                        size: prisma_1.CompartmentSize.SMALL,
                        lockMcpDeviceId: 'mcp-1',
                        sensorMcpDeviceId: 'mcp-1',
                        mcp23017PinLock: 4,
                        mcp23017PinSensor: 5,
                    })];
            case 1:
                result = _a.sent();
                strict_1.default.equal(result.configVersion, 2);
                strict_1.default.equal(result.compartment.id, 'comp-3');
                return [2 /*return*/];
        }
    });
}); });
(0, node_test_1.default)('createCompartment allows multiple compartments without sensors', function (t) { return __awaiter(void 0, void 0, void 0, function () {
    var calls, originals, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                calls = [];
                originals = {
                    cabinetFindUnique: prisma_2.prisma.cabinet.findUnique,
                    cabinetUpdate: prisma_2.prisma.cabinet.update,
                    mcpDeviceFindFirst: prisma_2.prisma.mcpDevice.findFirst,
                    compartmentFindFirst: prisma_2.prisma.compartment.findFirst,
                    transaction: prisma_2.prisma.$transaction,
                };
                t.after(function () {
                    prisma_2.prisma.cabinet.findUnique = originals.cabinetFindUnique;
                    prisma_2.prisma.cabinet.update = originals.cabinetUpdate;
                    prisma_2.prisma.mcpDevice.findFirst = originals.mcpDeviceFindFirst;
                    prisma_2.prisma.compartment.findFirst = originals.compartmentFindFirst;
                    prisma_2.prisma.$transaction = originals.transaction;
                });
                prisma_2.prisma.cabinet.findUnique = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ id: 'cabinet-1', status: prisma_1.CabinetStatus.CONFIGURING, mcpDevices: [], compartments: [] })];
                }); }); };
                prisma_2.prisma.mcpDevice.findFirst = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ id: 'mcp-1', cabinetId: 'cabinet-1' })];
                }); }); };
                prisma_2.prisma.compartment.findFirst = function (args) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        calls.push(args);
                        return [2 /*return*/, null];
                    });
                }); };
                prisma_2.prisma.$transaction = function (fn) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, fn({
                                compartment: {
                                    create: function (args) { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, (__assign({ id: 'comp-4', cabinetId: 'cabinet-1', name: 'A4', status: prisma_1.CompartmentAvailability.AVAILABLE }, args.data))];
                                        });
                                    }); },
                                },
                                cabinet: {
                                    update: function () { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, ({
                                                    id: 'cabinet-1',
                                                    configVersion: 2,
                                                    compartments: [{ id: 'comp-4', name: 'A4' }],
                                                })];
                                        });
                                    }); },
                                },
                            })];
                    });
                }); };
                return [4 /*yield*/, (0, compartment_service_1.createCompartment)('cabinet-1', {
                        name: 'A4',
                        size: prisma_1.CompartmentSize.SMALL,
                        lockMcpDeviceId: 'mcp-1',
                        sensorMcpDeviceId: null,
                        mcp23017PinLock: 6,
                    })];
            case 1:
                result = _a.sent();
                strict_1.default.equal(result.compartment.mcp23017PinSensor, 0);
                strict_1.default.equal(result.compartment.sensorMcpDeviceId, null);
                strict_1.default.equal(calls.length, 2);
                return [2 /*return*/];
        }
    });
}); });
(0, node_test_1.default)('deleteCompartment rejects occupied compartments', function (t) { return __awaiter(void 0, void 0, void 0, function () {
    var originals;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                originals = {
                    compartmentFindUnique: prisma_2.prisma.compartment.findUnique,
                };
                t.after(function () {
                    prisma_2.prisma.compartment.findUnique = originals.compartmentFindUnique;
                });
                prisma_2.prisma.compartment.findUnique = function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, ({
                                id: 'comp-1',
                                cabinetId: 'cabinet-1',
                                status: prisma_1.CompartmentAvailability.OCCUPIED,
                            })];
                    });
                }); };
                return [4 /*yield*/, strict_1.default.rejects(function () { return (0, compartment_service_1.deleteCompartment)('comp-1'); }, /Cannot delete occupied compartment/)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
