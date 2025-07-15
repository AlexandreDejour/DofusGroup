import { NextFunction, Request, Response } from "express";
import status from "http-status";
import createHttpError from "http-errors";
import argon2 from "argon2";

export default async function hashPassword(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (req.body.password) {
    const password = req.body.password;

    try {
      const hash = await argon2.hash(password);

      req.body.password = hash;
    } catch (error) {
      next(
        createHttpError(
          status.INTERNAL_SERVER_ERROR,
          "Internal server error during password hashing",
        ),
      );
    }
  } else next();
}
