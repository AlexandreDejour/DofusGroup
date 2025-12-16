import { isAxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { EventEnriched } from "../types/event";

import { Config } from "../config/config";
import { ApiClient } from "../services/client";
import { EventService } from "../services/api/eventService";
import { useModal } from "../contexts/modalContext";

const config = Config.getInstance();
const axios = new ApiClient(config.backUrl);
const eventService = new EventService(axios);

export default function useFetchEvent(
  id: string,
  setEvent: Dispatch<SetStateAction<EventEnriched | null>>,
) {
  const { updateTarget } = useModal();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await eventService.getOneEnriched(id);

        setEvent(response);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, updateTarget]);

  return { isLoading, error };
}
