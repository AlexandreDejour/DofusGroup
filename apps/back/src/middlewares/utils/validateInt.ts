import { NextFunction, Request, Response } from "express";

import createHttpError from "http-errors";

export default function validateInt(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    next(createHttpError(400, "Invalid ID"));
    return;
  }

  next();
}
