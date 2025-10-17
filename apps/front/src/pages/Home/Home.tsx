import "./Home.scss";

import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useTypedTranslation } from "../../i18n/i18n-helper";

import { Tag } from "../../types/tag";
import { Event } from "../../types/event";
import { Server } from "../../types/server";

import { useAuth } from "../../contexts/authContext";
import { useModal } from "../../contexts/modalContext";
import { useScreen } from "../../contexts/screenContext";
import { useNotification } from "../../contexts/notificationContext";

import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { TagService } from "../../services/api/tagService";
import { UserService } from "../../services/api/userService";
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
const userService = new UserService(axios);
const eventService = new EventService(axios);
const serverService = new ServerService(axios);

export default function Home() {
  const t = useTypedTranslation();

  const { user } = useAuth();
  const { isDesktop } = useScreen();
  const { showError } = useNotification();
  const { openModal } = useModal();

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

  const checkUserCharacter = useCallback(async () => {
    if (!user) return;

    try {
      const response = await userService.getOneEnriched(user.id);

      if (!response.characters?.length) {
        showError(
          "Condition non remplie !",
          "Vous devez avoir au moins un personnage pour créé un évènement.",
        );
        return false;
      }

      return true;
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Axios error:", error.message);
      } else if (error instanceof Error) {
        console.error("General error:", error.message);
      }
    }
  }, [user]);

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
          <p className="home_header_title">{t("common.title")}</p>
          <p className="home_header_tag">{t("tag.upperCase")}</p>
          <p className="home_header_server">{t("server.upperCase")}</p>
          <p className="home_header_date">{t("common.date")}</p>
          <p className="home_header_duration">{t("common.duration")}</p>
          <p className="home_header_players">{t("common.players")}</p>
          <button
            type="button"
            className="home_header_create button"
            onClick={async () => {
              const hasCharacters = await checkUserCharacter();
              if (hasCharacters) openModal("newEvent");
            }}
            disabled={!user}
            style={{
              background: !user
                ? "grey"
                : "radial-gradient(circle, rgba(96,186,96,1) 0%, rgba(156,217,92,1) 90%)",
            }}
          >
            {t("common.new")}
          </button>
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
        <p className="fallback">{t("event.error.none")}</p>
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
