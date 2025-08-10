import "./Home.scss";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

import EventCard from "../../EventCard/EventCard";
import Pagination from "../../Pagination/Pagination";

import { Event } from "../../../../types/event";
import { Config } from "../../../../config/config";
import { ApiClient } from "../../../../services/client/client";
import { EventService } from "../../../../services/api/eventService";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const eventService = new EventService(axios);

export default function Home() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await eventService.getEvents(10, 1);
        setEvents(eventsData.events);
        setTotalPages(eventsData.totalPages);
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
      <header className="home_aside">
        <p className="home_aside_title">Titre</p>
        <p className="home_aside_tag">Tag</p>
        <p className="home_aside_server">Serveur</p>
        <p className="home_aside_date">Date</p>
        <p className="home_aside_duration">Durée</p>
        <p className="home_aside_players">Joueurs</p>
        <p className="home_aside_details"></p>
      </header>

      {events && events.length ? (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      ) : (
        <p>Chargement en cours</p>
      )}

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage}
      />
    </main>
  );
}
