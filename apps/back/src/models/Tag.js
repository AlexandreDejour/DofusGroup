import { Model, DataTypes } from "sequelize";

import { client } from "../client/client.js";

class Tag extends Model {};

Tag.init(
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
        area: {
            type: DataTypes.STRING,
        },
        subarea: {
            type: DataTypes.STRING,
        },
        donjon_name: {
            type: DataTypes.STRING
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: client
    }
);

export { Tag };
