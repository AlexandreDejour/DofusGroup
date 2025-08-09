import axios from "axios";

import { Config } from "../../config/config";

const config = Config.getInstance();

export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
});
