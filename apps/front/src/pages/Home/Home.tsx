import "./Home.scss";

import { useState } from "react";
import { useTypedTranslation } from "../../i18n/i18n-helper";

import { Event } from "../../types/event";

import { useAuth } from "../../contexts/authContext";
import { useModal } from "../../contexts/modalContext";
import { useScreen } from "../../contexts/screenContext";
import { useNotification } from "../../contexts/notificationContext";

import useFetchTags from "./hooks/useFetchTags";
import useFetchEvents from "./hooks/useFetchEvents";
import useFetchServers from "./hooks/useFetchServers";
import useSearchHandler from "./hooks/useSearchHandler";

import EventCard from "../../components/EventCard/EventCard";
import Pagination from "../../components/Pagination/Pagination";
import EventFilter from "../../components/EventFilter/EventFilter";
import useUserCharactersChecker from "./hooks/useUserCharactersChecker";

export default function Home() {
  const t = useTypedTranslation();

  const { user } = useAuth();
  const { openModal } = useModal();
  const { isDesktop } = useScreen();
  const { showError } = useNotification();

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [events, setEvents] = useState<Event[]>([]);

  const [tag, setTag] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [server, setServer] = useState<string>("");

  const { tags, isLoading: tagsLoading, error: tagsError } = useFetchTags();
  const {
    servers,
    isLoading: serversLoading,
    error: serversError,
  } = useFetchServers();
  const { isLoading: eventsLoading, error: eventsError } = useFetchEvents(
    events,
    setEvents,
    currentPage,
    setTotalPages,
  );

  const checkUserCharacters = useUserCharactersChecker(user, showError, t);
  const handleSearch = useSearchHandler(currentPage, setEvents, setTotalPages);

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
              const hasCharacters = await checkUserCharacters();
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
