"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var userController_1 = __importDefault(require("../controllers/userController"));
var userRouter = (0, express_1.Router)();
userRouter.use(authMiddleware_1.validadeToken);
userRouter.delete("/erase", userController_1.default.deleteAccount);
exports.default = userRouter;
