import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import Tag from "./Tag.js";
import User from "./User.js";
import Server from "./Server.js";
import Character from "./Character.js";

import client from "../client.js";
import { SequelizeModels } from "../types/sequelizeModels.js";

export interface IEvent {
  id: number;
  title: string;
  date: Date;
  description: string;
  max_players: number;
  status: string;
}

export default class Event extends Model<
  InferAttributes<Event>,
  InferCreationAttributes<Event>
> {
  declare public id: CreationOptional<string>;
  declare public title: string;
  declare public date: Date;
  declare public duration: number;
  declare public area: string;
  declare public sub_area: string;
  declare public donjon_name: string;
  declare public description?: string;
  declare public max_players: number;
  declare public status: string;

  declare public tag?: Tag;
  declare public user?: User;
  declare public server?: Server;
  declare public characters?: Character[];

  public static associate(models: SequelizeModels) {
    Event.belongsTo(Tag, {
      foreignKey: "tag_id",
      as: "tag",
    });

    Event.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "author",
    });

    Event.belongsToMany(models.Character, {
      foreignKey: "event_id",
      otherKey: "character_id",
      as: "team",
      through: "event_team",
    });

    Event.belongsTo(models.Server, {
      foreignKey: "server_id",
      as: "server",
    });
  }
}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    area: {
      type: DataTypes.STRING,
    },
    sub_area: {
      type: DataTypes.STRING,
    },
    donjon_name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    max_players: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "public",
    },
  },
  {
    sequelize: client,
  },
);
