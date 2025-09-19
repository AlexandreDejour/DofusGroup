import "./CharactersCheckbox.scss";

import { CharacterEnriched } from "../../../../types/character";

interface CharacterCheckboxProps {
  characters: CharacterEnriched[];
}

export default function CharactersCheckbox({
  characters,
}: CharacterCheckboxProps) {
  return (
    <fieldset className="characters">
      <legend>Vos personnages:</legend>
      <div className="characters_choices">
        {characters.map((character) => (
          <label
            key={character.id}
            htmlFor="characters_id"
            className="character_choices_label"
          >
            <div className="characters_choices_label_card">
              {character.sex === "M" ? (
                <img
                  className="characters_choices_label_card_img"
                  src={`/miniatures/${character.breed.name.toLocaleLowerCase()}_male.webp`}
                  alt={`Miniature de classe ${character.breed.name.toLocaleLowerCase()}`}
                />
              ) : (
                <img
                  className="characters_choices_label_card_img"
                  src={`/miniatures/${character.breed.name.toLocaleLowerCase()}_female.webp`}
                  alt={`Miniature de classe ${character.breed.name.toLocaleLowerCase()}`}
                />
              )}
              <div className="characters_choices_label_card_details">
                <h4 className="characters_choices_label_card_details_title">
                  {character.name}
                </h4>
                <p className="characters_choices_label_card_details_breed">
                  {character.breed.name}
                </p>
                <p className="characters_choices_label_card_details_level">
                  niveau: {character.level}
                </p>
              </div>
            </div>
            <input type="checkbox" name="characters_id" value={character.id} />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
