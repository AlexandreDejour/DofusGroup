import "./ProfileEventCard.scss";

import { useNavigate } from "react-router";
import { useTypedTranslation } from "../../i18n/i18n-helper";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Event } from "../../types/event";

import { useScreen } from "../../contexts/screenContext";
import { TargetType } from "../../contexts/modalContext";

interface ProfileEventCardProps {
  event: Event;
  handleDelete: (targetType: TargetType, targetId: string) => Promise<void>;
}

export default function ProfileEventCard({
  event,
  handleDelete,
}: ProfileEventCardProps) {
  const navigate = useNavigate();
  const t = useTypedTranslation();

  const { isDesktop } = useScreen();

  return (
    <article className="profile_event_card">
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

      <div className="profile_event_card_buttons">
        <button
          className="profile_event_card_buttons_details button"
          onClick={() => navigate(`/event/${event.id}`)}
        >
          {t("common.details")}
        </button>
        <button
          className="profile_event_card_buttons_delete button delete"
          aria-label={`Delete event ${event.title}`}
          onClick={() => handleDelete("event", event.id)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </article>
  );
}
