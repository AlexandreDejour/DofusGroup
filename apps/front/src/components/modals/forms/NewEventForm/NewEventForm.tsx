import "./NewEventForm.scss";

import { useState } from "react";
import { useTypedTranslation } from "../../../../i18n/i18n-helper";

import { useAuth } from "../../../../contexts/authContext";

import { generateOptions } from "../../utils/generateOptions";
import formatDateToLocalInput from "../../utils/formatDateToLocalInput";

import SelectOptions from "../../formComponents/Options/SelectOptions";
import CharactersOptions from "../../formComponents/Options/CharactersOptions";
import useFetchTags from "../../../../hooks/useFetchTags";
import useFetchServers from "../../../../hooks/useFetchServers";
import useFetchUserCharacters from "../../../../hooks/useFetchUserCharacters";
import useFetchAreas from "../../../../hooks/useFetchAreas";
import useFetchSubAreas from "../../../../hooks/useFetchSubAreas";
import useFetchDungeons from "../../../../hooks/useFetchDungeons";

interface NewEventFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function NewEventForm({ handleSubmit }: NewEventFormProps) {
  const t = useTypedTranslation();

  const { user } = useAuth();

  if (!user) return;

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

  const statutes = [
    { id: 1, label: `${t("common.private")}`, value: "private" },
    { id: 2, label: `${t("common.public")}`, value: "public" },
  ];

  const { tags } = useFetchTags();
  const { servers } = useFetchServers();
  const { characters } = useFetchUserCharacters(user.id, server);

  const { areas } = useFetchAreas();
  const { subAreas } = useFetchSubAreas(areas, area);

  const context = { tags, areas, subAreas };
  const selection = { tag, area, subArea };
  const { dungeons, isDungeon } = useFetchDungeons(context, selection);

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
