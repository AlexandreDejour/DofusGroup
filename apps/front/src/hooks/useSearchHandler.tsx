import { Dispatch, SetStateAction, useCallback } from "react";

import { Event } from "../types/event";
import { SearchForm } from "../types/form";

import { eventService, EventService } from "../services/api/eventService";
import formDataToObject from "../contexts/utils/formDataToObject";

export default function useSearchHandler(
  currentPage: number,
  setEvents: Dispatch<SetStateAction<Event[]>>,
  setTotalPages: Dispatch<SetStateAction<number>>,
  service: EventService = eventService,
) {
  const handleSearch = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const filters = formDataToObject<SearchForm>(formData, {
        keys: ["title", "tag_id", "server_id"],
      });

      try {
        const filteredEvents = await service.getEvents(
          10,
          currentPage,
          filters,
        );
        setEvents(filteredEvents.events);
        setTotalPages(filteredEvents.totalPages);
      } catch (error) {
        console.error(error);
      }
    },
    [currentPage, setEvents, setTotalPages, service],
  );

  return handleSearch;
}
