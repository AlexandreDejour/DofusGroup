import { Request, Response, NextFunction, CookieOptions } from "express";
import jwt from "jsonwebtoken";
import status from "http-status";

import { jwtSchema } from "../joi/schemas/auth.js";
import { Config } from "../../config/config.js";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export class AuthService {
  private config = Config.getInstance();
  private jwtSecret: string;
  private refreshSecret: string;
  private cookieOptions: CookieOptions;

  constructor() {
    this.config = Config.getInstance();
    this.jwtSecret = this.config.jwtSecret;
    this.refreshSecret = this.config.refreshSecret;
    this.cookieOptions = {
      httpOnly: true,
      secure: this.config.environment === "production",
      sameSite: "lax",
      path: "/",
      domain:
        this.config.environment === "production" ? ".dofusgroup.fr" : undefined,
    };
  }

  public async setAuthUserRequest(
    req: AuthenticatedRequest,
    res: Response,
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
      if (error instanceof jwt.TokenExpiredError) {
        res
          .clearCookie("access_token", this.cookieOptions)
          .clearCookie("refresh_token", this.cookieOptions)
          .status(status.UNAUTHORIZED)
          .json({ message: "Token expired, please login." });
      } else {
        next(error);
      }
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
    if (!this.refreshSecret) {
      throw new Error("REFRESH_SECRET is not set");
    }

    return jwt.sign({ id: userId }, this.refreshSecret, {
      expiresIn: "7d",
    });
  }
}
