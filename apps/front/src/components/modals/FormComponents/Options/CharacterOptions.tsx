import "./SelectOptions.scss";

import { BaseOptions } from "../../utils/generateOptions";

interface CharactersOptionsProps<T, ID extends string | number> {
  name: string;
  value: string[];
  items: T[];
  generateOptions: (items: T[]) => BaseOptions<ID>[];
  label: string;
  onChange: (value: string[]) => void;
}

export default function CharactersOptions<T, ID extends string | number>({
  name,
  value,
  items,
  generateOptions,
  label,
  onChange,
}: CharactersOptionsProps<T, ID>) {
  const options = generateOptions(items);

  return (
    <label htmlFor={name} className="content_modal_form_label">
      <span>{label}:</span>
      <select
        id={name}
        name={`${name}_id`}
        value={value}
        required
        multiple
        onChange={(e) => {
          const selectedOptions = Array.from(e.target.selectedOptions).map(
            (o) => o.value,
          );
          onChange(selectedOptions);
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
