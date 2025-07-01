import { NextFunction, Request, Response } from "express";

import createHttpError from "http-errors";

export default function validateUUID(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { id } = req.params;

  const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidV4Regex.test(id)) {
    next(createHttpError(400, "Invalid ID"));
    return;
  }

  next();
}
