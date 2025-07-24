import status from "http-status";
import argon2 from "argon2";
import { NextFunction, Request, Response } from "express";

import { AuthUser } from "../../types/user.js";
import { AuthRepository } from "../../middlewares/repository/authRepository.js";

export class AuthController {
  private repository: AuthRepository;

  public constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  public async register(req: Request, res: Response, next: NextFunction) {
    const username = req.body.username;

    try {
      const isExist: boolean =
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
    const { mail, password } = req.body;

    try {
      let user: AuthUser | null = await this.repository.findOneByMail(mail);

      if (!user) {
        res
          .status(status.UNAUTHORIZED)
          .json({ error: "Mail or password unavailable" });
        return;
      }

      const isPasswordMatch = await argon2.verify(user.password, password);

      if (!isPasswordMatch) {
        res
          .status(status.UNAUTHORIZED)
          .json({ error: "Mail or password unavailable" });
      }

      const accessToken = this.repository.generateAccessToken(user.id);

      res.json({ ...user, accessToken, password: undefined });
    } catch (error) {
      next(error);
    }
  }
}
