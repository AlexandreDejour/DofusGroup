import { Model, DataTypes } from "sequelize";

import { client } from "../client/client.js";

class Character extends Model {};

Character.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            autoIncrementIdentity: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "User",
                key: "id"
            },
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sex: {
            type: DataTypes.STRING,
            allowNull: false
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        server_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "Server",
                key: "id"
            },
            allowNull: false
        },
        alignment: {
            type: DataTypes.STRING,
        },
        breed_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "Breed",
                key: "id"
            },
            allowNull: false
        },
        stuff: {
            type: DataTypes.STRING,
        },
        default_character: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        sequelize: client
    }
);

export { Character };