import { useCallback } from "react";
import { isAxiosError } from "axios";

import { User } from "../../../types/user";

import { Config } from "../../../config/config";
import { ApiClient } from "../../../services/client";
import { UserService } from "../../../services/api/userService";
import { TranslationKeys } from "../../../i18n/i18n-helper";

const config = Config.getInstance();
const axios = new ApiClient(config.backUrl);
const userService = new UserService(axios);

export default function useUserCharactersChecker(
  user: User | null,
  showError: (title: string, message: string) => void,
  t: (key: TranslationKeys, options?: Record<string, unknown>) => string,
) {
  const checkUserCharacters = useCallback(async () => {
    if (!user) return;

    try {
      const response = await userService.getOneEnriched(user.id);

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
  }, [user, showError, t, userService]);

  return checkUserCharacters;
}
