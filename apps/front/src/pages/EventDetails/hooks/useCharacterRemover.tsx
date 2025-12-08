import { Dispatch, SetStateAction, useCallback } from "react";

import { EventEnriched } from "../../../types/event";

import { useTypedTranslation } from "../../../i18n/i18n-helper";
import { useNotification } from "../../../contexts/notificationContext";

import { Config } from "../../../config/config";
import { ApiClient } from "../../../services/client";
import { EventService } from "../../../services/api/eventService";

const config = Config.getInstance();
const axios = new ApiClient(config.backUrl);
const eventService = new EventService(axios);

export default function useCharacterRemover(
  setEvent: Dispatch<SetStateAction<EventEnriched | null>>,
) {
  const t = useTypedTranslation();
  const { showSuccess, showError } = useNotification();

  const removeCharacter = useCallback(
    async (eventId: string, characterId: string) => {
      try {
        const response = await eventService.removeCharacter(
          eventId,
          characterId,
        );

        setEvent(response);

        showSuccess(t("system.success.deleted"), t("event.error.characterOut"));
      } catch (error) {
        if (error instanceof Error) {
          showError(t("system.error.default"), error.message);
        } else {
          showError(t("system.error.default"), t("system.error.occurred"));
        }
      }
    },
    [event],
  );

  return removeCharacter;
}
