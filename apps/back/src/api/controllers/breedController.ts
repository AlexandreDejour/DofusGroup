import status from "http-status";
import createHttpError from "http-errors";
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
        const error = createHttpError(status.NO_CONTENT, "Any breed found");
        return next(error);
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
        const error = createHttpError(status.NOT_FOUND, "Breed not found");
        return next(error);
      }

      res.json(breed);
    } catch (error) {
      next(error);
    }
  }
}
