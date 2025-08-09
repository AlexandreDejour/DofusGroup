export class Config {
  private static instance: Config;

  readonly baseUrl: string;

  private constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL;
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
      Config.check(Config.instance);
    }
    return Config.instance;
  }

  private static check(config: Config) {
    if (!config.baseUrl) throw new Error("VITE_API_URL is required");
  }
}
