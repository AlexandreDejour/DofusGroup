import { Request, Response, NextFunction } from "express";
import status from "http-status";
import createHttpError, { HttpError } from "http-errors";

import { Config } from "../../config/config.js";
import logger from "./logger.js";

const config = Config.getInstance();

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(createHttpError(status.NOT_FOUND, "Not Found"));
}

export function errorHandler(
  error: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode: number =
    error.status || error.statusCode || status.INTERNAL_SERVER_ERROR;
  console.error(error);

  if (config.environment === "production") {
    if (statusCode < 500) {
      logger.warn(`${statusCode} - ${error.message}`);
    } else logger.error(`Error: ${error.message}`, { stack: error.stack });
  }

  res.status(statusCode).json({
    message: error.message || "Internal Server Error",
  });
}
