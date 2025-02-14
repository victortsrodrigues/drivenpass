"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentialSchema = exports.signInSchema = exports.signUpSchema = void 0;
var joi_1 = __importDefault(require("joi"));
exports.signUpSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must have at least 2 characters",
        "any.required": "Name is required",
    }),
    email: joi_1.default.string().trim().email().required().messages({
        "string.email": "Please provide a valid email",
        "string.empty": "Email cannot be empty",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().trim().min(6).required().messages({
        "string.min": "Password must have at least 6 characters",
        "string.empty": "Password cannot be empty",
        "any.required": "Password is required",
    }),
});
exports.signInSchema = joi_1.default.object({
    email: joi_1.default.string().trim().email().required().messages({
        "string.email": "Please provide a valid email",
        "string.empty": "Email cannot be empty",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().trim().min(6).required().messages({
        "string.min": "Password must have at least 6 characters",
        "string.empty": "Password cannot be empty",
        "any.required": "Password is required",
    }),
});
exports.credentialSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(2).required().messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
        "string.min": "Title must have at least 2 characters",
        "any.required": "Title is required",
    }),
    url: joi_1.default.string().trim().required().messages({
        "string.empty": "URL cannot be empty",
        "any.required": "URL is required",
    }),
    username: joi_1.default.string().trim().min(2).required().messages({
        "string.base": "Username must be a string",
        "string.empty": "Username cannot be empty",
        "string.min": "Username must have at least 2 characters",
        "any.required": "Username is required",
    }),
    password: joi_1.default.string().trim().min(6).required().messages({
        "string.min": "Password must have at least 6 characters",
        "string.empty": "Password cannot be empty",
        "any.required": "Password is required",
    }),
});
