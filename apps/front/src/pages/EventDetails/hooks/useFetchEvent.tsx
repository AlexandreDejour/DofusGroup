import { isAxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { CommentEnriched } from "../../../types/comment";
import { Event, EventEnriched } from "../../../types/event";
import { CharacterEnriched } from "../../../types/character";

import { Config } from "../../../config/config";
import { ApiClient } from "../../../services/client";
import { EventService } from "../../../services/api/eventService";

const config = Config.getInstance();
const axios = new ApiClient(config.backUrl);
const eventService = new EventService(axios);

export default function useFetchEvent(
  id: string,
  updateTarget: Event | CharacterEnriched | CommentEnriched | null,
  setEvent: Dispatch<SetStateAction<EventEnriched | null>>,
) {
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
