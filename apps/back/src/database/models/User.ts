import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import Event from "./Event.js";
import Comment from "./Comment.js";
import Character from "./Character.js";

import client from "../client.js";
import { SequelizeModels } from "../types/sequelizeModels.js";

export default class UserEntity extends Model<
  InferAttributes<UserEntity>,
  InferCreationAttributes<UserEntity>
> {
  declare public id: CreationOptional<string>;
  declare public username: string;
  declare public password: string;
  declare public mail: string;

  declare public events?: Event[];
  declare public comments?: Comment[];
  declare public characters?: Character[];

  public static associate(models: SequelizeModels) {
    UserEntity.hasMany(models.Event, {
      foreignKey: "user_id",
      as: "events",
    });

    UserEntity.hasMany(models.Character, {
      foreignKey: "user_id",
      as: "characters",
    });

    UserEntity.hasMany(models.Comment, {
      foreignKey: "user_id",
      as: "comments",
    });
  }
}

UserEntity.init(
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
    tableName: "users",
  },
);
