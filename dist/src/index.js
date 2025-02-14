"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importStar(require("express"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
require("express-async-errors");
var errorHandlerMiddleware_1 = __importDefault(require("./middlewares/errorHandlerMiddleware"));
var authRouter_1 = __importDefault(require("./routers/authRouter"));
var credentialsRouter_1 = __importDefault(require("./routers/credentialsRouter"));
var userRouter_1 = __importDefault(require("./routers/userRouter"));
dotenv_1.default.config();
var app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, express_1.json)());
// Health check route
app.get("/health", function (req, res) {
    res.status(200).send("I'm OK");
});
// Routes
app.use(authRouter_1.default);
app.use(credentialsRouter_1.default);
app.use(userRouter_1.default);
app.use(errorHandlerMiddleware_1.default);
var port = Number(process.env.PORT) || 5000;
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
