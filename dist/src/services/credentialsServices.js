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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cryptr_1 = __importDefault(require("cryptr"));
var conflictError_1 = require("../errors/conflictError");
var credentialsRepository_1 = __importDefault(require("../repositories/credentialsRepository"));
var notFoundError_1 = require("../errors/notFoundError");
var badRequestError_1 = require("../errors/badRequestError");
var cryptr = new cryptr_1.default("myTotallySecretKey");
function createCredential(body, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var existingCredential, hashedPassword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, credentialsRepository_1.default.findCredentialByTitleAndId(body.title, userId)];
                case 1:
                    existingCredential = _a.sent();
                    if (existingCredential)
                        throw (0, conflictError_1.conflictError)("Credential with the same title");
                    hashedPassword = cryptr.encrypt(body.password);
                    return [4 /*yield*/, credentialsRepository_1.default.createCredential(body, userId, hashedPassword)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getCredentials(user_id) {
    return __awaiter(this, void 0, void 0, function () {
        var credentials, decryptedCredentials;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, credentialsRepository_1.default.getCredentials(user_id)];
                case 1:
                    credentials = _a.sent();
                    decryptedCredentials = credentials.map(function (credential) {
                        return __assign(__assign({}, credential), { password: cryptr.decrypt(credential.password) });
                    });
                    return [2 /*return*/, decryptedCredentials];
            }
        });
    });
}
function getCredentialById(id, user_id) {
    return __awaiter(this, void 0, void 0, function () {
        var credential, decryptedCredential;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isNaN(Number(id)))
                        throw (0, badRequestError_1.badRequestError)("Id");
                    if (Number(id) <= 0)
                        throw (0, badRequestError_1.badRequestError)("Id");
                    return [4 /*yield*/, credentialsRepository_1.default.getCredentialById(Number(id), user_id)];
                case 1:
                    credential = _a.sent();
                    if (!credential)
                        throw (0, notFoundError_1.notFoundError)("Credential");
                    decryptedCredential = __assign(__assign({}, credential), { password: cryptr.decrypt(credential.password) });
                    return [2 /*return*/, decryptedCredential];
            }
        });
    });
}
function updateCredential(id, body, user_id) {
    return __awaiter(this, void 0, void 0, function () {
        var credential, hashedPassword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isNaN(Number(id)))
                        throw (0, badRequestError_1.badRequestError)("Id");
                    if (Number(id) <= 0)
                        throw (0, badRequestError_1.badRequestError)("Id");
                    return [4 /*yield*/, credentialsRepository_1.default.getCredentialById(Number(id), user_id)];
                case 1:
                    credential = _a.sent();
                    if (!credential)
                        throw (0, notFoundError_1.notFoundError)("Credential");
                    hashedPassword = cryptr.encrypt(body.password);
                    return [4 /*yield*/, credentialsRepository_1.default.updateCredential(Number(id), body, user_id, hashedPassword)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function deleteCredential(id, user_id) {
    return __awaiter(this, void 0, void 0, function () {
        var credential;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isNaN(Number(id)))
                        throw (0, badRequestError_1.badRequestError)("Id");
                    if (Number(id) <= 0)
                        throw (0, badRequestError_1.badRequestError)("Id");
                    return [4 /*yield*/, credentialsRepository_1.default.getCredentialById(Number(id), user_id)];
                case 1:
                    credential = _a.sent();
                    if (!credential)
                        throw (0, notFoundError_1.notFoundError)("Credential");
                    return [4 /*yield*/, credentialsRepository_1.default.deleteCredential(Number(id), user_id)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var credentialsServices = {
    createCredential: createCredential,
    getCredentials: getCredentials,
    getCredentialById: getCredentialById,
    updateCredential: updateCredential,
    deleteCredential: deleteCredential,
};
exports.default = credentialsServices;
