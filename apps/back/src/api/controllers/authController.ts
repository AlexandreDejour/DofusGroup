import crypto from "crypto";
import argon2 from "argon2";
import status from "http-status";
import createHttpError from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CookieOptions, NextFunction, Request, Response } from "express";

import { AuthUser } from "../../types/user.js";
import { Config } from "../../config/config.js";
import { AuthService } from "../../middlewares/utils/authService.js";
import { authUserSchema } from "../../middlewares/joi/schemas/auth.js";
import { MailService } from "../../middlewares/nodemailer/nodemailer.js";
import { AuthenticatedRequest } from "../../middlewares/utils/authService.js";
import { AuthRepository } from "../../middlewares/repository/authRepository.js";
import { UserRepository } from "../../middlewares/repository/userRepository.js";

export class AuthController {
  private config: Config;
  private service: AuthService;
  private mailService: MailService;
  private repository: AuthRepository;
  private userRepository: UserRepository;
  private cookieOptions: CookieOptions;

  public constructor(
    service: AuthService,
    repository: AuthRepository,
    userRepository: UserRepository,
    mailService: MailService,
  ) {
    this.config = Config.getInstance();
    this.service = service;
    this.mailService = mailService;
    this.repository = repository;
    this.userRepository = userRepository;
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
    const language = req.headers["accept-language"]?.split(",")[0] || "fr";
    const username = req.body.username;

    try {
      const isExist: AuthUser | null =
        await this.repository.findOneByUsername(username);

      if (isExist) {
        const error = createHttpError(status.CONFLICT, "Username forbidden");
        return next(error);
      }

      const token = crypto.randomBytes(32).toString("hex");
      const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); //24h
      const userData = { token, expirationDate, ...req.body };

      const newUser: AuthUser = await this.repository.register(userData);

      await this.mailService.sendVerificationMail(
        newUser.mail,
        language,
        token,
      );

      res.status(status.CREATED).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  public async verifyEmail(req: Request, res: Response, next: NextFunction) {
    const token = req.query.token as string;

    try {
      if (!token)
        return res
          .status(status.BAD_REQUEST)
          .json({ message: "Token not found" });

      const user = await this.repository.findOneByToken(token);

      if (!user)
        return res.status(status.NOT_FOUND).json({ message: "User not found" });

      if (
        user.verification_expires_at &&
        user.verification_expires_at < new Date()
      )
        return res
          .status(status.BAD_REQUEST)
          .json({ message: "Token expired" });

      user.is_verified = true;
      user.verification_token = null;
      user.verification_expires_at = null;

      await this.userRepository.update(user.id, user);

      res.redirect("https://dofusgroup.fr/email-verified");
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
        .cookie("access_token", accessToken, this.cookieOptions)
        .cookie("refresh_token", refreshToken, this.cookieOptions)
        .json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  }

  public async apiMe(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.access_token;
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
          .status(status.NOT_FOUND)
          .clearCookie("access_token", this.cookieOptions)
          .clearCookie("refresh_token", this.cookieOptions)
          .json({ message: "User not found" });
        return;
      }

      const { password: _password, ...userWithoutPassword } = user;

      res.json(userWithoutPassword);
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

  public async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        res.status(status.UNAUTHORIZED).json({ message: "No refresh token" });
        return;
      }

      const decoded = jwt.verify(refreshToken, this.config.refreshSecret);
      const payload = decoded as JwtPayload & { id: string };
      const newAccessToken = await this.service.generateAccessToken(payload.id);

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
      .clearCookie("access_token", this.cookieOptions)
      .clearCookie("refresh_token", this.cookieOptions)
      .json({ message: "Successfully logout" });
  }
}
