import "./NewCharacterForm.scss";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

import { Breed } from "../../../../types/breed";
import { Server } from "../../../../types/server";

import { useNotification } from "../../../../contexts/notificationContext";

import { Config } from "../../../../config/config";
import { ApiClient } from "../../../../services/client";
import { generateOptions } from "../../utils/generateOptions";
import { BreedService } from "../../../../services/api/breedService";
import { ServerService } from "../../../../services/api/serverService";

import BreedRadio from "../../FormComponents/Radio/BreedRadio";
import GenderRadio from "../../FormComponents/Radio/GenderRadio";
import SelectOptions from "../../FormComponents/Options/SelectOptions";

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
          showError("Erreur", error.message);
        } else if (error instanceof Error) {
          showError("Erreur", "Une erreur est survenue");
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
          showError("Erreur", error.message);
        } else if (error instanceof Error) {
          showError("Erreur", "Une erreur est survenue");
          console.error("General error:", error.message);
        }
      }
    };

    fetchBreeds();
    fetchServers();
  }, []);

  return (
    <div className="new_character">
      <h3 className="new_character_title">Création de personnage</h3>
      <form onSubmit={handleSubmit} className="new_character_form" role="form">
        <label htmlFor="name" className="new_character_form_label name">
          <span>Nom:</span>
          <input
            type="text"
            name="name"
            id="name"
            required
            placeholder="Nom"
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
          <span>Niveau:</span>
          <input
            type="number"
            name="level"
            id="level"
            required
            placeholder="Niveau"
            className="new_character_form_label_input"
          />
        </label>

        <SelectOptions
          name="server"
          value={server}
          items={servers}
          generateOptions={generateOptions.servers}
          label="Serveur"
          onChange={setServer}
        />

        <SelectOptions
          name="alignment"
          value={alignment}
          items={alignments}
          generateOptions={generateOptions.alignments}
          label="Alignement"
          onChange={setAlignment}
        />

        <label htmlFor="stuff" className="new_character_form_label stuff">
          <span>Stuff:</span>
          <input
            type="text"
            name="stuff"
            id="stuff"
            placeholder="Lien DofusBook"
            className="new_character_form_label_input"
          />
        </label>

        <label
          htmlFor="default_character"
          className="new_character_form_label default"
        >
          <span>Personnage par défault:</span>
          <input
            type="checkbox"
            name="default_character"
            id="default_character"
            className="new_character_form_label_input"
          />
        </label>

        <button type="submit" className="new_character_form_button button">
          Créer un personnage
        </button>
      </form>
    </div>
  );
}
