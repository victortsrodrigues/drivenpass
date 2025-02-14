"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badRequestError = badRequestError;
function badRequestError(resource) {
    return {
        type: "badRequest",
        message: "".concat(resource, " must be a positive number!")
    };
}
