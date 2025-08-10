import { Event } from "../../../types/event";
import "./EventCard.scss";

import { useNavigate } from "react-router";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <li key={event.id}>
      <h2>{event.title}</h2>
      <p>{event.tag.name}</p>
      <p>{event.server.name}</p>
      <p>
        {new Date(event.date).toLocaleString("fr-FR", {
          timeZone: "UTC",
        })}
      </p>
      <p>{event.duration}</p>
      <p>
        {event.characters ? event.characters.length : 0}/{event.max_players}
      </p>
      <button>Détails</button>
    </li>
  );
}
