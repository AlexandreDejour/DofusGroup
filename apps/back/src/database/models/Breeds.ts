import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import client from "../client.js";
import { SequelizeModels } from "../types/sequelizeModels.js";

export interface IBreed {
  id: number;
  name: string;
}

export default class Breed extends Model<
  InferAttributes<Breed>,
  InferCreationAttributes<Breed>
> {
  declare public id: CreationOptional<number>;
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
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      autoIncrementIdentity: true,
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
