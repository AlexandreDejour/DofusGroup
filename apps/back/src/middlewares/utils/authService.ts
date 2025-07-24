import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { jwtSchema } from "../joi/schemas/auth.js";
import { Config } from "../../config/config.js";

export class AuthService {
  private config = Config.getInstance();

  public async setAuthUserHeader(
    req: Request,
    _res: Response,
    next: NextFunction,
  ) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return next();
    }

    const [type, token] = authorization.split(" ");

    try {
      if (type !== "Bearer") {
        return next();
      }

      const { value, error } = jwtSchema.validate(
        jwt.verify(token, this.config.jwtSecret),
      );

      if (error) {
        return next(error);
      }

      req.headers["x-user-id-x"] = value.sub;

      next();
    } catch (error) {
      next(error);
    }
  }
}
