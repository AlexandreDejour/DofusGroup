import { ApiClient } from "../client";
import { Config } from "../../config/config";

export const backApiClient = new ApiClient(Config.getInstance().backUrl);
