import "dotenv/config";
import { sync } from "./sync.js";
import { seeding } from "./seeding.js";

try {
  await sync();
  await seeding();
  console.info("✅ Seeding terminé.");
  process.exit(0);
} catch (err) {
  console.error("❌ Erreur lors du seeding :", err);
  process.exit(1);
}
