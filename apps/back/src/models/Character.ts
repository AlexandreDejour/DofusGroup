import { Model, DataTypes } from "sequelize";

import { client } from "../client/client.js";

class Character extends Model {}

Character.init(
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
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    alignment: {
      type: DataTypes.STRING,
    },
    stuff: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: client,
  }
);

export { Character };
