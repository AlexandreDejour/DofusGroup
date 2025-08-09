import "./Home.scss";

import React, { useEffect, useState } from "react";
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
        const eventsData = await eventService.getEvents();
        setEvents(eventsData);
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
            </li>
          ))}
        </ul>
      ) : (
        <p>Chargement en cours</p>
      )}
    </main>
  );
}
