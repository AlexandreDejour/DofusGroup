import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import User from "./User.js";
import Event from "./Event.js";
import Breed from "./Breed.js";
import Server from "./Server.js";

import client from "../client.js";
import { SequelizeModels } from "../types/sequelizeModels.js";

export default class CharacterEntity extends Model<
  InferAttributes<CharacterEntity>,
  InferCreationAttributes<CharacterEntity>
> {
  declare public id: CreationOptional<string>;
  declare public name: string;
  declare public sex: string;
  declare public level: number;
  declare public alignment: string;
  declare public stuff: string;
  declare public default_character: boolean;

  declare public user_id: string;
  declare public server_id: string;
  declare public breed_id: string;

  declare public user?: User;
  declare public breed?: Breed;
  declare public server?: Server;
  declare public events?: Event[];

  declare public addEvents: (characterIds: string[]) => Promise<void>;

  public static associate(models: SequelizeModels) {
    CharacterEntity.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    CharacterEntity.belongsTo(models.Breed, {
      foreignKey: "breed_id",
      as: "breed",
    });

    CharacterEntity.belongsTo(models.Server, {
      foreignKey: "server_id",
      as: "server",
    });

    CharacterEntity.belongsToMany(models.Event, {
      foreignKey: "character_id",
      otherKey: "event_id",
      as: "events",
      through: "event_team",
    });
  }
}

CharacterEntity.init(
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
    sex: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    alignment: {
      type: DataTypes.STRING,
    },
    stuff: {
      type: DataTypes.STRING,
    },
    default_character: {
      type: DataTypes.BOOLEAN,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    server_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    breed_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: client,
    tableName: "characters",
  },
);
