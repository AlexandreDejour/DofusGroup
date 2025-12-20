import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { Server } from "../types/server";

import { serverService, ServerService } from "../services/api/serverService";

export default function useFetchServers(
  service: ServerService = serverService,
) {
  const [servers, setServers] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const serversData = await service.getServers();

        setServers(serversData);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServers();
  }, [service]);

  return { servers, isLoading, error };
}
