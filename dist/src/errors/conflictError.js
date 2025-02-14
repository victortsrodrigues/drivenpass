"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conflictError = conflictError;
function conflictError(resource) {
    return {
        type: "conflict",
        message: "".concat(resource, " already exists!")
    };
}
