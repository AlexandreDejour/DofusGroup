import "dotenv/config";
import { app } from "./src/app/app.js";

const server = app.listen(app.get("port"), () => {
  console.info(`Listening on ${app.get("base_url")}:${app.get("port")} 🚀.`);
});

server.on("error", (err) => {
  console.error("❌ Server error:", err.message);
});
