import "./CharacterCard.scss";

import { useNavigate } from "react-router";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { CharacterEnriched } from "../../types/character";

import { useScreen } from "../../contexts/screenContext";
import { TargetType } from "../../contexts/modalContext";

interface CharacterCardProps {
  character: CharacterEnriched;
  handleDelete: (targetType: TargetType, targetId: string) => Promise<void>;
}

export default function CharacterCard({
  character,
  handleDelete,
}: CharacterCardProps) {
  const navigate = useNavigate();
  const { isDesktop } = useScreen();

  return (
    <article className="character_card">
      {character.sex === "M" ? (
        <img
          className="character_card_img"
          src={`/miniatures/${character.breed.name.toLocaleLowerCase()}_male.webp`}
          alt={`Miniature de classe ${character.breed.name.toLocaleLowerCase()}`}
        />
      ) : (
        <img
          className="character_card_img"
          src={`/miniatures/${character.breed.name.toLocaleLowerCase()}_female.webp`}
          alt={`Miniature de classe ${character.breed.name.toLocaleLowerCase()}`}
        />
      )}

      {isDesktop ? (
        <>
          <h3 className="character_card_name">{character.name}</h3>
          <p className="character_card_breed">{character.breed.name}</p>
          <p className="character_card_level">niveau: {character.level}</p>
        </>
      ) : (
        <div className="character_card_container">
          <h3 className="character_card_container_name">{character.name}</h3>
          <p className="character_card_container_breed">
            {character.breed.name}
          </p>
          <p className="character_card_container_level">
            niveau: {character.level}
          </p>
        </div>
      )}

      <div className="character_card_buttons">
        <button
          className="character_card_buttons_details button"
          onClick={() => navigate(`/character/${character.id}`)}
        >
          Détails
        </button>
        <button
          className="character_card_buttons_delete button delete"
          aria-label={`Delete event ${character.name}`}
          onClick={() => handleDelete("character", character.id)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </article>
  );
}
