import { NextFunction, Request, Response } from "express";

export type Server = {
  id: number;
  name: string;
  mono_account: boolean;
};

export interface IServerController {
  getAll(req: Request, res: Response, next: NextFunction): void;
  getOne(req: Request, res: Response, next: NextFunction): void;
}
