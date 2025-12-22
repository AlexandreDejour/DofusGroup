import "./Home.scss";

import { useState } from "react";
import { useTypedTranslation } from "../../i18n/i18n-helper";

import { Event } from "../../types/event";

import { useScreen } from "../../contexts/screenContext";

import useFetchTags from "../../hooks/useFetchTags";
import useFetchEvents from "../../hooks/useFetchEvents";
import useFetchServers from "../../hooks/useFetchServers";
import useSearchHandler from "../../hooks/useSearchHandler";

import Spinner from "../../components/Spinner/Spinner";
import EventCard from "../../components/EventCard/EventCard";
import Pagination from "../../components/Pagination/Pagination";
import EventFilter from "../../components/EventFilter/EventFilter";

export default function Home() {
  const t = useTypedTranslation();

  const { isDesktop } = useScreen();

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [events, setEvents] = useState<Event[]>([]);

  const [tag, setTag] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [server, setServer] = useState<string>("");

  const { tags } = useFetchTags();
  const { servers } = useFetchServers();
  const { isLoading: eventsLoading } = useFetchEvents(
    events,
    setEvents,
    currentPage,
    setTotalPages,
  );

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
        </header>
      )}

      {!eventsLoading ? (
        events && events.length ? (
          <ul className="home_events">
            {events.map((event) => (
              <li key={event.id}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="fallback">{t("event.error.none")}</p>
        )
      ) : (
        <Spinner size={50} color="#808080" loading={eventsLoading} />
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
