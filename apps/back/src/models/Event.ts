import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import { client } from "../client/client.js";

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
  declare public id: CreationOptional<number>;
  declare public title: string;
  declare public date: Date;
  declare public description?: string;
  declare public max_players: number;
  declare public status: string;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      autoIncrementIdentity: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
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
