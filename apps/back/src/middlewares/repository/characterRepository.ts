import CharacterEntity from "../../database/models/Character.js";
import {
  Character,
  CharacterEnriched,
  CharacterBodyData,
} from "../../types/character.js";

export class CharacterRepository {
  public async getAllByUserId(userId: string): Promise<Character[]> {
    try {
      const result: CharacterEntity[] = await CharacterEntity.findAll({
        where: { user_id: userId },
      });

      const characters: Character[] = result.map((character: CharacterEntity) =>
        character.get({ plain: true }),
      );

      return characters;
    } catch (error) {
      throw error;
    }
  }

  public async getAllEnrichedByUserId(
    userId: string,
  ): Promise<CharacterEnriched[]> {
    try {
      const result: CharacterEntity[] = await CharacterEntity.findAll({
        where: { user_id: userId },
        include: ["server", "breed", "events"],
      });

      const characters: CharacterEnriched[] = result.map(
        (character: CharacterEntity) => character.get({ plain: true }),
      );

      return characters;
    } catch (error) {
      throw error;
    }
  }

  public async getOneByUserId(
    userId: string,
    characterId: string,
  ): Promise<Character | null> {
    try {
      const result: CharacterEntity | null = await CharacterEntity.findOne({
        where: { id: characterId, user_id: userId },
      });

      if (!result) {
        return null;
      }

      const character: Character = result.get({ plain: true });

      return character;
    } catch (error) {
      throw error;
    }
  }

  public async getOneEnrichedByUserId(
    userId: string,
    characterId: string,
  ): Promise<Character | null> {
    try {
      const result: CharacterEntity | null = await CharacterEntity.findOne({
        where: { id: characterId, user_id: userId },
        include: ["server", "breed", "events"],
      });

      if (!result) {
        return null;
      }

      const character: Character = result.get({ plain: true });

      return character;
    } catch (error) {
      throw error;
    }
  }

  public async post(characterData: CharacterBodyData): Promise<Character> {
    try {
      const result: CharacterEntity =
        await CharacterEntity.create(characterData);

      const newCharacter = result.get({ plain: true });

      return newCharacter;
    } catch (error) {
      throw error;
    }
  }

  public async update(
    characterId: string,
    characterData: Partial<CharacterBodyData>,
  ): Promise<Character | null> {
    try {
      const characterToUpdate: CharacterEntity | null =
        await CharacterEntity.findOne({
          where: { id: characterId, user_id: characterData.user_id },
        });

      if (!characterToUpdate) {
        return null;
      }

      const result: CharacterEntity =
        await characterToUpdate.update(characterData);

      const characterUpdated = result.get({ plain: true });

      return characterUpdated;
    } catch (error) {
      throw error;
    }
  }

  public async delete(userId: string, characterId: string): Promise<boolean> {
    try {
      const result: CharacterEntity | null = await CharacterEntity.findOne({
        where: { id: characterId, user_id: userId },
      });

      if (!result) {
        return false;
      }

      result.destroy();

      return true;
    } catch (error) {
      throw error;
    }
  }
}
