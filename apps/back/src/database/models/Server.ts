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

export default class ServerEntity extends Model<
  InferAttributes<ServerEntity>,
  InferCreationAttributes<ServerEntity>
> {
  declare public id: CreationOptional<number>;
  declare public name: string;
  declare public mono_account: boolean;

  declare public events?: Event[];
  declare public characters?: Character[];

  public static associate(models: SequelizeModels) {
    ServerEntity.hasMany(models.Event, {
      foreignKey: "server_id",
      as: "events",
    });

    ServerEntity.hasMany(models.Character, {
      foreignKey: "server_id",
      as: "characters",
    });
  }
}

ServerEntity.init(
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
      unique: true,
    },
    mono_account: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize: client,
    tableName: "servers",
  },
);
