import status from "http-status";
import { NextFunction, Request, Response } from "express";

import { Breed } from "../../types/breed.js";
import { BreedRepository } from "../../middlewares/repository/breedRepository.js";

export class BreedController {
  private repository: BreedRepository;

  public constructor(repository: BreedRepository) {
    this.repository = repository;
  }

  public async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const breeds: Breed[] = await this.repository.getAll();

      if (!breeds.length) {
        res.status(status.NO_CONTENT).json({ error: "Any breed found" });
        return;
      }

      res.json(breeds);
    } catch (error) {
      next(error);
    }
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id: string = req.params.breedId;

      const breed: Breed | null = await this.repository.getOne(id);

      if (!breed) {
        res.status(status.NOT_FOUND).json({ error: "Breed not found" });
        return;
      }

      res.json(breed);
    } catch (error) {
      next(error);
    }
  }
}
