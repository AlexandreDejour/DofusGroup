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
    const allAreas: Area[] = [];
    let batchLength: number;

    try {
      do {
        const response = await this.apiClient.get<BaseData>("/areas", {
          params: { $limit: limit, $skip: skip },
        });

        allAreas.push(
          ...response.data.data.map((a: Area) => ({ id: a.id, name: a.name })),
        );
        batchLength = response.data.data.length;
        skip += limit;
      } while (batchLength === limit);

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
    const allDungeons: Dungeon[] = [];
    let batchLength: number;

    try {
      do {
        const response = await this.apiClient.get<BaseData>("/dungeons", {
          params: { $limit: limit, $skip: skip },
        });

        allDungeons.push(
          ...response.data.data.map((d: Dungeon) => ({
            id: d.id,
            name: d.name,
          })),
        );

        batchLength = response.data.data.length;
        skip += limit;
      } while (batchLength === limit);

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

const dofusDbService = new DofusDBService(dofusDbApiClient);
