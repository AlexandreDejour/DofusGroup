import i18n from "i18next";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { Tag } from "../types/tag";
import { SubArea, Dungeon, Area } from "../types/dofusDB";

import { dofusDBService, DofusDBService } from "../services/api/dofusDBService";

type DungeonContext = {
  tags: Tag[];
  areas: Area[];
  subAreas: SubArea[];
};

type DungeonSelection = {
  tag: string;
  area: string;
  subArea: string;
};

export default function useFetchDungeons(
  context: DungeonContext,
  selection: DungeonSelection,
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

      if (!context.tags.length) return;

      try {
        const selectedTag = context.tags.find((t) => t.id === selection.tag);
        if (!selectedTag || selectedTag.name !== "Donjon") {
          setIsDungeon(false);
          setDungeons([]); // Reset
          setIsLoading(false);
          return;
        }

        setIsDungeon(true);
        const lang = i18n.language as "fr" | "en";

        let response: Dungeon[] = [];

        if (selection.subArea !== "") {
          const selectedSubArea = context.subAreas.find((s) =>
            Object.values(s.name).includes(selection.subArea),
          );
          if (selectedSubArea?.dungeonId) {
            response = await service.getDungeonsById([
              selectedSubArea.dungeonId,
            ]);
          }
        } else if (selection.area !== "") {
          const selectedArea = context.areas.find((a) =>
            Object.values(a.name).includes(selection.area),
          );
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
  }, [
    selection.tag,
    selection.area,
    selection.subArea,
    context.tags,
    context.areas,
    context.subAreas,
    service,
  ]);

  return { dungeons, isDungeon, isLoading, error };
}
