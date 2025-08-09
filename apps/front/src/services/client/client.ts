import axios from "axios";

import { Config } from "../../config/config";

const config = Config.getInstance();

const axiosInstance = axios.create({
  baseURL: config.baseUrl,
});
