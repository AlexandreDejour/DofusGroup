import { Area, Dungeon, SubArea } from "../../types/dofusDB";
import { ApiClient } from "../client";

import axios from "axios";

export class DofusDBService {
  private axios;

  constructor(axios: ApiClient) {
    this.axios = axios.instance;
  }

  public async getAreas(): Promise<Area[]> {
    const params: Record<string, number> = {};
    params["$limit"] = 100;

    try {
      const response = await this.axios.get("https://api.dofusdb.fr/areas", {
        params,
      });

      const areas: Area[] = response.data.data.map((area: Area) => ({
        id: area.id,
        name: area.name,
      }));

      return areas;
    } catch (error) {
      throw error;
    }
  }

  public async getSubAreas(areaId: number): Promise<SubArea[]> {
    const params: Record<string, number> = {};
    params["areaId"] = areaId;
    params["$limit"] = 20;

    try {
      const response = await this.axios.get("https://api.dofusdb.fr/subareas", {
        params,
      });

      const subAreas: SubArea[] = response.data.data.map(
        (subArea: SubArea) => ({
          id: subArea.id,
          dungeonId: subArea.dungeonId,
          name: subArea.name,
        }),
      );

      return subAreas;
    } catch (error) {
      throw error;
    }
  }

  public async getDungeons(dungeonId?: number): Promise<Dungeon[]> {
    try {
      const response = await this.axios.get("https://api.dofusdb.fr/dungeons");

      const dungeons: Dungeon[] = response.data.data.map(
        (dungeon: Dungeon) => ({
          id: dungeon.id,
          name: dungeon.name,
        }),
      );

      return dungeons;
    } catch (error) {
      throw error;
    }
  }
}
