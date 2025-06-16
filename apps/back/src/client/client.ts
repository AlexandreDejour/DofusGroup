import * as dotenv from "dotenv";
dotenv.config({ path: import.meta.dirname + "/../../.env" });

import { Sequelize } from "sequelize";

const client: Sequelize = new Sequelize(process.env.PG_URL as string, {
  dialect: "postgres",
  define: {
    timestamps: true,
    underscored: true,
  },
});

export default client;
