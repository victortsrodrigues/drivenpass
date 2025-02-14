"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundError = notFoundError;
function notFoundError(resource) {
    return {
        type: "notFound",
        message: "".concat(resource, " not found!")
    };
}
