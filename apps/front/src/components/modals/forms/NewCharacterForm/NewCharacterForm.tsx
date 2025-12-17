import "./NewCharacterForm.scss";

import { useState } from "react";
import { useTypedTranslation } from "../../../../i18n/i18n-helper";

import { generateOptions } from "../../utils/generateOptions";
import useFetchBreeds from "../../../../hooks/useFetchBreeds";
import useFetchServers from "../../../../hooks/useFetchServers";

import BreedRadio from "../../formComponents/Radio/BreedRadio";
import GenderRadio from "../../formComponents/Radio/GenderRadio";
import SelectOptions from "../../formComponents/Options/SelectOptions";

interface NewCharacterFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function NewCharacterForm({
  handleSubmit,
}: NewCharacterFormProps) {
  const t = useTypedTranslation();

  const [sex, setSex] = useState<string>("M");
  const [breed, setBreed] = useState<string>("");
  const [server, setServer] = useState<string>("");
  const [alignment, setAlignment] = useState<string>("");

  const alignments = [
    { id: 1, name: "Bonta" },
    { id: 2, name: "Brâkmar" },
    { id: 3, name: "Neutre" },
  ];

  const { servers } = useFetchServers();
  const { breeds } = useFetchBreeds();

  return (
    <div className="new_character">
      <h3 className="new_character_title">{t("character.create")}</h3>
      <form onSubmit={handleSubmit} className="new_character_form" role="form">
        <label htmlFor="name" className="new_character_form_label name">
          <span>{t("common.name")}:</span>
          <input
            type="text"
            name="name"
            id="name"
            required
            placeholder={t("common.name")}
            className="new_character_form_label_input"
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
          className="new_character_form_label level"
          style={{ margin: "0 auto" }}
        >
          <span>{t("common.level")}:</span>
          <input
            type="number"
            name="level"
            id="level"
            required
            placeholder={t("common.level")}
            className="new_character_form_label_input"
          />
        </label>

        <SelectOptions
          name="server"
          value={server}
          items={servers}
          generateOptions={generateOptions.servers}
          label={t("server.upperCase")}
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

        <label htmlFor="stuff" className="new_character_form_label stuff">
          <span>{t("common.stuff")}:</span>
          <input
            type="text"
            name="stuff"
            id="stuff"
            placeholder={t("common.dofusBook")}
            className="new_character_form_label_input"
          />
        </label>

        <button type="submit" className="new_character_form_button button">
          {t("character.create")}
        </button>
      </form>
    </div>
  );
}
