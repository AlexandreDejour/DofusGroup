import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import type { AuthUser } from "../types/user";

import { authService, AuthService } from "../services/api/authService";

export default function useFetchAuthUser(service: AuthService = authService) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await service.apiMe();
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
