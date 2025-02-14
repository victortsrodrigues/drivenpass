"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unauthorizedError = unauthorizedError;
function unauthorizedError(resource) {
    return {
        type: "unauthorized",
        message: "".concat(resource, " unauthorized!")
    };
}
