import { NextFunction, Request, Response } from "express";

import { IServerController, Server } from "./types/server.js";
import { serverRepository } from "../../middlewares/repository/serverRepository.js";

const ServerRepository = serverRepository;

export class ServerController implements IServerController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const servers: Server[] = await ServerRepository.getAll();

      if (!servers.length) {
        res.status(404).json({ error: "Any server found" });
        return;
      }

      res.json(servers);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = parseInt(req.params.id, 10);

      const server: Server | null = await serverRepository.getOne(id);

      if (!server) {
        next();
        return;
      }

      res.json(server);
    } catch (error) {
      next(error);
    }
  }
}

export const serverController = new ServerController();
