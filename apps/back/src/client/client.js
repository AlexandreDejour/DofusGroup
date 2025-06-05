import "dotenv/config";

import { Sequelize } from "sequelize";

const client = new Sequelize(
    process.env.PG_URL, {
        dialect: "postgres",
        define: { underscored: true }
    }
);

export { client };
