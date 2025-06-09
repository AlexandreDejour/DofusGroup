import { Model, DataTypes } from "sequelize";

import { client } from "../client/client.js";

class User extends Model {};

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            autoIncrementIdentity: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        avatar: {
            type: DataTypes.STRING,
        },
        character_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "Character",
                key: "id"
            }
        },
        event_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "Event",
                key: "id"
            }
        }
    },
    {
        sequelize: client
    }
);

export { User };
