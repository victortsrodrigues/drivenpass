"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
var http_status_1 = __importDefault(require("http-status"));
function errorHandler(error, req, res, next) {
    if (error.type === "conflict") {
        res.status(http_status_1.default.CONFLICT).send(error.message);
        return;
    }
    if (error.type === "notFound") {
        res.status(http_status_1.default.NOT_FOUND).send(error.message);
        return;
    }
    if (error.type === "unauthorized") {
        res.status(http_status_1.default.UNAUTHORIZED).send(error.message);
        return;
    }
    if (error.type === "badRequest") {
        res.status(http_status_1.default.BAD_REQUEST).send(error.message);
        return;
    }
    res.sendStatus(http_status_1.default.INTERNAL_SERVER_ERROR);
}
