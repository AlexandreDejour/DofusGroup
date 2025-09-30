import "./CharactersCheckbox.scss";

import { t } from "../../../../i18n/i18n-helper";

import { CharacterEnriched } from "../../../../types/character";

interface CharacterCheckboxProps {
  characters: CharacterEnriched[];
}

export default function CharactersCheckbox({
  characters,
}: CharacterCheckboxProps) {
  return (
    <fieldset className="characters">
      <legend>{t("character.your")}:</legend>
      <div className="characters_choices">
        {characters.map((character) => (
          <label key={character.id} className="characters_choices_label">
            <input
              type="checkbox"
              name="characters_id"
              value={character.id}
              className="sr-only"
            />
            <div className="characters_choices_label_card">
              {character.sex === "M" ? (
                <img
                  className="characters_choices_label_card_img"
                  src={`/miniatures/${character.breed.name.toLocaleLowerCase()}_male.webp`}
                  alt={`${t(
                    "common.classThumbnail",
                  )} ${character.breed.name.toLocaleLowerCase()}`}
                />
              ) : (
                <img
                  className="characters_choices_label_card_img"
                  src={`/miniatures/${character.breed.name.toLocaleLowerCase()}_female.webp`}
                  alt={`${t(
                    "common.classThumbnail",
                  )} ${character.breed.name.toLocaleLowerCase()}`}
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
                  {t("common.level")}: {character.level}
                </p>
              </div>
            </div>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
