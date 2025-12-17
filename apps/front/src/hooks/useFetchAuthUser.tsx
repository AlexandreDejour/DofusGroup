import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import type { AuthUser } from "../types/user";

import { Config } from "../config/config";
import { ApiClient } from "../services/client";
import { AuthService } from "../services/api/authService";

const config = Config.getInstance();
const axios = new ApiClient(config.backUrl);
const authService = new AuthService(axios);

export default function useFetchAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.apiMe();
        setUser(response);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthUser();
  }, []);

  return { user, setUser, isLoading, error };
}
