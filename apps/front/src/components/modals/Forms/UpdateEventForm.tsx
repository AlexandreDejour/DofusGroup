import "../Form.scss";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

import { Tag } from "../../../types/tag";
import { Server } from "../../../types/server";
import { EventEnriched } from "../../../types/event";
import { Area, Dungeon, SubArea } from "../../../types/dofusDB";

import { useAuth } from "../../../contexts/authContext";
import { useNotification } from "../../../contexts/notificationContext";

import { Config } from "../../../config/config";
import { ApiClient } from "../../../services/client";
import { generateOptions } from "../utils/generateOptions";
import { TagService } from "../../../services/api/tagService";
import { ServerService } from "../../../services/api/serverService";
import { DofusDBService } from "../../../services/api/dofusDBService";
import formatDateToLocalInput from "../utils/formatDateToLocalInput";

import SelectOptions from "../FormComponents/Options/SelectOptions";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const dofusDBService = new DofusDBService(axios);
const tagService = new TagService(axios);
const serverService = new ServerService(axios);

interface NewEventFormProps {
  updateTarget: EventEnriched;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function NewEventForm({
  updateTarget,
  handleSubmit,
}: NewEventFormProps) {
  const { user } = useAuth();
  const { showError } = useNotification();

  const [tags, setTags] = useState<Tag[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [subAreas, setSubAreas] = useState<SubArea[]>([]);
  const [dungeons, setDungeons] = useState<Dungeon[]>([]);

  const [area, setArea] = useState<string>(
    updateTarget.area ? updateTarget.area : "",
  );
  const [subArea, setSubArea] = useState<string>(
    updateTarget.sub_area ? updateTarget.sub_area : "",
  );
  const [description, setDescription] = useState<string>(
    updateTarget.description ? updateTarget.description : "",
  );
  const [dungeon, setDungeon] = useState<string>(
    updateTarget.donjon_name ? updateTarget.donjon_name : "",
  );
  const [tag, setTag] = useState<string>(updateTarget.tag.name);
  const [status, setStatus] = useState<string>(updateTarget.status);
  const [duration, setDuration] = useState<number>(updateTarget.duration);
  const [date, setDate] = useState<string>(updateTarget.date.toISOString());
  const [server, setServer] = useState<string>(updateTarget.server.name);
  const [registeredCharacters, setRegisteredCharacters] = useState<string[]>(
    updateTarget.characters.map((c) => String(c.id)),
  );
  const [maxPlayers, setMaxPlayers] = useState<number>(
    updateTarget.max_players,
  );

  const [isDungeon, setIsDungeon] = useState(false);

  const statutes = [
    { id: 1, label: "Privé", value: "private" },
    { id: 2, label: "Public", value: "public" },
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

    setDate(formatDateToLocalInput(new Date()));

    fetchTags();
    fetchServers();
    fetchAreas();
  }, [area]);

  useEffect(() => {
    const fetchDungeons = async () => {
      const selectedTag = tags.find((t) => t.id === tag);

      if (!selectedTag || selectedTag.name !== "Donjon") {
        setIsDungeon(false);
        return;
      }

      setIsDungeon(true);

      try {
        if (subArea) {
          const selectedSubArea = subAreas.find((s) => s.name.fr === subArea);

          if (!selectedSubArea) return;

          const response = await dofusDBService.getDungeons(
            selectedSubArea.dungeonId,
          );

          setDungeons(response);
        } else {
          const response = await dofusDBService.getDungeons();

          setDungeons(response);
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

    fetchDungeons();
  }, [tag, subArea]);

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
            type="datetime-local"
            name="date"
            id="date"
            value={date}
            min={formatDateToLocalInput(new Date())}
            required
            className="content_modal_form_label_input"
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label htmlFor="duration" className="content_modal_form_label">
          <span>Durée:</span>
          <input
            type="number"
            name="duration"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
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
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(Number(e.target.value))}
            id="max_players"
            placeholder="Joueurs maximum"
            className="content_modal_form_label_input"
          />
        </label>

        <label htmlFor="description" className="content_modal_form_label">
          <span>Description:</span>
          <textarea
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Description"
            className="content_modal_form_label_input"
          />
        </label>

        <SelectOptions
          name="status"
          value={status}
          items={statutes}
          generateOptions={generateOptions.statutes}
          label="Visibilité"
          onChange={setStatus}
        />

        <button type="submit" className="content_modal_form_button button">
          Modifier mon évènement
        </button>
      </form>
    </div>
  );
}
