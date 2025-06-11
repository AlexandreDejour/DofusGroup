import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import Character from "./Character.js";

import { client } from "../client/client.js";
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

  declare public characters?: Character[];

  public static associate(models: SequelizeModels) {
    Breed.hasMany(models.Character, {
      foreignKey: "character_id",
      as: "characters",
    });
  }
}

Breed.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true,
      autoIncrementIdentity: true,
    },
    name: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: client,
  },
);
