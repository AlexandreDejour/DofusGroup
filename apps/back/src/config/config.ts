import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(import.meta.dirname, "../../.env") });

export class Config {
  private static instance: Config;

  readonly port: number;
  readonly baseUrl: string;
  readonly pgUrl: string;

  private constructor() {
    this.port = Number(process.env.PORT);
    this.baseUrl = process.env.BASE_URL as string;
    this.pgUrl = process.env.PG_URL as string;
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
      Config.check(Config.instance);
    }
    return Config.instance;
  }

  private static check(config: Config) {
    if (!config.port || isNaN(config.port))
      throw new Error("PORT is required and must be a number");
    if (!config.baseUrl) throw new Error("BASE_URL is required");
    if (!config.pgUrl) throw new Error("PG_URL is required");
  }
}
