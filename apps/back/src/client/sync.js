import { client } from "./client.js";

async function sync() {
    await client.sync();
    console.info("Database synchronized 🚀.")
}

export { sync };
