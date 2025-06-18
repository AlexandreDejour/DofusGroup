import { NextFunction, Request, Response } from "express";

export interface IServerController {
  getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
  getOne(req: Request, res: Response, next: NextFunction): Promise<void>;
}
