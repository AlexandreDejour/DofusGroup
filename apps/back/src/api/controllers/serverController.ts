import { NextFunction, Request, Response } from "express";

import { Server } from "../../types/server.js";
import { ServerRepository } from "../../middlewares/repository/serverRepository.js";

export class ServerController {
  private repository: ServerRepository;

  public constructor() {
    this.repository = new ServerRepository();
  }

  public async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const servers: Server[] = await this.repository.getAll();

      if (!servers.length) {
        res.status(404).json({ error: "Any server found" });
        return;
      }

      res.json(servers);
    } catch (error) {
      next(error);
    }
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = parseInt(req.params.id, 10);

      const server: Server | null = await this.repository.getOne(id);

      if (!server) {
        res.status(404).json({ error: "Server not found" });
        return;
      }

      res.json(server);
    } catch (error) {
      next(error);
    }
  }
}
