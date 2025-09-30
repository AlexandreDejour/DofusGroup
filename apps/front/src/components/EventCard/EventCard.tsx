import "./EventCard.scss";

import { t } from "../../i18n/i18n-helper";
import { useNavigate } from "react-router";
import { useScreen } from "../../contexts/screenContext";

import { Event } from "../../types/event";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();

  const { isDesktop } = useScreen();

  return (
    <article className="event_card">
      <h3 className="event_card_title">
        {event.title.charAt(0).toLocaleUpperCase() + event.title.slice(1)}
      </h3>
      <p
        className="event_card_tag"
        style={{ backgroundColor: event.tag.color }}
      >
        {event.tag.name}
      </p>

      {isDesktop ? (
        <>
          <p className="event_card_server">{event.server.name}</p>
          <p className="event_card_date">
            {new Date(event.date).toLocaleString(undefined, {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
          <p className="event_card_duration">{event.duration} min</p>
          <p className="event_card_players">
            {event.characters.length}/{event.max_players}
          </p>
        </>
      ) : (
        <div className="event_card_container">
          <p className="event_card_container_server">
            <span>Serveur:</span> {event.server.name}
          </p>
          <p className="event_card_container_date">
            <span>{t("common.date")}:</span>{" "}
            {new Date(event.date).toLocaleString(undefined, {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
          <p className="event_card_container_duration">
            {" "}
            <span>{t("common.duration")}:</span> {event.duration} min
          </p>
          <p className="event_card_container_players">
            <span>{t("common.players")}:</span> {event.characters.length}/
            {event.max_players}
          </p>
        </div>
      )}

      <button
        className="event_card_button button"
        onClick={() => navigate(`/event/${event.id}`)}
      >
        {t("common.details")}
      </button>
    </article>
  );
}
