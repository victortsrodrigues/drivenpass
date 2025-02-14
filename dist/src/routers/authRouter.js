"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var schemaMiddleware_1 = require("../middlewares/schemaMiddleware");
var bodySchemas_1 = require("../schemas/bodySchemas");
var authController_1 = __importDefault(require("../controllers/authController"));
var authRouter = (0, express_1.Router)();
authRouter.post("/sign-up", (0, schemaMiddleware_1.validateSchema)(bodySchemas_1.signUpSchema), authController_1.default.signUp);
authRouter.post("/sign-in", (0, schemaMiddleware_1.validateSchema)(bodySchemas_1.signInSchema), authController_1.default.signIn);
exports.default = authRouter;
