export class Config {
  private static instance: Config;

  readonly backUrl: string;
  readonly dofusdbUrl: string;

  private constructor() {
    this.backUrl = "/api";
    this.dofusdbUrl = "/dofusdb";
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}
