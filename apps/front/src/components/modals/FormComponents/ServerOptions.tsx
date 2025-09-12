import "./ServerOptions.scss";

import { Server } from "../../../types/server";

import { generateOptions } from "../utils/generateOptions";

interface ServerOptionsProps {
  name: string;
  value: string;
  servers: Server[];
  onChange: (value: string) => void;
}

export default function ServerOptions({
  name,
  value,
  servers,
  onChange,
}: ServerOptionsProps) {
  const options = generateOptions.servers(servers);

  return (
    <label htmlFor="server" className="content_modal_form_label">
      <span>Serveur:</span>
      <select
        id={name}
        name={`${name}_id`}
        value={value}
        required
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="" disabled>
          Sélectionnez un serveur
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
