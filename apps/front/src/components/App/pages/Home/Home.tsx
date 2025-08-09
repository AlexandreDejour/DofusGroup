import "./Home.scss";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

import { Event } from "../../../../types";
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
            <li key={event.id}>
              <h2>{event.title}</h2>
              <p>{event.tag.name}</p>
              <p>{event.server.name}</p>
              <p>{new Date(event.date).toLocaleString()}</p>
              <p>{event.duration}</p>
              <p>
                {event.characters ? event.characters.length : 0}/
                {event.max_players}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Chargement en cours</p>
      )}
    </main>
  );
}
