import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import Event from "./Event.js";
import Character from "./Character.js";

import client from "../client/client.js";
import { SequelizeModels } from "../types/sequelizeModels.js";

export interface IServer {
  id: number;
  name: string;
  mono_account: boolean;
}

export default class Server extends Model<
  InferAttributes<Server>,
  InferCreationAttributes<Server>
> {
  declare public id: CreationOptional<number>;
  declare public name: string;
  declare public mono_account: boolean;

  declare public events?: Event[];
  declare public characters?: Character[];

  public static associate(models: SequelizeModels) {
    Server.hasMany(models.Event, {
      foreignKey: "server_id",
      as: "events",
    });

    Server.hasMany(models.Character, {
      foreignKey: "server_id",
      as: "characters",
    });
  }
}

Server.init(
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
  },
);
