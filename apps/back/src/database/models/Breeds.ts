import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
} from "sequelize";

import client from "../client.js";
import { SequelizeModels } from "../types/sequelizeModels.js";

export interface IBreed {
  id: string;
  name: string;
}

export default class Breed extends Model<
  InferAttributes<Breed>,
  InferCreationAttributes<Breed>
> {
  declare public id: CreationOptional<string>;
  declare public name: string;

  public static associate(models: SequelizeModels) {
    Breed.hasMany(models.Character, {
      foreignKey: "breed_id",
      as: "characters",
    });
  }
}

Breed.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: client,
  },
);
