import { isAxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Event } from "../../../types/event";

import { Config } from "../../../config/config";
import { ApiClient } from "../../../services/client";
import { EventService } from "../../../services/api/eventService";

const config = Config.getInstance();
const axios = new ApiClient(config.backUrl);
const eventService = new EventService(axios);

export default function useFetchEvents(
  events: Event[],
  setEvents: Dispatch<SetStateAction<Event[]>>,
  currentPage: number,
  setTotalPages: Dispatch<SetStateAction<number>>,
) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const eventsData = await eventService.getEvents(10, currentPage);

        setEvents(eventsData.events);
        setTotalPages(eventsData.totalPages);
      } catch (error) {
        if (isAxiosError(error)) setError(error.message);
        else if (error instanceof Error) setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage, setEvents, setTotalPages]);

  return { events, isLoading, error };
}
