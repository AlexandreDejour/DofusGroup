import "dotenv/config";

import { app } from "./src/app/app.js";
import { router } from "./src/router/index.js";

app.use(router);

app.listen(app.get("port"), () => {
    console.info(`Listening on ${app.get("base_url")}:${app.get("port")}`);
});