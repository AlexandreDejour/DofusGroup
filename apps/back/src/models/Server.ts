import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import { client } from "../client/client.js";

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
