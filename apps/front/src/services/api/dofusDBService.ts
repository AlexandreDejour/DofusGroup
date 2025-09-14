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
    params["$limit"] = 50;

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

  public async getDungeons(): Promise<Dungeon[]> {
    const limit = 50; // max API rule
    let skip = 0;
    let allDungeons: Dungeon[] = [];
    let hasMore = true;

    try {
      while (hasMore) {
        const response = await this.axios.get(
          "https://api.dofusdb.fr/dungeons",
          {
            params: {
              $limit: limit,
              $skip: skip,
            },
          },
        );

        const dungeons: Dungeon[] = response.data.data.map((d: Dungeon) => ({
          id: d.id,
          name: d.name,
        }));

        allDungeons = [...allDungeons, ...dungeons];

        // if less than "limit" => more data
        hasMore = dungeons.length === limit;
        skip += limit;
      }

      return allDungeons;
    } catch (error) {
      throw error;
    }
  }
}
