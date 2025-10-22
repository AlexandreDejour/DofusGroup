import status from "http-status";
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";

import { Server } from "../../types/server.js";
import { ServerRepository } from "../../middlewares/repository/serverRepository.js";

export class ServerController {
  private repository: ServerRepository;

  public constructor(repository: ServerRepository) {
    this.repository = repository;
  }

  public async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const servers: Server[] = await this.repository.getAll();

      if (!servers.length) {
        const error = createHttpError(status.NO_CONTENT, "Any server found");
        return next(error);
      }

      res.json(servers);
    } catch (error) {
      next(error);
    }
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id: string = req.params.serverId;

      const server: Server | null = await this.repository.getOne(id);

      if (!server) {
        const error = createHttpError(status.NOT_FOUND, "Server not found");
        return next(error);
      }

      res.json(server);
    } catch (error) {
      next(error);
    }
  }
}
