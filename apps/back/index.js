import "dotenv/config";

import { app } from "./src/app/app.js";
import { router } from "./src/router/index.js";
import { notFound, errorHandler } from "./src/middlewares/errorHandler.js";

import { sync } from "./src/database/sync.js";
import { seeding } from "./src/database/seeding.js";

try {
    await sync();
    await seeding();

    app.use(router);

    app.use(notFound);
    app.use(errorHandler);
    
    app.listen(app.get("port"), () => {
        console.info(`Listening on ${app.get("base_url")}:${app.get("port")} 🚀.`);
    });
} catch (error) {
    console.error(`An error occured during initialization. ${error.message}`);
}

