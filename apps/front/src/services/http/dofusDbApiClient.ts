import { ApiClient } from "../client";
import { Config } from "../../config/config";

export const dofusDbApiClient = new ApiClient(Config.getInstance().dofusdbUrl);
