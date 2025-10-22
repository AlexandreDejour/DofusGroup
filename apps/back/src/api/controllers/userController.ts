import status from "http-status";
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";

import { User, UserBodyData, UserEnriched } from "../../types/user.js";
import { UserRepository } from "../../middlewares/repository/userRepository.js";

export class UserController {
  private repository: UserRepository;

  public constructor(repository: UserRepository) {
    this.repository = repository;
  }

  public async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const users: User[] = await this.repository.getAll();

      if (!users.length) {
        const error = createHttpError(status.NO_CONTENT, "Any user found");
        return next(error);
      }

      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  public async getAllEnriched(
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const users: UserEnriched[] = await this.repository.getAllEnriched();

      if (!users.length) {
        const error = createHttpError(status.NO_CONTENT, "Any user found");
        return next(error);
      }
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;

    try {
      const user: User | null = await this.repository.getOne(userId);

      if (!user) {
        const error = createHttpError(status.NOT_FOUND, "User not found");
        return next(error);
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  public async getOneEnriched(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;

    try {
      const user: UserEnriched | null =
        await this.repository.getOneEnriched(userId);

      if (!user) {
        const error = createHttpError(status.NOT_FOUND, "User not found");
        return next(error);
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.userId) {
        const error = createHttpError(
          status.BAD_REQUEST,
          "User ID is required",
        );
        return next(error);
      }

      const { userId } = req.params;
      const userData: Partial<UserBodyData> = req.body;

      const userUpdated: User | null = await this.repository.update(
        userId,
        userData,
      );

      if (!userUpdated) {
        const error = createHttpError(status.NOT_FOUND, "User not found");
        return next(error);
      }

      res.json(userUpdated);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.userId) {
        const error = createHttpError(
          status.BAD_REQUEST,
          "User ID is required",
        );
        return next(error);
      }

      const { userId } = req.params;

      const result: boolean = await this.repository.delete(userId);

      if (!result) {
        const error = createHttpError(status.NOT_FOUND, "User not found");
        return next(error);
      }

      res.status(status.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  }
}
