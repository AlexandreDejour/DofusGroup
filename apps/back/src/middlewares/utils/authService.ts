import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { jwtSchema } from "../joi/schemas/auth.js";
import { Config } from "../../config/config.js";
import status from "http-status";

export class AuthService {
  private config = Config.getInstance();
  private jwtSecret: string;

  constructor() {
    const config = Config.getInstance();
    this.jwtSecret = config.jwtSecret;
  }

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

  public async checkPermission(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.headers["x-user-id-x"]) {
      res.status(status.UNAUTHORIZED).json({ error: "Unautorized access" });
      return;
    }

    const headersId = req.headers["x-user-id-x"];
    const paramsId = req.params.userId;

    if (headersId !== paramsId) {
      res.status(status.FORBIDDEN).json({ error: "Forbidden access" });
      return;
    }

    next();
  }

  public async generateAccessToken(userId: string) {
    if (!this.jwtSecret) {
      throw new Error("JWT_SECRET is not set");
    }

    console.log(this.jwtSecret);

    return jwt.sign({ sub: userId }, this.jwtSecret, {
      expiresIn: "2h",
    });
  }
}
