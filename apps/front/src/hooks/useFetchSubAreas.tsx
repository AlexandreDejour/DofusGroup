import i18n from "i18next";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { Area, SubArea } from "../types/dofusDB";

import { Config } from "../config/config";
import { ApiClient } from "../services/client";
import { DofusDBService } from "../services/api/dofusDBService";

const config = Config.getInstance();
const axios = new ApiClient(config.dofusdbUrl);
const dofusDBService = new DofusDBService(axios);

export default function useFetchSubAreas(areas: Area[], area: string) {
  const [subAreas, setSubAreas] = useState<SubArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubAreas = async () => {
      setIsLoading(true);
      setError(null);

      const lang = i18n.language as "fr" | "en";

      const selectedArea = areas.find((a) => a.name[lang] === area);

      if (!selectedArea) return;

      try {
        const subAreasData = await dofusDBService.getSubAreas(selectedArea.id);

        setSubAreas(subAreasData);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubAreas();
  }, [areas, area]);

  return { subAreas, isLoading, error };
}
