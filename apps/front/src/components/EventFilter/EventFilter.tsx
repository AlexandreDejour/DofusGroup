import "./EventFilter.scss";

import { Tag } from "../../types/tag";
import { Server } from "../../types/server";

import { useScreen } from "../../contexts/screenContext";

import { generateOptions } from "../modals/utils/generateOptions";

import SelectOptions from "../modals/formComponents/Options/SelectOptions";

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

  return (
    <form onSubmit={handleSearch} className="filter" role="form">
      {isDesktop ? (
        <>
          <div className="filter_item">
            <label htmlFor="title" className="filter_item_label">
              <span>Titre: </span>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre"
              />
            </label>
          </div>

          <div className="filter_item">
            <SelectOptions
              name="tag"
              value={tag}
              items={tags}
              generateOptions={generateOptions.tags}
              label="Tag"
              onChange={setTag}
            />
          </div>

          <div className="filter_item">
            <SelectOptions
              name="server"
              value={server}
              items={servers}
              generateOptions={generateOptions.servers}
              label="Serveur"
              onChange={setServer}
            />
          </div>
        </>
      ) : (
        <div className="filter_items">
          <div className="filter_items_item">
            <label htmlFor="title" className="filter_items_item_label">
              <span>Titre: </span>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre"
              />
            </label>
          </div>

          <div className="filter_items_item">
            <SelectOptions
              name="tag"
              value={tag}
              items={tags}
              generateOptions={generateOptions.tags}
              label="Tag"
              onChange={setTag}
            />
          </div>

          <div className="filter_items_item">
            <SelectOptions
              name="server"
              value={server}
              items={servers}
              generateOptions={generateOptions.servers}
              label="Serveur"
              onChange={setServer}
            />
          </div>
        </div>
      )}

      <button type="submit" className="button">
        Rechercher
      </button>
    </form>
  );
}
