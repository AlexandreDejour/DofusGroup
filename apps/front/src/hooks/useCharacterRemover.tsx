import { Dispatch, SetStateAction, useCallback } from "react";

import { EventEnriched } from "../types/event";

import { useTypedTranslation } from "../i18n/i18n-helper";
import { useNotification } from "../contexts/notificationContext";

import { eventService, EventService } from "../services/api/eventService";

export default function useCharacterRemover(
  event: EventEnriched | null,
  setEvent: Dispatch<SetStateAction<EventEnriched | null>>,
  service: EventService = eventService,
) {
  const t = useTypedTranslation();
  const { showSuccess, showError } = useNotification();

  const removeCharacter = useCallback(
    async (eventId: string, characterId: string) => {
      try {
        const response = await service.removeCharacter(eventId, characterId);

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
    [event, service],
  );

  return removeCharacter;
}
