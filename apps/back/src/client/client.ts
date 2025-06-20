import * as dotenv from "dotenv";
dotenv.config({ path: import.meta.dirname + "/../../.env" });

import { Sequelize } from "sequelize";

import { Config } from "../config/config.js";

const config = Config.getInstance();

const client: Sequelize = new Sequelize(config.pgUrl, {
  dialect: "postgres",
  define: {
    timestamps: true,
    underscored: true,
  },
});

export default client;
