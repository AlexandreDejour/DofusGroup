import "./ProfileEventCard.scss";

import { Link } from "react-router";
import { useTypedTranslation } from "../../i18n/i18n-helper";

import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Event } from "../../types/event";

import { useScreen } from "../../contexts/screenContext";
import { TargetType, useModal } from "../../contexts/modalContext";

interface ProfileEventCardProps {
  event: Event;
  handleDelete?: (targetType: TargetType, targetId: string) => Promise<void>;
}

export default function ProfileEventCard({
  event,
  handleDelete,
}: ProfileEventCardProps) {
  const t = useTypedTranslation();

  const { openModal } = useModal();
  const { isDesktop } = useScreen();

  return (
    <Link to={`/event/${event.id}`} className="profile_event_card">
      <h3 className="profile_event_card_title">
        {event.title.charAt(0).toLocaleUpperCase() + event.title.slice(1)}
      </h3>
      <p
        className="profile_event_card_tag"
        style={{ backgroundColor: event.tag.color }}
      >
        {event.tag.name}
      </p>
      {isDesktop ? (
        <>
          <p className="profile_event_card_date">
            {new Date(event.date).toLocaleString(undefined, {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
          <p className="profile_event_card_players">
            {event.characters ? event.characters.length : 0}/{event.max_players}
          </p>
        </>
      ) : (
        <div className="profile_event_card_container">
          <p className="profile_event_card_container_date">
            <span>Date:</span>{" "}
            {new Date(event.date).toLocaleString(undefined, {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
          <p className="profile_event_card_container_players">
            <span>Joueurs:</span>{" "}
            {event.characters ? event.characters.length : 0}/{event.max_players}
          </p>
        </div>
      )}

      <div className="profile_event_card_actions">
        <button
          className="profile_event_card_actions_button button"
          aria-label={`Update event ${event.title}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal("updateEvent", event);
          }}
        >
          <FontAwesomeIcon icon={faPen} />
        </button>

        {handleDelete ? (
          <button
            className="profile_event_card_actions_button button delete"
            aria-label={`Delete event ${event.title}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete("event", event.id);
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        ) : null}
      </div>
    </Link>
  );
}
