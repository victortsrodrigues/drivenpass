import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { unauthorizedError } from "../errors/unauthorizedError";
dotenv.config();

export async function validadeToken(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer", "").trim();
  if (!token) throw unauthorizedError("");

  // verify token
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) throw unauthorizedError("");
    if (!decoded || typeof decoded !== 'object') throw unauthorizedError("");
    const userId = decoded.userId;
    if (!userId) throw unauthorizedError("");
    res.locals.userId = userId;

    next();
  });
}