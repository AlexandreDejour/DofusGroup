import client from "./client.js";

import { initAssociations, models } from "./models/initModels.js";

export default async function sync() {
  try {
    console.log("Models loaded in Sequelize:", Object.keys(client.models));
    initAssociations(models);
    await client.sync();
    console.info("Database synchronized 🚀.");
  } catch (error) {
    console.error("Database init error", error);
  }
}

await sync();
