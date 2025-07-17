import ServerEntity from "../../database/models/Server.js";
import { Server } from "../../types/server.js";

export class ServerRepository {
  public async getAll(): Promise<Server[]> {
    try {
      const result: ServerEntity[] = await ServerEntity.findAll();

      const servers: Server[] = result.map((server: ServerEntity) =>
        server.get({ plain: true }),
      );

      return servers;
    } catch (error) {
      throw error;
    }
  }

  public async getOne(id: string): Promise<Server | null> {
    try {
      const result: ServerEntity | null = await ServerEntity.findByPk(id);

      if (!result) {
        return null;
      }

      const server: Server = result.get({ plain: true });

      return server;
    } catch (error) {
      throw error;
    }
  }
}
