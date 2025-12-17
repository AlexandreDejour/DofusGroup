import "./UpdateCharacterForm.scss";

import { useState } from "react";
import { useTypedTranslation } from "../../../../i18n/i18n-helper";

import { CharacterEnriched } from "../../../../types/character";

import { generateOptions } from "../../utils/generateOptions";
import useFetchBreeds from "../../../../hooks/useFetchBreeds";
import useFetchServers from "../../../../hooks/useFetchServers";

import BreedRadio from "../../formComponents/Radio/BreedRadio";
import GenderRadio from "../../formComponents/Radio/GenderRadio";
import SelectOptions from "../../formComponents/Options/SelectOptions";

interface UpdateCharacterFormProps {
  updateTarget: CharacterEnriched;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function UpdateCharacterForm({
  updateTarget,
  handleSubmit,
}: UpdateCharacterFormProps) {
  const t = useTypedTranslation();

  const [sex, setSex] = useState<string>(updateTarget.sex);
  const [name, setName] = useState<string>(updateTarget.name);
  const [stuff, setStuff] = useState<string>(
    updateTarget.stuff ? updateTarget.stuff : "",
  );
  const [level, setLevel] = useState<number>(updateTarget.level);
  const [breed, setBreed] = useState<string>(updateTarget.breed.id);
  const [server, setServer] = useState<string>(updateTarget.server.id);
  const [alignment, setAlignment] = useState<string>(updateTarget.alignment);

  const alignments = [
    { id: 1, name: "Bonta" },
    { id: 2, name: "Brâkmar" },
    { id: 3, name: "Neutre" },
  ];

  const { breeds } = useFetchBreeds();
  const { servers } = useFetchServers();

  return (
    <div className="update_character">
      <h3 className="update_character_title">{t("character.modification")}</h3>
      <form
        onSubmit={handleSubmit}
        className="update_character_form"
        role="form"
      >
        <label htmlFor="name" className="update_character_form_label name">
          <span>{t("common.name")}:</span>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={t("common.name")}
            className="update_character_form_label_input"
          />
        </label>

        <BreedRadio
          name="breed"
          value={breed}
          sex={sex}
          breeds={breeds}
          onChange={setBreed}
        />

        <GenderRadio name="sex" value={sex} onChange={setSex} />

        <label
          htmlFor="level"
          className="update_character_form_label level"
          style={{ marginTop: "0" }}
        >
          <span>{t("common.level")}:</span>
          <input
            type="number"
            name="level"
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.valueAsNumber)}
            required
            placeholder={t("common.level")}
            className="update_character_form_label_input"
          />
        </label>

        <SelectOptions
          name="server"
          value={server}
          items={servers}
          generateOptions={generateOptions.servers}
          label={t("server.default")}
          onChange={setServer}
        />

        <SelectOptions
          name="alignment"
          value={alignment}
          items={alignments}
          generateOptions={generateOptions.alignments}
          label={t("common.alignment")}
          onChange={setAlignment}
        />

        <label htmlFor="stuff" className="update_character_form_label stuff">
          <span>{t("common.stuff")}:</span>
          <input
            type="text"
            name="stuff"
            id="stuff"
            value={stuff}
            onChange={(e) => setStuff(e.target.value)}
            placeholder={t("common.dofusBook")}
            className="update_character_form_label_input"
          />
        </label>

        <button type="submit" className="update_character_form_button button">
          {t("character.modification")}
        </button>
      </form>
    </div>
  );
}
