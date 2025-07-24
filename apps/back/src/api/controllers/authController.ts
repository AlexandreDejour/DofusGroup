import status from "http-status";
import { NextFunction, Request, Response } from "express";

import { AuthUser } from "../../types/user.js";
import { UserRepository } from "../../middlewares/repository/userRepository.js";

export class AuthController {
  private repository: UserRepository;

  public constructor(repository: UserRepository) {
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

      const newUser: AuthUser = await this.repository.post(req.body);

      res.status(status.CREATED).json(newUser);
    } catch (error) {
      next(error);
    }
  }
}
