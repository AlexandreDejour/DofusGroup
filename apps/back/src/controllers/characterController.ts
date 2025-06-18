import { Request, Response, NextFunction } from "express";

import Character, { ICharacter } from "../models/Character.js";

export interface ICharacterParams {
  userId: string;
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

export const characterController: ICharacterController = {
  async getAllByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: number = parseInt(req.params.userId, 10);

      const characters: ICharacter[] = await Character.findAll({
        where: { user_id: userId },
      });

      if (characters.length === 0) {
        res.status(404).json({ error: "No characters found for this user" });
        return;
      }

      res.json(characters);
    } catch (error) {
      next(error);
    }
  },

  async getOneByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: number = parseInt(req.params.userId, 10);
      const characterId: number = parseInt(req.params.characterId, 10);

      const character: ICharacter | null = await Character.findOne({
        where: { id: characterId, user_id: userId },
      });

      if (!character) {
        res.status(404).json({ error: "Character not found for this user" });
        return;
      }

      res.json(character);
    } catch (error) {
      next(error);
    }
  },

  async getAllByUserIdEnriched(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId: number = parseInt(req.params.userId, 10);

      const characters: ICharacter[] = await Character.findAll({
        where: { user_id: userId },
        include: ["server", "breed", "events"],
      });

      if (characters.length === 0) {
        res.status(404).json({ error: "No characters found for this user" });
        return;
      }

      res.json(characters);
    } catch (error) {
      next(error);
    }
  },

  async getOneByUserIdEnriched(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId: number = parseInt(req.params.userId, 10);
      const characterId: number = parseInt(req.params.characterId, 10);

      const character: ICharacter | null = await Character.findOne({
        where: { id: characterId, user_id: userId },
        include: ["server", "breed", "events"],
      });

      if (!character) {
        res.status(404).json({ error: "Character not found for this user" });
        return;
      }

      res.json(character);
    } catch (error) {
      next(error);
    }
  },

  async postCharacter(
    req: Request<ICharacterParams, unknown, IPostCharacterBody>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId: number = parseInt(req.params.userId, 10);

      if (!req.params.userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }
      const characterData: IPostCharacterBody = req.body;

      // Ensure the character belongs to the user
      characterData.user_id = userId;

      const newCharacter: ICharacter = await Character.create(characterData);

      res.status(201).json(newCharacter);
    } catch (error) {
      next(error);
    }
  },

  async patchCharacter(
    req: Request<ICharacterParams, unknown, Partial<IPostCharacterBody>>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId: number = parseInt(req.params.userId, 10);

      if (!req.params.characterId) {
        res.status(400).json({ error: "Character ID is required" });
        return;
      }

      const characterId: number = parseInt(req.params.characterId, 10);
      const updateData: Partial<IPostCharacterBody> = req.body;

      // Ensure the character belongs to the user
      const character: Character | null = await Character.findOne({
        where: { id: characterId, user_id: userId },
      });

      if (!character) {
        res.status(404).json({ error: "Character not found for this user" });
        return;
      }

      await character.update(updateData);

      res.json(character);
    } catch (error) {
      next(error);
    }
  },
};
