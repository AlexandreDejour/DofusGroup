import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useTypedTranslation } from "../../../i18n/i18n-helper";

import { Event } from "../../../types/event";
import { UserEnriched } from "../../../types/user";

import { useNotification } from "../../../contexts/notificationContext";

import { Config } from "../../../config/config";
import { ApiClient } from "../../../services/client";
import { EventService } from "../../../services/api/eventService";

const config = Config.getInstance();
const axios = new ApiClient(config.backUrl);
const eventService = new EventService(axios);

export default function useUpComingEvents(userEnriched: UserEnriched | null) {
  const t = useTypedTranslation();

  const { showError } = useNotification();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upComingEvents, setUpcomingEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      if (!userEnriched || !userEnriched.characters?.length) return;

      setIsLoading(true);
      setError(null);

      try {
        const characterIds = userEnriched.characters.map((c) => c.id);

        const response = await eventService.getRegistered(characterIds);

        if (userEnriched.events?.length) {
          const ownerEvents = userEnriched.events.map((event) => event.id);
          const events = response.filter(
            (event) => !ownerEvents.includes(event.id),
          );

          setUpcomingEvents(events);
        } else setUpcomingEvents(response);
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

    fetchUpcomingEvents();
  }, [userEnriched]);

  return { upComingEvents, isLoading, error };
}
