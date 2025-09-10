import "./ProfileEventCard.scss";

import { useNavigate } from "react-router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { Event } from "../../types/event";

interface ProfileEventCardProps {
  event: Event;
}

export default function ProfileEventCard({ event }: ProfileEventCardProps) {
  const navigate = useNavigate();

  return (
    <article className="event_card">
      <h3 className="event_card_title">{event.title}</h3>
      <p
        className="event_card_tag"
        style={{ backgroundColor: event.tag.color }}
      >
        {event.tag.name}
      </p>
      <p className="event_card_date">
        {new Date(event.date).toLocaleString("fr-FR", {
          timeZone: "UTC",
        })}
      </p>
      <p className="event_card_players">
        {event.characters ? event.characters.length : 0}/{event.max_players}
      </p>
      <div className="character_card_buttons">
        <button
          className="event_card_buttons_details button"
          onClick={() => navigate(`/details/${event.id}`)}
        >
          Détails
        </button>
        <button className="character_card_buttons_delete button delete">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </article>
  );
}
