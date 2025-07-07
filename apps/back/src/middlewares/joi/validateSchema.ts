import { Request, Response, NextFunction } from "express";
import status from "http-status";
import Joi from "joi";

export default function validateSchema(schema: Joi.ObjectSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        res.status(status.BAD_REQUEST).json({
          error: true,
          message: error.message,
          details: error.details.map((detail: Joi.ValidationErrorItem) => ({
            message: detail.message,
          })),
        });
      } else {
        next(error);
      }
    }
  };
}
