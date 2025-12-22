import { isAxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Event } from "../types/event";

import { useModal } from "../contexts/modalContext";
import { eventService, EventService } from "../services/api/eventService";

export default function useFetchEvents(
  events: Event[],
  setEvents: Dispatch<SetStateAction<Event[]>>,
  currentPage: number,
  setTotalPages: Dispatch<SetStateAction<number>>,
  service: EventService = eventService,
) {
  const { refreshKey } = useModal();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const eventsData = await service.getEvents(20, currentPage);

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
  }, [currentPage, refreshKey, service]);

  return { events, isLoading, error };
}
