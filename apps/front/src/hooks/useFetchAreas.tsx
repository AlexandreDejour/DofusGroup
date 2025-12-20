import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { Area } from "../types/dofusDB";

import { dofusDBService, DofusDBService } from "../services/api/dofusDBService";

export default function useFetchAreas(
  service: DofusDBService = dofusDBService,
) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAreas = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const areasData = await service.getAreas();

        setAreas(areasData);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAreas();
  }, [service]);

  return { areas, isLoading, error };
}
