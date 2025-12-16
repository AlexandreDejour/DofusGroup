import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useTypedTranslation } from "../../../i18n/i18n-helper";

import { UserEnriched } from "../../../types/user";

import { useAuth } from "../../../contexts/authContext";
import { useNotification } from "../../../contexts/notificationContext";

import { Config } from "../../../config/config";
import { ApiClient } from "../../../services/client";
import { UserService } from "../../../services/api/userService";

const config = Config.getInstance();
const axios = new ApiClient(config.backUrl);
const userService = new UserService(axios);

export default function useUserEnriched() {
  const navigate = useNavigate();
  const t = useTypedTranslation();

  const { showError } = useNotification();
  const { user, isAuthLoading } = useAuth();

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
        const response = await userService.getOneEnriched(user.id);

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
  }, [user, isAuthLoading]);

  return { userEnriched, isLoading, error };
}
