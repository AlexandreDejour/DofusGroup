import TagEntity from "../../database/models/Tag.js";
import { Tag } from "../../types/tag.js";

export class TagRepository {
  public async getAll(): Promise<Tag[]> {
    try {
      const result: TagEntity[] = await TagEntity.findAll();

      if (!result.length) {
        throw new Error("Any tag found");
      }

      const tags: Tag[] = result.map((tag: TagEntity) =>
        tag.get({ plain: true }),
      );

      return tags;
    } catch (error) {
      throw error;
    }
  }

  public async getOne(id: string): Promise<Tag | null> {
    try {
      const result: TagEntity | null = await TagEntity.findByPk(id);

      if (!result) {
        return null;
      }

      const tag: Tag = result.get({ plain: true });

      return tag;
    } catch (error) {
      throw error;
    }
  }
}
