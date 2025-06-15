import fs from "fs/promises";
import path from "path";

import { client } from "../client/client.js";

import { initAssociations, models } from "../models/initModels.js";

export default async function sync() {
  try {
    console.log("Models loaded in Sequelize:", Object.keys(client.models));
    initAssociations(models);
    await client.sync();
    console.info("Database synchronized 🚀.");

    const filePath: string = path.join(import.meta.dirname, "seed.sql");
    const seed: string = await fs.readFile(filePath, "utf-8");
    await client.query(seed);
    console.info("Database seeded 🚀.");
  } catch (error) {
    console.error("Database init error", error);
  }
}

await sync();
