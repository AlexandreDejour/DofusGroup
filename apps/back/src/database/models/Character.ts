import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import User from "./User.js";
import Event from "./Event.js";
import Breed from "./Breeds.js";
import Server from "./Server.js";

import client from "../client.js";
import { SequelizeModels } from "../types/sequelizeModels.js";

export interface ICharacter {
  id: string;
  name: string;
  level: number;
  alignment: string;
  stuff: string;
}

export default class Character extends Model<
  InferAttributes<Character>,
  InferCreationAttributes<Character>
> {
  declare public id: CreationOptional<string>;
  declare public name: string;
  declare public sex: string;
  declare public level: number;
  declare public alignment: string;
  declare public stuff: string;
  declare public default_character: boolean;

  declare public user?: User;
  declare public breed?: Breed;
  declare public server?: Server;
  declare public events?: Event[];

  public static associate(models: SequelizeModels) {
    Character.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    Character.belongsTo(models.Breed, {
      foreignKey: "breed_id",
      as: "breed",
    });

    Character.belongsTo(models.Server, {
      foreignKey: "server_id",
      as: "server",
    });

    Character.belongsToMany(models.Event, {
      foreignKey: "character_id",
      otherKey: "server_id",
      as: "events",
      through: "event_team",
    });
  }
}

Character.init(
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
  },
  {
    sequelize: client,
  },
);
