import status from "http-status";
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
        res.status(status.NO_CONTENT).json({ error: "Any user found" });
        return;
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
        res.status(status.NO_CONTENT).json({ error: "Any user found" });
        return;
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
        res.status(status.NOT_FOUND).json({ error: "User not found" });
        return;
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
        res.status(status.NOT_FOUND).json({ error: "User not found" });
        return;
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  public async post(req: Request, res: Response, next: NextFunction) {
    const username = req.body.username;

    try {
      const isExist: boolean =
        await this.repository.findOneByUsername(username);

      if (isExist) {
        res.status(status.CONFLICT).json({ error: "Username forbidden" });
        return;
      }

      const newUser: User = await this.repository.post(req.body);

      res.status(status.CREATED).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.userId) {
        res.status(status.BAD_REQUEST).json({ error: "User ID is required" });
        return;
      }

      const { userId } = req.params;
      const userData: Partial<UserBodyData> = req.body;

      const userUpdated: User | null = await this.repository.update(
        userId,
        userData,
      );

      if (!userUpdated) {
        res.status(status.NOT_FOUND).json({ error: "User not found" });
        return;
      }

      res.json(userUpdated);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.userId) {
        res.status(status.BAD_REQUEST).json({ error: "User ID is required" });
        return;
      }

      const { userId } = req.params;

      const result: boolean = await this.repository.delete(userId);

      if (!result) {
        res.status(status.NOT_FOUND).json({ error: "User not found" });
        return;
      }

      res.status(status.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  }
}
