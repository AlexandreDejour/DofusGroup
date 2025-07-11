import status from "http-status";
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
        res.status(status.NOT_FOUND).json({ error: "Any server found" });
        return;
      }

      res.json(servers);
    } catch (error) {
      next(error);
    }
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id: string = req.params.id;

      const server: Server | null = await this.repository.getOne(id);

      if (!server) {
        res.status(status.NOT_FOUND).json({ error: "Server not found" });
        return;
      }

      res.json(server);
    } catch (error) {
      next(error);
    }
  }
}
