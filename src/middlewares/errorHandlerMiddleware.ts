import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

type CustomError = Error & { type?: string };

export default function errorHandler(
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (error.type === "conflict") {
    res.status(httpStatus.CONFLICT).send(error.message);
    return;
  }
  if (error.type === "notFound") {
    res.status(httpStatus.NOT_FOUND).send(error.message);
    return;
  }
  if (error.type === "unauthorized") {
    res.status(httpStatus.UNAUTHORIZED).send(error.message);
    return;
  }
  if (error.type === "badRequest") {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
    return;
  }
  res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
}
