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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var credentialsServices_1 = __importDefault(require("../services/credentialsServices"));
var http_status_1 = __importDefault(require("http-status"));
function createCredential(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var body, userId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    userId = res.locals.userId;
                    return [4 /*yield*/, credentialsServices_1.default.createCredential(body, userId)];
                case 1:
                    _a.sent();
                    res.sendStatus(http_status_1.default.CREATED);
                    return [2 /*return*/];
            }
        });
    });
}
function getCredentials(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, credentials;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = res.locals.userId;
                    return [4 /*yield*/, credentialsServices_1.default.getCredentials(userId)];
                case 1:
                    credentials = _a.sent();
                    res.status(http_status_1.default.OK).send(credentials);
                    return [2 /*return*/];
            }
        });
    });
}
function getCredentialById(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, id, credential;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = res.locals.userId;
                    id = req.params.id;
                    return [4 /*yield*/, credentialsServices_1.default.getCredentialById(id, userId)];
                case 1:
                    credential = _a.sent();
                    res.status(http_status_1.default.OK).send(credential);
                    return [2 /*return*/];
            }
        });
    });
}
function updateCredential(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, id, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = res.locals.userId;
                    id = req.params.id;
                    body = req.body;
                    return [4 /*yield*/, credentialsServices_1.default.updateCredential(id, body, userId)];
                case 1:
                    _a.sent();
                    res.sendStatus(http_status_1.default.NO_CONTENT);
                    return [2 /*return*/];
            }
        });
    });
}
function deleteCredential(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = res.locals.userId;
                    id = req.params.id;
                    return [4 /*yield*/, credentialsServices_1.default.deleteCredential(id, userId)];
                case 1:
                    _a.sent();
                    res.sendStatus(http_status_1.default.NO_CONTENT);
                    return [2 /*return*/];
            }
        });
    });
}
var credentialsController = {
    createCredential: createCredential,
    getCredentials: getCredentials,
    getCredentialById: getCredentialById,
    updateCredential: updateCredential,
    deleteCredential: deleteCredential,
};
exports.default = credentialsController;
