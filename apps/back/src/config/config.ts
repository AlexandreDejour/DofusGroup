import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export class Config {
  private static instance: Config;

  readonly environment: string;
  readonly port: number;
  readonly baseUrl: string;
  readonly pgUrl: string;
  readonly cryptoAlgorithm: string;
  readonly cryptoKey: string;
  readonly jwtSecret: string;
  readonly refreshSecret: string;
  readonly smtpUser: string;
  readonly smtpPassword: string;

  private constructor() {
    this.environment = process.env.NODE_ENV as string;
    this.port = Number(process.env.PORT);
    this.baseUrl = process.env.BASE_URL as string;
    this.pgUrl = process.env.PG_URL as string;
    this.cryptoAlgorithm = process.env.CRYPTO_ALGORITHM as string;
    this.cryptoKey = process.env.CRYPTO_KEY as string;
    this.jwtSecret = process.env.JWT_SECRET as string;
    this.refreshSecret = process.env.REFRESH_SECRET as string;
    this.smtpUser = process.env.SMTP_USER as string;
    this.smtpPassword = process.env.SMTP_PASSWORD as string;
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
      Config.check(Config.instance);
    }
    return Config.instance;
  }

  private static check(config: Config) {
    if (!config.environment) throw new Error("NODE_ENV is required");
    if (!config.port || isNaN(config.port))
      throw new Error("PORT is required and must be a number");
    if (!config.baseUrl) throw new Error("BASE_URL is required");
    if (!config.pgUrl) throw new Error("PG_URL is required");
    if (!config.cryptoAlgorithm)
      throw new Error("CRYPTO_ALGORITHM is required");
    if (!config.cryptoKey) throw new Error("CRYPTO_KEY is required");
    if (!config.jwtSecret) throw new Error("JWT_SECRET is required");
    if (!config.refreshSecret) throw new Error("REFRESH_SECRET is required");
    if (!config.smtpUser) throw new Error("SMTP_USER is required");
    if (!config.smtpPassword) throw new Error("SMTP_PASSWORD is required");
  }
}
