import { Model, DataTypes } from "sequelize";

import { client } from "../client/client.js";

class Breed extends Model {};

Breed.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, 
            autoIncrementIdentity: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    },
    {
        sequelize: client
    }
);

export { Breed };
