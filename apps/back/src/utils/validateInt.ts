import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export default function validateInt(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  for (const [key, value] of Object.entries(req.params)) {
    if (!/^\d+$/.test(value)) {
      next(
        createHttpError(400, `Invalid ${key} parameter : must be an integer`),
      );
      return;
    }
  }
  next();
}
