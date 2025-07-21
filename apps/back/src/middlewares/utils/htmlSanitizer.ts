import { Request, Response, NextFunction } from "express";
import status from "http-status";

import sanitizeHtml from "sanitize-html";
import createHttpError from "http-errors";

export default function htmlSanitizer(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  try {
    if (typeof req.body === "object") {
      Object.keys(req.body).forEach((key) => {
        const value = req.body[key];
        if (typeof value === "string") {
          req.body[key] = sanitizeHtml(value);
        }
      });
    }
    next();
  } catch (error) {
    next(createHttpError(status.BAD_REQUEST, "Sanitization failed"));
  }
}
