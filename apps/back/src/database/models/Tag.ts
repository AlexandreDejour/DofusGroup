import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import Event from "./Event.js";

import client from "../client.js";
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
  declare public color: string;

  declare public events?: Event[];

  public static associate(models: SequelizeModels) {
    Tag.hasMany(models.Event, {
      foreignKey: "tag_id",
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
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: client,
  },
);
