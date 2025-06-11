import { Sequelize } from "sequelize";

import { app } from "../app/app.js";

console.log(app.get("pg_url"));

const client: Sequelize = new Sequelize(app.get("pg_url") as string, {
  dialect: "postgres",
  define: { underscored: true },
});

export { client };
