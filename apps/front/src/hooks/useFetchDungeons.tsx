import i18n from "i18next";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { Tag } from "../types/tag";
import { SubArea, Dungeon, Area } from "../types/dofusDB";

import { dofusDBService, DofusDBService } from "../services/api/dofusDBService";

export default function useFetchDungeons(
  tags: Tag[],
  tag: string,
  areas: Area[],
  area: string,
  subAreas: SubArea[],
  subArea: string,
  service: DofusDBService = dofusDBService,
) {
  const [dungeons, setDungeons] = useState<Dungeon[]>([]);
  const [isDungeon, setIsDungeon] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDungeons = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const selectedTag = tags.find((t) => t.id === tag);
        if (!selectedTag || selectedTag.name !== "Donjon") {
          setIsDungeon(false);
          setDungeons([]); // Reset
          setIsLoading(false);
          return;
        }

        setIsDungeon(true);
        const lang = i18n.language as "fr" | "en";

        let response: Dungeon[] = [];

        if (subArea !== "") {
          const selectedSubArea = subAreas.find(
            (s) => s.name[lang] === subArea,
          );
          if (selectedSubArea?.dungeonId) {
            response = await service.getDungeonsById([
              selectedSubArea.dungeonId,
            ]);
          }
        } else if (area !== "") {
          const selectedArea = areas.find((a) => a.name[lang] === area);
          if (selectedArea) {
            const subAreasOfArea = await service.getSubAreas(selectedArea.id);
            const dungeonIds = subAreasOfArea
              .map((s) => s.dungeonId)
              .filter((id): id is number => id !== -1);
            response = await service.getDungeonsById(dungeonIds);
          }
        } else {
          response = await service.getDungeons();
        }

        setDungeons(response);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDungeons();
  }, [tag, area, subArea, service]);

  return { dungeons, isDungeon, isLoading, error };
}
