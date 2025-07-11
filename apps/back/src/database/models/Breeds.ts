import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import Character from "./Character.js";

import client from "../client.js";
import { SequelizeModels } from "../types/sequelizeModels.js";

export default class BreedEntity extends Model<
  InferAttributes<BreedEntity>,
  InferCreationAttributes<BreedEntity>
> {
  declare public id: CreationOptional<string>;
  declare public name: string;

  declare public character?: Character[];

  public static associate(models: SequelizeModels) {
    BreedEntity.hasMany(models.Character, {
      foreignKey: "breed_id",
      as: "characters",
    });
  }
}

BreedEntity.init(
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
    tableName: "breeds",
  },
);
