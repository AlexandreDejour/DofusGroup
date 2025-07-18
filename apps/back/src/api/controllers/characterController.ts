import status from "http-status";
import { NextFunction, Request, Response } from "express";

import {
  Character,
  CharacterBodyData,
  CharacterEnriched,
} from "../../types/character.js";
import { CharacterRepository } from "../../middlewares/repository/characterRepository.js";

export class CharacterController {
  private repository: CharacterRepository;

  public constructor(repository: CharacterRepository) {
    this.repository = repository;
  }

  public async getAllByUserId(req: Request, res: Response, next: NextFunction) {
    const userId: string = req.params.userId;

    try {
      const characters: Character[] =
        await this.repository.getAllByUserId(userId);

      if (!characters.length) {
        res.status(status.NO_CONTENT).json({ error: "Any character found" });
        return;
      }

      res.json(characters);
    } catch (error) {
      next(error);
    }
  }

  public async getAllEnrichedByUserId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const userId: string = req.params.userId;

    try {
      const characters: CharacterEnriched[] =
        await this.repository.getAllEnrichedByUserId(userId);

      if (!characters.length) {
        res.status(status.NO_CONTENT).json({ error: "Any character found" });
        return;
      }
      res.json(characters);
    } catch (error) {
      next(error);
    }
  }

  public async getOneByUserId(req: Request, res: Response, next: NextFunction) {
    const { userId, characterId } = req.params;

    try {
      const character: Character | null = await this.repository.getOneByUserId(
        userId,
        characterId,
      );

      if (!character) {
        res.status(status.NOT_FOUND).json({ error: "Character not found" });
        return;
      }

      res.json(character);
    } catch (error) {
      next(error);
    }
  }

  public async getOneEnrichedByUserId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { userId, characterId } = req.params;

    try {
      const character: CharacterEnriched | null =
        await this.repository.getOneEnrichedByUserId(userId, characterId);

      if (!character) {
        res.status(status.NOT_FOUND).json({ error: "Character not found" });
        return;
      }

      res.json(character);
    } catch (error) {
      next(error);
    }
  }

  public async post(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.params.userId);
      if (!req.params.userId) {
        res.status(status.BAD_REQUEST).json({ error: "User ID is required" });
        return;
      }

      const userId: string = req.params.userId;
      const characterData: CharacterBodyData = { ...req.body, user_id: userId };

      const newCharacter: CharacterEnriched =
        await this.repository.post(characterData);

      res.status(status.CREATED).json(newCharacter);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.userId) {
        res.status(status.BAD_REQUEST).json({ error: "User ID is required" });
        return;
      }

      const { userId, characterId } = req.params;
      const characterData: Partial<CharacterBodyData> = req.body;

      const characterUpdated: Character | null = await this.repository.update(
        userId,
        characterId,
        characterData,
      );

      if (!characterUpdated) {
        res.status(status.NOT_FOUND).json({ error: "Character not found" });
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
        res.status(status.BAD_REQUEST).json({ error: "User ID is required" });
        return;
      }

      const { userId, characterId } = req.params;

      const result: boolean = await this.repository.delete(userId, characterId);

      if (!result) {
        res.status(status.NOT_FOUND).json({ error: "Character not found" });
        return;
      }

      res.status(status.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  }
}
