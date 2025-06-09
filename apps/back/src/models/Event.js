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
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "User",
                key: "id"
            },
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tag_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "Tag",
                key: "id"
            },
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
        },
        server_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "Server",
                key: "id"
            },
            allowNull: false
        }
    },
    {
        sequelize: client 
    }
);

export { Event };
