import { useCallback } from "react";
import { isAxiosError } from "axios";

import { User } from "../types/user";

import { useTypedTranslation } from "../i18n/i18n-helper";
import { userService, UserService } from "../services/api/userService";
import { useNotification } from "../contexts/notificationContext";

export default function useUserCharactersChecker(
  user: User | null,
  service: UserService = userService,
) {
  const t = useTypedTranslation();
  const { showError } = useNotification();

  const checkUserCharacters = useCallback(async () => {
    if (!user) return;

    try {
      const response = await service.getOneEnriched(user.id);

      if (!response.characters?.length) {
        showError(t("common.minimalCondition"), t("character.error.required"));
        return false;
      }

      return true;
    } catch (error) {
      if (isAxiosError(error)) console.error("Axios error:", error.message);
      else if (error instanceof Error)
        console.error("General error:", error.message);
    }
  }, [user, showError, t, userService, service]);

  return checkUserCharacters;
}
