import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import Event from "./Event.js";
import Character from "./Character.js";

import client from "../client.js";
import { SequelizeModels } from "../types/sequelizeModels.js";

export interface IUser {
  id: string;
  username: string;
  mail: string;
}

export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare public id: CreationOptional<string>;
  declare public username: string;
  declare public password: string;
  declare public mail: string;

  declare public events?: Event[];
  declare public characters?: Character[];

  public static associate(models: SequelizeModels) {
    User.hasMany(models.Event, {
      foreignKey: "user_id",
      as: "events",
    });

    User.hasMany(models.Character, {
      foreignKey: "user_id",
      as: "characters",
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: client,
  },
);

export { User };
