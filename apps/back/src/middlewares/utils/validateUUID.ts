import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export default function validateUUIDParams(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  for (const [key, value] of Object.entries(req.params)) {
    if (!uuidV4Regex.test(value)) {
      return next(createHttpError(400, `Invalid parameter "${key}"`));
    }
  }

  next();
}
