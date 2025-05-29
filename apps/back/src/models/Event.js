import { Model, DataTypes } from "sequelize";

import { client } from "../client/client.js";

class Event extends Model {};

Event.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
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
        max_players: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,           
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "public"
        }
    },
    {
        sequelize: client 
    }
);

export { Event };
