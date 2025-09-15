import "./Home.scss";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

import EventCard from "../../components/EventCard/EventCard";
import Pagination from "../../components/Pagination/Pagination";

import { Event } from "../../types/event";
import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { EventService } from "../../services/api/eventService";

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
        const eventsData = await eventService.getEvents(10, currentPage);

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
  }, [currentPage]);

  return (
    <main className="home">
      <header className="home_header">
        <p className="home_header_title">Titre</p>
        <p className="home_header_tag">Tag</p>
        <p className="home_header_server">Serveur</p>
        <p className="home_header_date">Date</p>
        <p className="home_header_duration">Durée</p>
        <p className="home_header_players">Joueurs</p>
        <p className="home_header_details"></p>
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

      {totalPages ? (
        <div className="home_pagination">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page: number) => setCurrentPage(page)}
            maxVisiblePages={10}
          />
        </div>
      ) : null}
    </main>
  );
}
