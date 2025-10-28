import { fn, Op } from "sequelize";

import client from "./client.js";
import EventEntity from "./models/Event.js";

async function cleanup() {
  try {
    const deleted = await EventEntity.destroy({
      where: { date: { [Op.lt]: fn("NOW") } },
    });
    console.log(`[Scheduler] ${deleted} events removed`);
  } catch (error) {
    console.error("❌ Error during cleaning :", error);
  } finally {
    await client.close();
    console.log("🔌 Connection closed.");
  }
}

cleanup();
