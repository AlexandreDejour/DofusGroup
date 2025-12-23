import "./EventFilter.scss";

import { useTypedTranslation } from "../../i18n/i18n-helper";

import { Tag } from "../../types/tag";
import { Server } from "../../types/server";

import { useAuth } from "../../contexts/authContext";
import { useModal } from "../../contexts/modalContext";
import { useScreen } from "../../contexts/screenContext";

import { generateOptions } from "../modals/utils/generateOptions";

import SelectOptions from "../modals/formComponents/Options/SelectOptions";
import useUserCharactersChecker from "../../hooks/useUserCharactersChecker";

interface EventFilterProps {
  tags: Tag[];
  servers: Server[];
  tag: string;
  title: string;
  server: string;
  setTag: React.Dispatch<React.SetStateAction<string>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setServer: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export default function EventFilter({
  tags,
  servers,
  tag,
  title,
  server,
  setTag,
  setTitle,
  setServer,
  handleSearch,
}: EventFilterProps) {
  const t = useTypedTranslation();

  const { user } = useAuth();
  const { openModal } = useModal();
  const { isDesktop } = useScreen();

  const checkUserCharacters = useUserCharactersChecker(user);

  return (
    <form onSubmit={handleSearch} className="filter" role="form">
      {isDesktop ? (
        <>
          <div className="filter_item">
            <label htmlFor="title" className="filter_item_label">
              <span>{t("common.title")}: </span>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("common.title")}
              />
            </label>
          </div>

          <div className="filter_item">
            <SelectOptions
              name="tag"
              value={tag}
              items={tags}
              generateOptions={generateOptions.tags}
              label={t("tag.upperCase")}
              onChange={setTag}
            />
          </div>

          <div className="filter_item">
            <SelectOptions
              name="server"
              value={server}
              items={servers}
              generateOptions={generateOptions.servers}
              label={t("server.upperCase")}
              onChange={setServer}
            />
          </div>
        </>
      ) : (
        <div className="filter_items">
          <div className="filter_items_item">
            <label htmlFor="title" className="filter_items_item_label title">
              <span>{t("common.title")}: </span>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("common.title")}
              />
            </label>
          </div>

          <div className="filter_items_item">
            <SelectOptions
              name="tag"
              value={tag}
              items={tags}
              generateOptions={generateOptions.tags}
              label={t("tag.upperCase")}
              onChange={setTag}
            />
          </div>

          <div className="filter_items_item">
            <SelectOptions
              name="server"
              value={server}
              items={servers}
              generateOptions={generateOptions.servers}
              label={t("server.upperCase")}
              onChange={setServer}
            />
          </div>
        </div>
      )}

      <div className="filter_actions">
        <button type="submit" className="filter_actions_button button">
          {t("common.search")}
        </button>

        <button
          type="button"
          className="filter_actions_button button"
          onClick={async () => {
            const hasCharacters = await checkUserCharacters();
            if (hasCharacters) openModal("newEvent");
          }}
          title={!user ? t("event.error.disable") : ""}
          disabled={!user}
          style={{
            background: !user
              ? "grey"
              : "radial-gradient(circle, rgba(96,186,96,1) 0%, rgba(156,217,92,1) 90%)",
          }}
        >
          {t("common.new")}
        </button>
      </div>
    </form>
  );
}
