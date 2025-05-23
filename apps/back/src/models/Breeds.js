import { Model, DataTypes } from "sequelize";

import { client } from "../client/client.js";

class Breed extends Model {};

Breed.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, 
            autoIncrementIdentity: true
        },
        name: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sex: {
            type: DataTypes.STRING,
            allowNull: false
        },
        miniature: {
            type: DataTypes.BLOB("long"),
            allowNull: false,
        },
        image: {
            type: DataTypes.BLOB("long"),
            allowNull: false
        }
    },
    {
        sequelize: client
    }
);

export { Breed };
