import "dotenv/config";

import { app } from "./src/app/app.js";
import { router } from "./src/router/index.js";
import { sync } from "./src/client/sync.js";

try {
    app.use(router);
    app.use (sync);
    
    app.listen(app.get("port"), () => {
        console.info(`Listening on ${app.get("base_url")}:${app.get("port")}🚀.`);
    });
} catch (error) {
    console.error("An error occured during initialization");
}

