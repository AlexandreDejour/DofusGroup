import "./EventCard.scss";

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
      <h3 className="event_card_title">{event.title}</h3>
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
            <span>Date:</span>{" "}
            {new Date(event.date).toLocaleString(undefined, {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
          <p className="event_card_container_duration">
            {" "}
            <span>Durée:</span> {event.duration} min
          </p>
          <p className="event_card_container_players">
            <span>Joueurs:</span> {event.characters.length}/{event.max_players}
          </p>
        </div>
      )}

      <button
        className="event_card_button button"
        onClick={() => navigate(`/event/${event.id}`)}
      >
        Détails
      </button>
    </article>
  );
}
