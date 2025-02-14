"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var schemaMiddleware_1 = require("../middlewares/schemaMiddleware");
var bodySchemas_1 = require("../schemas/bodySchemas");
var credentialsController_1 = __importDefault(require("../controllers/credentialsController"));
var credentialsRouter = (0, express_1.Router)();
credentialsRouter.use(authMiddleware_1.validadeToken);
credentialsRouter.post("/credentials", (0, schemaMiddleware_1.validateSchema)(bodySchemas_1.credentialSchema), credentialsController_1.default.createCredential);
credentialsRouter.get("/credentials", credentialsController_1.default.getCredentials);
credentialsRouter.get("/credentials/:id", credentialsController_1.default.getCredentialById);
credentialsRouter.put("/credentials/:id", (0, schemaMiddleware_1.validateSchema)(bodySchemas_1.credentialSchema), credentialsController_1.default.updateCredential);
credentialsRouter.delete("/credentials/:id", credentialsController_1.default.deleteCredential);
exports.default = credentialsRouter;
