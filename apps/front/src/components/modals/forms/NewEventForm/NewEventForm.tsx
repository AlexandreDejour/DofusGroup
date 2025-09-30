import "./NewEventForm.scss";

import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { t } from "../../../../i18n/i18n-helper";

import { Tag } from "../../../../types/tag";
import { Server } from "../../../../types/server";
import { Character } from "../../../../types/character";
import { Area, Dungeon, SubArea } from "../../../../types/dofusDB";

import { useAuth } from "../../../../contexts/authContext";
import { useNotification } from "../../../../contexts/notificationContext";

import { Config } from "../../../../config/config";
import { ApiClient } from "../../../../services/client";
import { generateOptions } from "../../utils/generateOptions";
import { TagService } from "../../../../services/api/tagService";
import { ServerService } from "../../../../services/api/serverService";
import { DofusDBService } from "../../../../services/api/dofusDBService";
import { CharacterService } from "../../../../services/api/characterService";
import formatDateToLocalInput from "../../utils/formatDateToLocalInput";

import SelectOptions from "../../formComponents/Options/SelectOptions";
import CharactersOptions from "../../formComponents/Options/CharactersOptions";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const tagService = new TagService(axios);
const serverService = new ServerService(axios);
const dofusDBService = new DofusDBService(axios);
const characterService = new CharacterService(axios);

interface NewEventFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function NewEventForm({ handleSubmit }: NewEventFormProps) {
  const { user } = useAuth();
  const { showError } = useNotification();

  const [tags, setTags] = useState<Tag[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [subAreas, setSubAreas] = useState<SubArea[]>([]);
  const [dungeons, setDungeons] = useState<Dungeon[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);

  const [tag, setTag] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [server, setServer] = useState<string>("");
  const [subArea, setSubArea] = useState<string>("");
  const [dungeon, setDungeon] = useState<string>("");
  const [registeredCharacters, setRegisteredCharacters] = useState<string[]>(
    [],
  );

  const [isDungeon, setIsDungeon] = useState(false);

  const statutes = [
    { id: 1, label: `${t("common.private")}`, value: "private" },
    { id: 2, label: `${t("common.public")}`, value: "public" },
  ];

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await tagService.getTags();

        setTags(response);
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

    const fetchCharacters = async () => {
      if (!user) return;

      try {
        const response = await characterService.getAllByUserId(user.id);

        if (server !== "") {
          const characters = response.filter(
            (character) => character.server_id === server,
          );

          setCharacters(characters);
        } else setCharacters(response);
      } catch (error) {
        if (isAxiosError(error)) {
          showError(t("common.error"), error.message);
        } else if (error instanceof Error) {
          showError(t("common.error"), t("system.error.occurred"));
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
          showError(t("common.error"), error.message);
        } else if (error instanceof Error) {
          showError(t("common.error"), t("system.error.occurred"));
          console.error("General error:", error.message);
        }
      }
    };

    setDate(formatDateToLocalInput(new Date()));

    fetchTags();
    fetchServers();
    fetchCharacters();
    fetchAreas();
  }, [area, server]);

  useEffect(() => {
    const fetchDungeons = async () => {
      const selectedTag = tags.find((t) => t.id === tag);

      if (!selectedTag || selectedTag.name !== t("common.dungeon")) {
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
          showError(t("common.error"), error.message);
        } else if (error instanceof Error) {
          showError(t("common.error"), t("system.error.occurred"));
          console.error("General error:", error.message);
        }
      }
    };

    fetchDungeons();
  }, [tag, subArea]);

  return (
    <div className="new_event">
      <h3 className="new_event_title">{t("event.create")}</h3>
      <form onSubmit={handleSubmit} className="new_event_form" role="form">
        <label htmlFor="title" className="new_event_form_label title">
          <span>{t("common.title")}:</span>
          <input
            type="text"
            name="title"
            id="title"
            required
            placeholder={t("common.title")}
            className="new_event_form_label_input"
          />
        </label>

        <SelectOptions
          name="tag"
          value={tag}
          items={tags}
          generateOptions={generateOptions.tags}
          label={t("tag.default")}
          onChange={setTag}
        />

        <SelectOptions
          name="server"
          value={server}
          items={servers}
          generateOptions={generateOptions.servers}
          label={t("server.default")}
          onChange={setServer}
        />

        <label htmlFor="date" className="new_event_form_label date">
          <span>{t("common.date")}:</span>
          <input
            type="datetime-local"
            name="date"
            id="date"
            value={date}
            min={formatDateToLocalInput(new Date())}
            required
            className="new_event_form_label_input"
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label htmlFor="duration" className="new_event_form_label duration">
          <span>{t("common.duration")}:</span>
          <input
            type="number"
            name="duration"
            id="duration"
            required
            placeholder={t("common.durationInMin")}
            className="new_event_form_label_input"
          />
        </label>

        <SelectOptions
          name="area"
          value={area}
          items={areas}
          generateOptions={generateOptions.areas}
          label={t("common.area")}
          onChange={setArea}
        />

        {area ? (
          <SelectOptions
            name="sub_area"
            value={subArea}
            items={subAreas}
            generateOptions={generateOptions.subAreas}
            label={t("common.subArea")}
            onChange={setSubArea}
          />
        ) : null}

        {isDungeon ? (
          <SelectOptions
            name="donjon_name"
            value={dungeon}
            items={dungeons}
            generateOptions={generateOptions.dungeons}
            label={t("common.dungeon")}
            onChange={setDungeon}
          />
        ) : null}

        <label
          htmlFor="max_players"
          className="new_event_form_label max_players"
        >
          <span>{t("common.maxPlayers")}:</span>
          <input
            type="number"
            name="max_players"
            id="max_players"
            placeholder={t("common.maxPlayers")}
            className="new_event_form_label_input"
          />
        </label>

        <label
          htmlFor="description"
          className="new_event_form_label description"
        >
          <span>{t("common.description")}:</span>
          <textarea
            name="description"
            id="description"
            rows={4}
            placeholder={t("common.description")}
            className="new_event_form_label_input"
          />
        </label>

        <CharactersOptions
          name="characters"
          value={registeredCharacters}
          items={characters}
          generateOptions={generateOptions.characters}
          label={t("character.selection")}
          onChange={setRegisteredCharacters}
        />

        <SelectOptions
          name="status"
          value={status}
          items={statutes}
          generateOptions={generateOptions.statutes}
          label={t("common.visibility")}
          onChange={setStatus}
        />

        <button type="submit" className="new_event_form_button button">
          {t("event.create")}
        </button>
      </form>
    </div>
  );
}
