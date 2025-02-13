import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import httpStatus from "http-status";

export function validateSchema(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
      const message = validation.error.details.map((detail) => detail.message);
      res.status(httpStatus.UNPROCESSABLE_ENTITY).send(message);
      return;
    }

    next();
  };
}
