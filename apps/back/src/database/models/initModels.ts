import { SequelizeModels } from "../types/sequelizeModels.js";

import Tag from "./Tag.js";
import User from "./User.js";
import Event from "./Event.js";
import Breed from "./Breed.js";
import Server from "./Server.js";
import Comment from "./Comment.js";
import Character from "./Character.js";

export const models: SequelizeModels = {
  Tag,
  User,
  Breed,
  Event,
  Server,
  Comment,
  Character,
};

interface ModelWithAssociations {
  associate?: (models: SequelizeModels) => void;
}

export function initAssociations(models: SequelizeModels) {
  Object.values(models).forEach((model) => {
    const modelWithAssociations: ModelWithAssociations =
      model as ModelWithAssociations;
    modelWithAssociations.associate?.(models);
  });
}
