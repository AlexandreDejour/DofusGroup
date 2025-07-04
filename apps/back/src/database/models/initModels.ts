import { SequelizeModels } from "../types/sequelizeModels.js";

import Tag from "./Tag.js";
import User from "./User.js";
import Breed from "./Breeds.js";
import Event from "./Event.js";
import Server from "./Server.js";
import Character from "./Character.js";

export const models: SequelizeModels = {
  Tag,
  User,
  Breed,
  Event,
  Server,
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
