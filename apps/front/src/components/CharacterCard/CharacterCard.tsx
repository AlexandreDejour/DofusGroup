import "./CharacterCard.scss";

import { Link } from "react-router";
import { useTypedTranslation } from "../../i18n/i18n-helper";

import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { CharacterEnriched } from "../../types/character";

import { useScreen } from "../../contexts/screenContext";
import { TargetType, useModal } from "../../contexts/modalContext";

interface CharacterCardProps {
  character: CharacterEnriched;
  handleDelete: (targetType: TargetType, targetId: string) => Promise<void>;
}

export default function CharacterCard({
  character,
  handleDelete,
}: CharacterCardProps) {
  const t = useTypedTranslation();

  const { openModal } = useModal();
  const { isDesktop } = useScreen();

  return (
    <Link to={`/character/${character.id}`} className="character_card">
      {character.sex === "M" ? (
        <img
          className="character_card_img"
          src={`/miniatures/${character.breed.name.toLocaleLowerCase()}_male.webp`}
          alt={`${t(
            "common.classThumbnail",
          )} ${character.breed.name.toLocaleLowerCase()}`}
        />
      ) : (
        <img
          className="character_card_img"
          src={`/miniatures/${character.breed.name.toLocaleLowerCase()}_female.webp`}
          alt={`${t(
            "common.classThumbnail",
          )} ${character.breed.name.toLocaleLowerCase()}`}
        />
      )}

      {isDesktop ? (
        <>
          <h3 className="character_card_name">{character.name}</h3>
          <p className="character_card_breed">{character.breed.name}</p>
          <p className="character_card_level">
            {t("common.level")}: {character.level}
          </p>
        </>
      ) : (
        <div className="character_card_container">
          <h3 className="character_card_container_name">{character.name}</h3>
          <p className="character_card_container_breed">
            {character.breed.name}
          </p>
          <p className="character_card_container_level">
            {t("common.level")}: {character.level}
          </p>
        </div>
      )}

      <div className="character_card_actions">
        <button
          className="character_card_actions_button button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal("updateCharacter", character);
          }}
        >
          <FontAwesomeIcon icon={faPen} />
        </button>
        <button
          className="character_card_actions_button button delete"
          aria-label={`Delete event ${character.name}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDelete("character", character.id);
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </Link>
  );
}
