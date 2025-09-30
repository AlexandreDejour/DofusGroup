import "./UpdateCharacterForm.scss";

import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Breed } from "../../../../types/breed";
import { Server } from "../../../../types/server";
import { CharacterEnriched } from "../../../../types/character";

import { useNotification } from "../../../../contexts/notificationContext";

import { Config } from "../../../../config/config";
import { ApiClient } from "../../../../services/client";
import { generateOptions } from "../../utils/generateOptions";
import { BreedService } from "../../../../services/api/breedService";
import { ServerService } from "../../../../services/api/serverService";

import BreedRadio from "../../formComponents/Radio/BreedRadio";
import GenderRadio from "../../formComponents/Radio/GenderRadio";
import SelectOptions from "../../formComponents/Options/SelectOptions";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const breedService = new BreedService(axios);
const serverService = new ServerService(axios);

interface UpdateCharacterFormProps {
  updateTarget: CharacterEnriched;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function UpdateCharacterForm({
  updateTarget,
  handleSubmit,
}: UpdateCharacterFormProps) {
  const { t } = useTranslation("translation");

  const { showError } = useNotification();

  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [servers, setServers] = useState<Server[]>([]);

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

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await breedService.getBreeds();

        setBreeds(response);
      } catch (error) {
        if (isAxiosError(error)) {
          showError(`${t("error")}`, error.message);
        } else if (error instanceof Error) {
          showError(`${t("error")}`, `${t("errorOccurred")}`);
          console.error("General error:", error.message);
        }
      }
    };

    const fetchServers = async () => {
      try {
        const response = await serverService.getServers();

        setServers(response);
      } catch (error) {
        if (isAxiosError(error)) {
          showError(`${t("error")}`, error.message);
        } else if (error instanceof Error) {
          showError(`${t("error")}`, `${t("errorOccurred")}`);
          console.error("General error:", error.message);
        }
      }
    };

    fetchBreeds();
    fetchServers();
  }, []);

  return (
    <div className="update_character">
      <h3 className="update_character_title">{t("characterModification")}</h3>
      <form
        onSubmit={handleSubmit}
        className="update_character_form"
        role="form"
      >
        <label htmlFor="name" className="update_character_form_label name">
          <span>{t("name")}:</span>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={t("name")}
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
          <span>{t("level")}:</span>
          <input
            type="number"
            name="level"
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.valueAsNumber)}
            required
            placeholder={t("level")}
            className="update_character_form_label_input"
          />
        </label>

        <SelectOptions
          name="server"
          value={server}
          items={servers}
          generateOptions={generateOptions.servers}
          label={t("server")}
          onChange={setServer}
        />

        <SelectOptions
          name="alignment"
          value={alignment}
          items={alignments}
          generateOptions={generateOptions.alignments}
          label={t("alignment")}
          onChange={setAlignment}
        />

        <label htmlFor="stuff" className="update_character_form_label stuff">
          <span>{t("stuff")}:</span>
          <input
            type="text"
            name="stuff"
            id="stuff"
            value={stuff}
            onChange={(e) => setStuff(e.target.value)}
            placeholder={t("dofusBookLink")}
            className="update_character_form_label_input"
          />
        </label>

        <label
          htmlFor="default_character"
          className="update_character_form_label default"
        >
          <span>{t("defaultCharacter")}:</span>
          <input
            type="checkbox"
            name="default_character"
            id="default_character"
            className="update_character_form_label_input"
          />
        </label>

        <button type="submit" className="update_character_form_button button">
          {t("changeMyCharacter")}
        </button>
      </form>
    </div>
  );
}
