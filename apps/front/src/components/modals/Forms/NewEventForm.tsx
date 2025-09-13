import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useNotification } from "../../../contexts/notificationContext";
import "../Form.scss";
import { Area, Dungeon, SubArea } from "../../../types/dofusDB";
import { DofusDBService } from "../../../services/api/dofusDBService";
import { Config } from "../../../config/config";
import { ApiClient } from "../../../services/client";
import SelectOptions from "../FormComponents/Options/SelectOptions";
import { generateOptions } from "../utils/generateOptions";
import { Tag } from "../../../types/tag";
import { TagService } from "../../../services/api/tagService";
import { Server } from "../../../types/server";
import { ServerService } from "../../../services/api/serverService";
import { Character } from "../../../types/character";
import { CharacterService } from "../../../services/api/characterService";
import { useAuth } from "../../../contexts/authContext";
import CharactersOptions from "../FormComponents/Options/CharacterOptions";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const dofusDBService = new DofusDBService(axios);
const tagService = new TagService(axios);
const serverService = new ServerService(axios);
const characterService = new CharacterService(axios);

interface NewEventFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function NewEventForm({ handleSubmit }: NewEventFormProps) {
  const { user } = useAuth();
  const { showError } = useNotification();
  const [tags, setTags] = useState<Tag[]>([]);
  const [tag, setTag] = useState<string>("");
  const [servers, setServers] = useState<Server[]>([]);
  const [server, setServer] = useState<string>("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [registeredCharacters, setRegisteredCharacters] = useState<string[]>(
    [],
  );
  const [areas, setAreas] = useState<Area[]>([]);
  const [area, setArea] = useState<string>("");
  const [subAreas, setSubAreas] = useState<SubArea[]>([]);
  const [subArea, setSubArea] = useState<string>("");
  const [dungeons, setDungeons] = useState<Dungeon[]>([]);
  const [dungeon, setDungeon] = useState<string>("");
  const [isDungeon, setIsDungeon] = useState(false);

  const [status, setStatus] = useState<string>("");

  const statutes = [
    { label: "Privé", value: "private" },
    { label: "Public", value: "public" },
  ];

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await tagService.getTags();

        setTags(response);
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

    const fetchCharacters = async () => {
      if (!user) return;

      try {
        const response = await characterService.getAllByUserId(user.id);

        setCharacters(response);
      } catch (error) {
        if (isAxiosError(error)) {
          showError("Erreur", error.message);
        } else if (error instanceof Error) {
          showError("Erreur", "Une erreur est survenue");
          console.error("General error:", error.message);
        }
      }
    };

    const fetchAreas = async () => {
      try {
        const response = await dofusDBService.getAreas();

        setAreas(response);

        if (area) {
          const fetchSubAreas = async () => {
            const selectedArea = areas.find((a) => a.name.fr === area);

            if (!selectedArea) return;

            try {
              const response = await dofusDBService.getSubAreas(
                selectedArea.id,
              );

              setSubAreas(response);
            } catch (error) {
              throw error;
            }
          };

          fetchSubAreas();
        }
      } catch (error) {
        if (isAxiosError(error)) {
          showError("Erreur", error.message);
        } else if (error instanceof Error) {
          showError("Erreur", "Une erreur est survenue");
          console.error("General error:", error.message);
        }
      }
    };

    fetchTags();
    fetchServers();
    fetchCharacters();
    fetchAreas();
  }, [area]);

  useEffect(() => {
    const fetchDungeons = async () => {
      const selectedTag = tags.find((t) => t.id === tag);

      if (!selectedTag || selectedTag.name !== "Donjon") return;

      setIsDungeon(true);

      try {
        const response = await dofusDBService.getDungeons();
        console.log(response);
        setDungeons(response);
      } catch (error) {
        if (isAxiosError(error)) {
          showError("Erreur", error.message);
        } else if (error instanceof Error) {
          showError("Erreur", "Une erreur est survenue");
          console.error("General error:", error.message);
        }
      }
    };

    fetchDungeons();
  }, [tag]);

  return (
    <div className="content_modal">
      <h3 className="content_modal_title">Création d'évènement</h3>
      <form onSubmit={handleSubmit} className="content_modal_form" role="form">
        <label htmlFor="title" className="content_modal_form_label">
          <span>Titre:</span>
          <input
            type="text"
            name="title"
            id="title"
            required
            placeholder="Titre"
            className="content_modal_form_label_input"
          />
        </label>

        <SelectOptions
          name="tag"
          value={tag}
          items={tags}
          generateOptions={generateOptions.tags}
          label="Tag"
          onChange={setTag}
        />

        <SelectOptions
          name="server"
          value={server}
          items={servers}
          generateOptions={generateOptions.servers}
          label="Serveur"
          onChange={setServer}
        />

        <label htmlFor="date" className="content_modal_form_label">
          <span>Date:</span>
          <input
            type="datetime-locale"
            name="date"
            id="date"
            value={new Date().toISOString().slice(0, 16)}
            required
            className="content_modal_form_label_input"
          />
        </label>

        <label htmlFor="duration" className="content_modal_form_label">
          <span>Durée:</span>
          <input
            type="number"
            name="duration"
            id="duration"
            placeholder="Durée en minutes"
            className="content_modal_form_label_input"
          />
        </label>

        <SelectOptions
          name="area"
          value={area}
          items={areas}
          generateOptions={generateOptions.areas}
          label="Zone"
          onChange={setArea}
        />

        {area ? (
          <SelectOptions
            name="sub_area"
            value={subArea}
            items={subAreas}
            generateOptions={generateOptions.subAreas}
            label="Sous-zone"
            onChange={setSubArea}
          />
        ) : null}

        {isDungeon ? (
          <SelectOptions
            name="donjon_name"
            value={dungeon}
            items={dungeons}
            generateOptions={generateOptions.dungeons}
            label="Donjon"
            onChange={setDungeon}
          />
        ) : null}

        <label htmlFor="max_players" className="content_modal_form_label">
          <span>Joueurs maximum:</span>
          <input
            type="number"
            name="max_players"
            id="max_players"
            placeholder="Joueurs maximum"
            className="content_modal_form_label_input"
          />
        </label>

        <label htmlFor="description" className="content_modal_form_label">
          <span>Description:</span>
          <input
            type="textarea"
            name="description"
            id="description"
            placeholder="Description"
            className="content_modal_form_label_input"
          />
        </label>

        <CharactersOptions
          name="characters"
          value={registeredCharacters}
          items={characters}
          generateOptions={generateOptions.characters}
          label="Vos personnages isncrits"
          onChange={setRegisteredCharacters}
        />

        <SelectOptions
          name="status"
          value={status}
          items={statutes}
          generateOptions={generateOptions.statutes}
          label="Visibilité"
          onChange={setStatus}
        />

        <button type="submit" className="content_modal_form_button button">
          Créer un évènement
        </button>
      </form>
    </div>
  );
}
