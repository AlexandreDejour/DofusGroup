import BreedEntity from "../../database/models/Breeds.js";
import { Breed } from "../../types/breed.js";

export class BreedRepository {
  public async getAll(): Promise<Breed[]> {
    try {
      const result: BreedEntity[] = await BreedEntity.findAll();

      if (!result.length) {
        throw new Error("Any breed found");
      }

      const breeds: Breed[] = result.map((breed: BreedEntity) =>
        breed.get({ plain: true }),
      );

      return breeds;
    } catch (error) {
      throw error;
    }
  }

  public async getOne(id: string): Promise<Breed | null> {
    try {
      const result: BreedEntity | null = await BreedEntity.findByPk(id);

      if (!result) {
        return null;
      }

      const breed: Breed = result.get({ plain: true });

      return breed;
    } catch (error) {
      throw error;
    }
  }
}
