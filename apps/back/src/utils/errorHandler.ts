import { Request, Response, NextFunction } from "express";

import createHttpError, { HttpError } from "http-errors";

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(createHttpError(404, "Not Found"));
}

export function errorHandler(error: HttpError, _req: Request, res: Response) {
  const statusCode: number = error.statusCode || 500;

  console.error(error);

  res.status(statusCode).json({
    error: error.message,
  });
}
