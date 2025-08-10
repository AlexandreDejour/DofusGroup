import "./Home.scss";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

import EventCard from "../../EventCard/EventCard";

import { Event } from "../../../../types/event";
import { Config } from "../../../../config/config";
import { ApiClient } from "../../../../services/client/client";
import { EventService } from "../../../../services/api/eventService";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const eventService = new EventService(axios);

export default function Home() {
  const [events, setEvents] = useState<Event[] | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await eventService.getEvents(10, 1);
        setEvents(eventsData.events);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error("Axios error:", error.message);
        } else if (error instanceof Error) {
          console.error("General error:", error.message);
        }
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="home">
      {events && events.length ? (
        <ul>
          {events.map((event) => (
            <EventCard event={event} />
          ))}
        </ul>
      ) : (
        <p>Chargement en cours</p>
      )}
    </main>
  );
}
