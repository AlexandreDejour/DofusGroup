import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { jwtSchema } from "../joi/schemas/auth.js";
import { Config } from "../../config/config.js";
import status from "http-status";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export class AuthService {
  private config = Config.getInstance();
  private jwtSecret: string;
  private refreshSecret: string;

  constructor() {
    this.config = Config.getInstance();
    this.jwtSecret = this.config.jwtSecret;
    this.refreshSecret = this.config.refreshSecret;
  }

  public async setAuthUserRequest(
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ) {
    const token = req.cookies.access_token;

    if (!token) {
      return next();
    }

    try {
      const { value, error } = jwtSchema.validate(
        jwt.verify(token, this.config.jwtSecret),
      );

      if (error) {
        return next(error);
      }

      req.userId = value.id;
      next();
    } catch (error) {
      next(error);
    }
  }

  public async checkPermission(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.userId) {
      res.status(status.UNAUTHORIZED).json({ error: "Unautorized access" });
      return;
    }

    const tokenId = req.userId;
    const paramsId = req.params.userId;

    if (tokenId !== paramsId) {
      res.status(status.FORBIDDEN).json({ error: "Forbidden access" });
      return;
    }

    next();
  }

  public async generateAccessToken(userId: string) {
    if (!this.jwtSecret) {
      throw new Error("JWT_SECRET is not set");
    }

    return jwt.sign({ id: userId }, this.jwtSecret, {
      expiresIn: "2h",
    });
  }

  public async generateRefreshToken(userId: string) {
    if (!this.jwtSecret) {
      throw new Error("JWT_SECRET is not set");
    }

    return jwt.sign({ id: userId }, this.refreshSecret, {
      expiresIn: "7d",
    });
  }
}
