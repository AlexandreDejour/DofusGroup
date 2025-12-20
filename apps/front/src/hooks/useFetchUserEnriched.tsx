import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useTypedTranslation } from "../i18n/i18n-helper";

import { UserEnriched } from "../types/user";

import { useAuth } from "../contexts/authContext";
import { useNotification } from "../contexts/notificationContext";

import { userService, UserService } from "../services/api/userService";

export default function useUserEnriched(service: UserService = userService) {
  const navigate = useNavigate();
  const t = useTypedTranslation();

  const { showError } = useNotification();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEnriched, setUserEnriched] = useState<UserEnriched | null>(null);

  useEffect(() => {
    const fetchUserEnriched = async () => {
      if (isAuthLoading) return;

      if (!user) {
        navigate("/", { replace: true });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await service.getOneEnriched(user.id);

        setUserEnriched(response);
      } catch (error) {
        if (isAxiosError(error)) {
          showError(t("system.error.default"), error.message);
          setError(error.message);
        } else if (error instanceof Error) {
          showError(t("system.error.default"), t("system.error.occurred"));
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserEnriched();
  }, [user, isAuthLoading, service]);

  return { userEnriched, isLoading, error };
}
