import argon2 from "argon2";
import status from "http-status";
import createHttpError from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CookieOptions, NextFunction, Request, Response } from "express";

import { Config } from "../../config/config.js";
import { AuthenticatedRequest } from "../../middlewares/utils/authService.js";
import { AuthUser } from "../../types/user.js";
import { authUserSchema } from "../../middlewares/joi/schemas/auth.js";
import { AuthRepository } from "../../middlewares/repository/authRepository.js";
import { AuthService } from "../../middlewares/utils/authService.js";

export class AuthController {
  private config: Config;
  private service: AuthService;
  private repository: AuthRepository;
  private cookieOptions: CookieOptions;

  public constructor(service: AuthService, repository: AuthRepository) {
    this.config = Config.getInstance();
    this.service = service;
    this.repository = repository;
    this.cookieOptions = {
      httpOnly: true,
      secure: this.config.environment === "production",
      sameSite: "lax",
      path: "/",
      domain:
        this.config.environment === "production" ? ".dofusgroup.fr" : undefined,
    };
  }

  public async register(req: Request, res: Response, next: NextFunction) {
    const username = req.body.username;

    try {
      const isExist: AuthUser | null =
        await this.repository.findOneByUsername(username);

      if (isExist) {
        const error = createHttpError(status.CONFLICT, "Username forbidden");
        return next(error);
      }

      const newUser: AuthUser = await this.repository.register(req.body);

      res.status(status.CREATED).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    const { mail, password } = req.body;

    try {
      const user: AuthUser | null = await this.repository.findOneByMail(mail);

      if (!user) {
        const error = createHttpError(
          status.UNAUTHORIZED,
          "Email or password unavailable",
        );
        return next(error);
      }

      const isPasswordMatch = await argon2.verify(user.password, password);

      if (!isPasswordMatch) {
        const error = createHttpError(
          status.UNAUTHORIZED,
          "Email or password unavailable",
        );
        return next(error);
      }

      const accessToken = await this.service.generateAccessToken(user.id);
      const refreshToken = await this.service.generateRefreshToken(user.id);
      const { password: _password, ...userWithoutPassword } = user;

      res
        .cookie("token", accessToken, this.cookieOptions)
        .cookie("refresh_token", refreshToken, this.cookieOptions)
        .json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  }

  public async apiMe(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if (!token) {
      res
        .status(status.UNAUTHORIZED)
        .json({ user: null, message: "No token, please login" });
      return;
    }

    try {
      const decoded = jwt.verify(token, this.config.jwtSecret);

      if (typeof decoded === "string") {
        const error = createHttpError(
          status.BAD_REQUEST,
          "Invalid token payload",
        );
        return next(error);
      }

      const payload = decoded as JwtPayload & { id: string };
      const user = await this.repository.findOneById(payload.id);

      if (!user) {
        res
          .clearCookie("token", this.cookieOptions)
          .json({ message: "User not found" });
        return;
      }

      const { password: _password, ...userWithoutPassword } = user;

      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res
          .clearCookie("token", this.cookieOptions)
          .status(status.UNAUTHORIZED)
          .json({ message: "Token expired, please login." });
      } else {
        next(error);
      }
    }
  }

  public async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refresh_token;
      console.log("refreshToken", refreshToken);

      if (!refreshToken) {
        res.status(status.UNAUTHORIZED).json({ message: "No refresh token" });
        return;
      }

      const decoded = jwt.verify(refreshToken, this.config.refreshSecret);
      const payload = decoded as JwtPayload & { id: string };
      const newAccessToken = this.service.generateAccessToken(payload.id);

      res.cookie("access_token", newAccessToken, this.cookieOptions);
      res.json({ message: "Access token renewed" });
    } catch (error) {
      res.clearCookie("refresh_token", this.cookieOptions);
      res
        .status(status.UNAUTHORIZED)
        .json({ message: "Invalid or expired refresh token" });
    }
  }

  public async isPasswordMatch(
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ) {
    if (!req.body.password) {
      return next();
    }

    const { oldPassword } = req.body;

    try {
      const { value, error } = authUserSchema.validate({
        userId: req.userId,
      });

      if (error) {
        const error = createHttpError(
          status.BAD_REQUEST,
          "Invalid or missing user ID",
        );
        return next(error);
      }

      const id = value.userId;
      const user: AuthUser | null = await this.repository.findOneById(id);

      if (!user) {
        const error = createHttpError(status.NOT_FOUND, "User not found");
        return next(error);
      }

      const isPasswordMatch = await argon2.verify(user.password, oldPassword);

      if (!isPasswordMatch) {
        const error = createHttpError(
          status.UNAUTHORIZED,
          "Old password doesn't match current password",
        );
        return next(error);
      }

      next();
    } catch (error) {
      next(error);
    }
  }

  public async getAccount(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { value, error } = authUserSchema.validate({ userId: req.userId });

      if (error) {
        const error = createHttpError(
          status.BAD_REQUEST,
          "Invalid or missing user ID",
        );
        return next(error);
      }

      const id = value.userId;

      const user = await this.repository.findOneById(id);

      if (!user) {
        const error = createHttpError(status.NOT_FOUND, "User not found");
        return next(error);
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  public logout(_req: Request, res: Response, _next: NextFunction) {
    res
      .clearCookie("token", this.cookieOptions)
      .clearCookie("resh_token", this.cookieOptions)
      .json({ message: "Successfully logout" });
  }
}
