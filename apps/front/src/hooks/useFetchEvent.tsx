import { isAxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { EventEnriched } from "../types/event";

import { useModal } from "../contexts/modalContext";
import { eventService, EventService } from "../services/api/eventService";

export default function useFetchEvent(
  id: string,
  setEvent: Dispatch<SetStateAction<EventEnriched | null>>,
  service: EventService = eventService,
) {
  const { updateTarget } = useModal();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await service.getOneEnriched(id);

        setEvent(response);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, updateTarget, service]);

  return { isLoading, error };
}
