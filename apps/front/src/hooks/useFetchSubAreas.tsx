import i18n from "i18next";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { Area, SubArea } from "../types/dofusDB";

import { dofusDBService, DofusDBService } from "../services/api/dofusDBService";

export default function useFetchSubAreas(
  areas: Area[],
  area: string,
  service: DofusDBService = dofusDBService,
) {
  const [subAreas, setSubAreas] = useState<SubArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubAreas = async () => {
      setIsLoading(true);
      setError(null);

      const lang = i18n.language as "fr" | "en";

      const selectedArea = areas.find((a) => a.name[lang] === area);

      if (!selectedArea) {
        setSubAreas([]);
        setIsLoading(false);
        return;
      }

      try {
        const subAreasData = await service.getSubAreas(selectedArea.id);

        setSubAreas(subAreasData);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubAreas();
  }, [areas, area, service]);

  return { subAreas, isLoading, error };
}
