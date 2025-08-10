import { Event } from "../../../types/event";
import "./EventCard.scss";

import { useNavigate } from "react-router";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <article className="event_card">
      <h2 className="event_card_title">{event.title}</h2>
      <p
        className="event_card_tag"
        style={{ backgroundColor: event.tag.color }}
      >
        {event.tag.name}
      </p>
      <p className="event_card_server">{event.server.name}</p>
      <p className="event_card_date">
        {new Date(event.date).toLocaleString("fr-FR", {
          timeZone: "UTC",
        })}
      </p>
      <p className="event_card_duration">{event.duration}</p>
      <p className="event_card_players">
        {event.characters ? event.characters.length : 0}/{event.max_players}
      </p>
      <button className="event_card_button">Détails</button>
    </article>
  );
}
