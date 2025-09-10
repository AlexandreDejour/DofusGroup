import "./CharacterCard.scss";

import { useNavigate } from "react-router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { CharacterEnriched } from "../../types/character";

interface CharacterCardProps {
  character: CharacterEnriched;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const navigate = useNavigate();

  return (
    <article className="character_card">
      {character.sex === "M" ? (
        <img
          className="character_card_img"
          src={`/miniatures/${character.breed.name.toLocaleLowerCase()}_male.webp`}
          alt=""
        />
      ) : (
        <img
          className="character_card_img"
          src={`/miniatures/${character.breed.name.toLocaleLowerCase()}_female.webp`}
          alt=""
        />
      )}

      <h3 className="character_card_title">{character.name}</h3>
      <p className="character_card_breed">{character.breed.name}</p>
      <p className="character_card_level">niveau: {character.level}</p>
      <div className="character_card_buttons">
        <button
          className="character_card_buttons_details button"
          onClick={() => navigate(`/details/${character.id}`)}
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
