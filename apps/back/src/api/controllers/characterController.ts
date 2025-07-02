import { NextFunction, Request, Response } from "express";

import {
  Character,
  CharacterBodyData,
  CharacterEnriched,
} from "../../types/character.js";
import { CharacterRepository } from "../../middlewares/repository/characterRepository.js";

export class CharacterController {
  private repository: CharacterRepository;

  public constructor() {
    this.repository = new CharacterRepository();
  }

  public async getAllByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: string = req.params.userId;

      const characters: Character[] =
        await this.repository.getAllByUserId(userId);

      if (!characters.length) {
        res.status(404).json({ error: "Any character found" });
        return;
      }

      res.json(characters);
    } catch (error) {
      next(error);
    }
  }

  public async getAllByUserIdEnriched(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId: string = req.params.userId;

      const characters: CharacterEnriched[] =
        await this.repository.getAllByUserIdEnriched(userId);

      if (!characters.length) {
        res.status(404).json({ error: "Any character found" });
        return;
      }
      res.json(characters);
    } catch (error) {
      next(error);
    }
  }

  public async getOneByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, characterId } = req.params;

      const character: Character | null = await this.repository.getOneByUserId(
        userId,
        characterId,
      );

      if (!character) {
        res.status(404).json({ error: "Character not found" });
        return;
      }

      res.json(character);
    } catch (error) {
      next(error);
    }
  }

  public async getOneByUserIdEnriched(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId, characterId } = req.params;

      const character: CharacterEnriched | null =
        await this.repository.getOneByUserIdEnriched(userId, characterId);

      if (!character) {
        res.status(404).json({ error: "Character not found" });
        return;
      }

      res.json(character);
    } catch (error) {
      next(error);
    }
  }

  public async post(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const userId: string = req.params.userId;
      const characterData: CharacterBodyData = { ...req.body, user_id: userId };

      const newCharacter: Character = await this.repository.post(characterData);

      if (!newCharacter) {
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      res.json(newCharacter);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const userId: string = req.params.userId;
      const characterData: CharacterBodyData = { ...req.body, user_id: userId };

      const characterUpdated: Character | null =
        await this.repository.update(characterData);

      if (!characterUpdated) {
        res.status(404).json({ error: "Character not found" });
        return;
      }

      res.json(characterUpdated);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const { userId, characterId } = req.params;

      const result = await this.repository.delete(userId, characterId);

      if (!result) {
        res.status(404).json({ error: "Character not found" });
        return;
      }

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}
