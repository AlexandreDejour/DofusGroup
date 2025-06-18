import { Request, Response, NextFunction } from "express";

export interface ICharacterParams {
  userId?: string;
  characterId?: string;
}

export interface IPostCharacterBody {
  name: string;
  sex: string;
  level: number;
  alignment: string;
  stuff: string;
  default_character: boolean;
  user_id: number;
  breed_id: number;
  server_id: number;
}

export interface ICharacterController {
  getAllByUserId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getOneByUserId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getAllByUserIdEnriched(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getOneByUserIdEnriched(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  postCharacter(req: Request, res: Response, next: NextFunction): Promise<void>;
  patchCharacter(
    req: Request<ICharacterParams, unknown, Partial<IPostCharacterBody>>,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  deleteCharacter(
    req: Request<ICharacterParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
