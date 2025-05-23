import { Sequelize } from "sequelize";

import { app } from "../app/app.js"

const client = new Sequelize(
    app.get("pg_url"), {
        dialect: "postgres",
        define: { underscored: true }
    }
);

export { client };
