import { Model, DataTypes } from "sequelize";

import { client } from "../client/client.js";

class Server extends Model {};

Server.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            autoIncrementIdentity: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        mono_account: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    },
    {
        sequelize: client
    }
);

export { Server };
