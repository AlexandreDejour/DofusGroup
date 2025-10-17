import argon2 from "argon2";
import status from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

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

  public constructor(service: AuthService, repository: AuthRepository) {
    this.config = Config.getInstance();
    this.service = service;
    this.repository = repository;
  }

  public async register(req: Request, res: Response, next: NextFunction) {
    const username = req.body.username;

    try {
      const isExist: AuthUser | null =
        await this.repository.findOneByUsername(username);

      if (isExist) {
        res.status(status.CONFLICT).json({ error: "Username forbidden" });
        return;
      }

      const newUser: AuthUser = await this.repository.register(req.body);

      res.status(status.CREATED).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;

    try {
      const user: AuthUser | null =
        await this.repository.findOneByUsername(username);

      if (!user) {
        res
          .status(status.UNAUTHORIZED)
          .json({ error: "Username or password unavailable" });
        return;
      }

      const isPasswordMatch = await argon2.verify(user.password, password);

      if (!isPasswordMatch) {
        res
          .status(status.UNAUTHORIZED)
          .json({ error: "Username or password unavailable" });
        return;
      }

      const accessToken = await this.service.generateAccessToken(user.id);
      const { password: _password, ...userWithoutPassword } = user;

      res
        .cookie("token", accessToken, {
          httpOnly: true,
          // TODO swap to true
          secure: false, // HTTPS needed
          sameSite: "lax", // authorized secured cross-site
          path: "/", // cookie send for all routes
          maxAge: 7200000,
        })
        .json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  }

  public async apiMe(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if (!token) {
      res.status(status.UNAUTHORIZED).json({ message: "Unauthorized access" });
      return;
    }

    try {
      const decoded = jwt.verify(token, this.config.jwtSecret);

      if (typeof decoded === "string") {
        res
          .status(status.BAD_REQUEST)
          .json({ message: "Invalid token payload" });
        return;
      }

      const payload = decoded as JwtPayload & { id: string };
      const user = await this.repository.findOneById(payload.id);

      if (!user) {
        res.status(status.NOT_FOUND).json({ message: "User not found" });
        return;
      }

      const { password: _password, ...userWithoutPassword } = user;

      res.json(userWithoutPassword);
      return;
    } catch (error) {
      next(error);
    }
  }

  public async isPasswordMatch(
    req: AuthenticatedRequest,
    res: Response,
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
        res
          .status(status.BAD_REQUEST)
          .json({ message: "Invalid or missing user ID" });
        return;
      }

      const id = value.userId;
      const user: AuthUser | null = await this.repository.findOneById(id);

      if (!user) {
        res.status(status.NOT_FOUND).json({ message: "User not found" });
        return;
      }

      const isPasswordMatch = await argon2.verify(user.password, oldPassword);

      if (!isPasswordMatch) {
        res.status(status.UNAUTHORIZED).json({
          error: "Old password doesn't match current password",
        });
        return;
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
        res
          .status(status.BAD_REQUEST)
          .json({ message: "Invalid or missing user ID" });
        return;
      }

      const id = value.userId;

      const user = await this.repository.findOneById(id);

      if (!user) {
        res.status(status.NOT_FOUND).json({ message: "User not found" });
        return;
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  public logout(_req: Request, res: Response, _next: NextFunction) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // same as cookie
      sameSite: "lax", // same as cookie
      path: "/", // same as cookie
    });
    res.json({ message: "Successfully logout" });
  }
}
