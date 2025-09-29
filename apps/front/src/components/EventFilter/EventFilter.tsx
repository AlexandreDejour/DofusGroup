import "./EventFilter.scss";

import { Tag } from "../../types/tag";
import { Server } from "../../types/server";

import { useScreen } from "../../contexts/screenContext";

import { generateOptions } from "../modals/utils/generateOptions";

import SelectOptions from "../modals/formComponents/Options/SelectOptions";
import { useTranslation } from "react-i18next";

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
  const { isDesktop } = useScreen();
  const { t } = useTranslation("translation");

  return (
    <form onSubmit={handleSearch} className="filter" role="form">
      {isDesktop ? (
        <>
          <div className="filter_item">
            <label htmlFor="title" className="filter_item_label">
              <span>{t("title")}: </span>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("title")}
              />
            </label>
          </div>

          <div className="filter_item">
            <SelectOptions
              name="tag"
              value={tag}
              items={tags}
              generateOptions={generateOptions.tags}
              label={t("tag")}
              onChange={setTag}
            />
          </div>

          <div className="filter_item">
            <SelectOptions
              name="server"
              value={server}
              items={servers}
              generateOptions={generateOptions.servers}
              label={t("server")}
              onChange={setServer}
            />
          </div>
        </>
      ) : (
        <div className="filter_items">
          <div className="filter_items_item">
            <label htmlFor="title" className="filter_items_item_label title">
              <span>{t("title")}: </span>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("title")}
              />
            </label>
          </div>

          <div className="filter_items_item">
            <SelectOptions
              name="tag"
              value={tag}
              items={tags}
              generateOptions={generateOptions.tags}
              label={t("tag")}
              onChange={setTag}
            />
          </div>

          <div className="filter_items_item">
            <SelectOptions
              name="server"
              value={server}
              items={servers}
              generateOptions={generateOptions.servers}
              label={t("server")}
              onChange={setServer}
            />
          </div>
        </div>
      )}

      <button type="submit" className="button">
        {t("search")}
      </button>
    </form>
  );
}
