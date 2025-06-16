import * as dotenv from "dotenv";
dotenv.config({ path: import.meta.dirname + "/../../.env" });

import app from "./src/app/app.js";
import router from "./src/router/index.js";

app.use(router);

app.listen(app.get("port"), () => {
  console.info(
    `Listening on ${app.get("base_url") as string}:${app.get("port") as string}`,
  );
});
