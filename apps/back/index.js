import "dotenv/config";

import { app } from "./src/app/app.js";
import { notFound, errorHandler } from "./src/middlewares/errorHandler.js";

try {
    app.use(notFound);
    app.use(errorHandler);
    
    app.listen(app.get("port"), () => {
        console.info(`Listening on ${app.get("base_url")}:${app.get("port")} 🚀.`);
    });
} catch (error) {
    console.error(`An error occured during initialization. ${error.message}`);
}

