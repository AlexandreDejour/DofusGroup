import "./Home.scss";

import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";

import { Tag } from "../../types/tag";
import { Event } from "../../types/event";
import { Server } from "../../types/server";

import { useScreen } from "../../contexts/screenContext";

import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { TagService } from "../../services/api/tagService";
import { EventService } from "../../services/api/eventService";
import { ServerService } from "../../services/api/serverService";

import EventCard from "../../components/EventCard/EventCard";
import Pagination from "../../components/Pagination/Pagination";
import EventFilter from "../../components/EventFilter/EventFilter";
import formDataToObject from "../../contexts/utils/formDataToObject";
import { SearchForm } from "../../types/form";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const tagService = new TagService(axios);
const eventService = new EventService(axios);
const serverService = new ServerService(axios);

export default function Home() {
  const { t } = useTranslation();
  const { isDesktop } = useScreen();

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [tags, setTags] = useState<Tag[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [servers, setServers] = useState<Server[]>([]);

  const [tag, setTag] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [server, setServer] = useState<string>("");

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

    const fetchTags = async () => {
      try {
        const tagsData = await tagService.getTags();

        setTags(tagsData);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error("Axios error:", error.message);
        } else if (error instanceof Error) {
          console.error("General error:", error.message);
        }
      }
    };

    const fetchServers = async () => {
      try {
        const serversData = await serverService.getServers();

        setServers(serversData);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error("Axios error:", error.message);
        } else if (error instanceof Error) {
          console.error("General error:", error.message);
        }
      }
    };

    fetchTags();
    fetchEvents();
    fetchServers();
  }, [currentPage]);

  const handleSearch = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const form = event.currentTarget as HTMLFormElement;
      const formData = new FormData(form);

      try {
        const keys: (keyof SearchForm)[] = ["title", "tag_id", "server_id"];
        const filters = formDataToObject<SearchForm>(formData, { keys });

        const filteredEvents = await eventService.getEvents(
          10,
          currentPage,
          filters,
        );

        setEvents(filteredEvents.events);
        setTotalPages(filteredEvents.totalPages);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error("Axios error:", error.message);
        } else if (error instanceof Error) {
          console.error("General error:", error.message);
        }
      }
    },
    [],
  );

  return (
    <main className="home">
      <EventFilter
        tag={tag}
        server={server}
        tags={tags}
        title={title}
        servers={servers}
        setTag={setTag}
        setTitle={setTitle}
        setServer={setServer}
        handleSearch={handleSearch}
      />

      {isDesktop && (
        <header className="home_header">
          <p className="home_header_title">{t("title")}</p>
          <p className="home_header_tag">{t("tag")}</p>
          <p className="home_header_server">{t("server")}</p>
          <p className="home_header_date">{t("date")}</p>
          <p className="home_header_duration">{t("duration")}</p>
          <p className="home_header_players">{t("players")}</p>
          <p className="home_header_details"></p>
        </header>
      )}

      {events && events.length ? (
        <ul className="home_events">
          {events.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="fallback">{t("anyEventFound")}</p>
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
