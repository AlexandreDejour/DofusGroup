import "./NewCharacterForm.scss";

import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useTypedTranslation } from "../../../../i18n/i18n-helper";

import { Breed } from "../../../../types/breed";
import { Server } from "../../../../types/server";

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

interface NewCharacterFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function NewCharacterForm({
  handleSubmit,
}: NewCharacterFormProps) {
  const t = useTypedTranslation();

  const { showError } = useNotification();

  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [servers, setServers] = useState<Server[]>([]);

  const [sex, setSex] = useState<string>("M");
  const [breed, setBreed] = useState<string>("");
  const [server, setServer] = useState<string>("");
  const [alignment, setAlignment] = useState<string>("");

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
          showError(t("common.error"), error.message);
        } else if (error instanceof Error) {
          showError(t("common.error"), t("system.error.occurred"));
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
          showError(t("common.error"), error.message);
        } else if (error instanceof Error) {
          showError(t("common.error"), t("system.error.occurred"));
          console.error("General error:", error.message);
        }
      }
    };

    fetchBreeds();
    fetchServers();
  }, []);

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

        <label
          htmlFor="default_character"
          className="new_character_form_label default"
        >
          <span>{t("character.default")}:</span>
          <input
            type="checkbox"
            name="default_character"
            id="default_character"
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
