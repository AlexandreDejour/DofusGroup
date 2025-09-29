import "./EventCharacterCard.scss";

import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { EventEnriched } from "../../types/event";
import { CharacterEnriched } from "../../types/character";

import { useAuth } from "../../contexts/authContext";
import { useScreen } from "../../contexts/screenContext";

interface CharacterCardProps {
  event: EventEnriched;
  character: CharacterEnriched;
  removeCharacter: (eventId: string, characterId: string) => Promise<void>;
}

export default function EventCharacterCard({
  event,
  character,
  removeCharacter,
}: CharacterCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("translation");

  const { user } = useAuth();
  const { isDesktop } = useScreen();

  return (
    <article className="event_character_card">
      {character.sex === "M" ? (
        <img
          className="event_character_card_img"
          src={`/miniatures/${character.breed.name.toLocaleLowerCase()}_male.webp`}
          alt={`${t(
            "classThumbnail",
          )} ${character.breed.name.toLocaleLowerCase()}`}
        />
      ) : (
        <img
          className="event_character_card_img"
          src={`/miniatures/${character.breed.name.toLocaleLowerCase()}_female.webp`}
          alt={`${t(
            "classThumbnail",
          )} ${character.breed.name.toLocaleLowerCase()}`}
        />
      )}

      {isDesktop ? (
        <>
          <h3 className="event_character_card_name">{character.name}</h3>
          <p className="event_character_card_breed">{character.breed.name}</p>
          <p className="event_character_card_level">
            {t("level")}: {character.level}
          </p>
        </>
      ) : (
        <div className="event_character_card_container">
          <h3 className="event_character_card_container_name">
            {character.name}
          </h3>
          <p className="event_character_card_container_breed">
            {character.breed.name}
          </p>
          <p className="event_character_card_container_level">
            {t("level")}: {character.level}
          </p>
        </div>
      )}

      {user && (event.user?.id === user.id || character.user.id === user.id) ? (
        <div className="event_character_card_buttons">
          <button
            className="event_character_card_buttons_details button"
            onClick={() => navigate(`/character/${character.id}`)}
          >
            {t("details")}
          </button>
          <button
            className="event_character_card_buttons_delete button delete"
            aria-label={`Delete event ${character.name}`}
            onClick={() => removeCharacter(event.id, character.id)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ) : (
        <button
          className="event_character_card_details button"
          onClick={() => navigate(`/character/${character.id}`)}
        >
          {t("details")}
        </button>
      )}
    </article>
  );
}
