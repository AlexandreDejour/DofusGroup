import qs from "qs";

import {
  Area,
  SubArea,
  Dungeon,
  BaseData,
  BaseDataSubArea,
} from "../../types/dofusDB";

import { ApiClient } from "../client";
import handleApiError from "../utils/handleApiError";
import { dofusDbApiClient } from "../http/dofusDbApiClient";

export class DofusDBService {
  constructor(private apiClient: ApiClient) {}

  public async getAreas(): Promise<Area[]> {
    const limit = 50; // max API rule
    let skip = 0;
    let allAreas: Dungeon[] = [];
    let hasMore = true;

    try {
      while (hasMore) {
        const response = await this.apiClient.get<BaseData>("/areas", {
          params: {
            $limit: limit,
            $skip: skip,
          },
        });

        const areas: Area[] = response.data.data.map((a: Area) => ({
          id: a.id,
          name: a.name,
        }));

        allAreas = [...allAreas, ...areas];

        // if less than "limit" => more data
        hasMore = areas.length === limit;
        skip += limit;
      }

      return allAreas;
    } catch (error) {
      handleApiError(error);
    }
  }

  public async getSubAreas(areaId: number): Promise<SubArea[]> {
    const params: Record<string, number> = {};
    params["areaId"] = areaId;
    params["$limit"] = 50;

    try {
      const response = await this.apiClient.get<BaseDataSubArea>("/subareas", {
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
      handleApiError(error);
    }
  }

  public async getDungeons(): Promise<Dungeon[]> {
    const limit = 50; // max API rule
    let skip = 0;
    let allDungeons: Dungeon[] = [];
    let hasMore = true;

    try {
      while (hasMore) {
        const response = await this.apiClient.get<BaseData>("/dungeons", {
          params: {
            $limit: limit,
            $skip: skip,
          },
        });

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
      handleApiError(error);
    }
  }

  public async getDungeonsById(dungeonIds: number[]): Promise<Dungeon[]> {
    try {
      const params = { id: dungeonIds };
      const response = await this.apiClient.get<BaseData>("/dungeons", {
        params,
        paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
      });

      const dungeons: Dungeon[] = response.data.data.map((d: Dungeon) => ({
        id: d.id,
        name: d.name,
      }));

      return dungeons;
    } catch (error) {
      handleApiError(error);
    }
  }
}

const dofusDBService = new DofusDBService(dofusDbApiClient);
