import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import { Server } from "../../../types/server";

import { Config } from "../../../config/config";
import { ApiClient } from "../../../services/client";
import { ServerService } from "../../../services/api/serverService";

const config = Config.getInstance();
const axios = new ApiClient(config.backUrl);
const serverService = new ServerService(axios);

export default function useFetchServers() {
  const [servers, setServers] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const serversData = await serverService.getServers();

        setServers(serversData);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServers();
  }, []);

  return { servers, isLoading, error };
}
