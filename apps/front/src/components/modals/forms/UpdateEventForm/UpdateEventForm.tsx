import "./UpdateEventForm.scss";

import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Tag } from "../../../../types/tag";
import { Server } from "../../../../types/server";
import { EventEnriched } from "../../../../types/event";
import { Area, Dungeon, SubArea } from "../../../../types/dofusDB";

import { useNotification } from "../../../../contexts/notificationContext";

import { Config } from "../../../../config/config";
import { ApiClient } from "../../../../services/client";
import { generateOptions } from "../../utils/generateOptions";
import { TagService } from "../../../../services/api/tagService";
import { ServerService } from "../../../../services/api/serverService";
import { DofusDBService } from "../../../../services/api/dofusDBService";
import formatDateToLocalInput from "../../utils/formatDateToLocalInput";

import SelectOptions from "../../formComponents/Options/SelectOptions";

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
  const { t } = useTranslation("translation");

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
  const [maxPlayers, setMaxPlayers] = useState<number>(
    updateTarget.max_players,
  );
  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState<string>(
    updateTarget.description ? updateTarget.description : "",
  );
  const [dungeon, setDungeon] = useState<string>(
    updateTarget.donjon_name ? updateTarget.donjon_name : "",
  );
  const [tag, setTag] = useState<string>(updateTarget.tag.id);
  const [title, setTitle] = useState<string>(updateTarget.title);
  const [status, setStatus] = useState<string>(updateTarget.status);
  const [server, setServer] = useState<string>(updateTarget.server.id);
  const [duration, setDuration] = useState<number>(updateTarget.duration);

  const [isDungeon, setIsDungeon] = useState(false);

  const statutes = [
    { id: 1, label: `${t("private")}`, value: "private" },
    { id: 2, label: `${t("public")}`, value: "public" },
  ];

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await tagService.getTags();

        setTags(response);
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

    const fetchAreas = async () => {
      try {
        const response = await dofusDBService.getAreas();

        setAreas(response);

        if (area) {
          const fetchSubAreas = async () => {
            const selectedArea = response.find((a) => a.name.fr === area);

            if (!selectedArea) return;

            try {
              const subAreasResponse = await dofusDBService.getSubAreas(
                selectedArea.id,
              );
              setSubAreas(subAreasResponse);

              setSubAreas(subAreasResponse);
            } catch (error) {
              throw error;
            }
          };

          fetchSubAreas();
        }
      } catch (error) {
        if (isAxiosError(error)) {
          showError(`${t("error")}`, error.message);
        } else if (error instanceof Error) {
          showError(`${t("error")}`, `${t("errorOccurred")}`);
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
          showError(`${t("error")}`, error.message);
        } else if (error instanceof Error) {
          showError(`${t("error")}`, `${t("errorOccurred")}`);
          console.error("General error:", error.message);
        }
      }
    };

    fetchDungeons();
  }, [tag, subArea]);

  useEffect(() => {
    if (updateTarget.date) {
      setDate(formatDateToLocalInput(new Date(updateTarget.date)));
    }
  }, [updateTarget.date]);

  return (
    <div className="update_event">
      <h3 className="update_event_title">Modification d'évènement</h3>
      <form onSubmit={handleSubmit} className="update_event_form" role="form">
        <label htmlFor="title" className="update_event_form_label title">
          <span>{t("title")}:</span>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            required
            placeholder={t("title")}
            className="update_event_form_label_input"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <SelectOptions
          name="tag"
          value={tag}
          items={tags}
          generateOptions={generateOptions.tags}
          label={t("tag")}
          onChange={setTag}
        />

        <SelectOptions
          name="server"
          value={server}
          items={servers}
          generateOptions={generateOptions.servers}
          label={t("server")}
          onChange={setServer}
        />

        <label htmlFor="date" className="update_event_form_label date">
          <span>{t("date")}:</span>
          <input
            type="datetime-local"
            name="date"
            id="date"
            value={date}
            min={formatDateToLocalInput(new Date())}
            required
            className="update_event_form_label_input"
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label htmlFor="duration" className="update_event_form_label duration">
          <span>{t("duration")}:</span>
          <input
            type="number"
            name="duration"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
            placeholder={t("durationInMinutes")}
            className="update_event_form_label_input"
          />
        </label>

        <SelectOptions
          name="area"
          value={area}
          items={areas}
          generateOptions={generateOptions.areas}
          label={t("area")}
          onChange={setArea}
        />

        {area ? (
          <SelectOptions
            name="sub_area"
            value={subArea}
            items={subAreas}
            generateOptions={generateOptions.subAreas}
            label={t("subArea")}
            onChange={setSubArea}
          />
        ) : null}

        {isDungeon ? (
          <SelectOptions
            name="donjon_name"
            value={dungeon}
            items={dungeons}
            generateOptions={generateOptions.dungeons}
            label={t("dungeon")}
            onChange={setDungeon}
          />
        ) : null}

        <label
          htmlFor="max_players"
          className="update_event_form_label max_players"
        >
          <span>{t("maxPlayers")}:</span>
          <input
            type="number"
            name="max_players"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(Number(e.target.value))}
            id="max_players"
            placeholder={t("maxPlayers")}
            className="update_event_form_label_input"
          />
        </label>

        <label
          htmlFor="description"
          className="update_event_form_label description"
        >
          <span>{t("description")}:</span>
          <textarea
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder={t("description")}
            className="update_event_form_label_input"
          />
        </label>

        <SelectOptions
          name="status"
          value={status}
          items={statutes}
          generateOptions={generateOptions.statutes}
          label={t("visibility")}
          onChange={setStatus}
        />

        <button type="submit" className="update_event_form_button button">
          {t("changeMyEvent")}
        </button>
      </form>
    </div>
  );
}
