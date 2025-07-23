import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import User from "./User.js";
import Event from "./Event.js";

import client from "../client.js";
import { SequelizeModels } from "../types/sequelizeModels.js";

export default class CommentEntity extends Model<
  InferAttributes<CommentEntity>,
  InferCreationAttributes<CommentEntity>
> {
  declare public id: CreationOptional<string>;
  declare public content: string;

  declare public user_id: string;
  declare public event_id: string;

  declare public user?: User;
  declare public event?: Event;

  public static associate(models: SequelizeModels) {
    CommentEntity.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    CommentEntity.belongsTo(models.Event, {
      foreignKey: "event_id",
      as: "event",
    });
  }
}

CommentEntity.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: client,
    tableName: "comments",
  },
);
