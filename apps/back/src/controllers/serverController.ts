import { NextFunction, Request, Response } from "express";

import Server from "../models/Server.js";

export interface IServerController {
  getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
  getOne(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const serverController: IServerController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const servers: Server[] = await Server.findAll();

      if (servers.length === 0) {
        res.status(404).json({ error: "Any server found" });
        return;
      }

      res.json(servers);
    } catch (error) {
      next(error);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = parseInt(req.params.id, 10);

      const server: Server | null = await Server.findByPk(id);

      if (!server) {
        next();
        return;
      }

      res.json(server);
    } catch (error) {
      next(error);
    }
  },
};
