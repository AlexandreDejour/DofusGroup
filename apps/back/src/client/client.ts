import { Sequelize } from "sequelize";

import { app } from "../app/app.js";

const client: Sequelize = new Sequelize(app.get("pg_url") as string, {
  dialect: "postgres",
  define: {
    timestamps: true,
    underscored: true,
  },
});

export { client };
