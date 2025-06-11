import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import Event from "./Event.js";

import { client } from "../client/client.js";
import { SequelizeModels } from "../types/sequelizeModels.js";

export interface ITag {
  id: number;
  name: string;
  area: string;
  sub_area: string;
  donjon_name: string;
  color: string;
}

export default class Tag extends Model<
  InferAttributes<Tag>,
  InferCreationAttributes<Tag>
> {
  declare public id: CreationOptional<number>;
  declare public name: string;
  declare public area: string;
  declare public sub_area: string;
  declare public donjon_name: string;
  declare public color: string;

  declare public events?: Event[];

  public static associate(models: SequelizeModels) {
    Tag.hasMany(models.Event, {
      foreignKey: "event_id",
      as: "events",
    });
  }
}

Tag.init(
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
    area: {
      type: DataTypes.STRING,
    },
    sub_area: {
      type: DataTypes.STRING,
    },
    donjon_name: {
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: client,
  },
);
