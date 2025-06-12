import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import Event from "./Event.js";
import Character from "./Character.js";

import { client } from "../client/client.js";

export interface IUser {
  id: number;
  username: string;
  password: string;
  mail: string;
}

export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare public id: CreationOptional<number>;
  declare public username: string;
  declare public password: string;
  declare public mail: string;

  declare public events?: Event[];
  declare public characters?: Character[];

  static associate() {
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
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      autoIncrementIdentity: true,
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
