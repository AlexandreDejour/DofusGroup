import "./SelectOptions.scss";

import { BaseOptions } from "../../utils/generateOptions";

interface CharactersOptionsProps<T> {
  name: string;
  value: string[];
  items: T[];
  generateOptions: (items: T[]) => BaseOptions[];
  label: string;
  placeholder?: string;
  onChange: (value: string[]) => void;
}

export default function CharactersOptions<T>({
  name,
  value,
  items,
  generateOptions,
  label,
  placeholder,
  onChange,
}: CharactersOptionsProps<T>) {
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
        <option value="" disabled>
          {placeholder ?? `Sélectionnez ${label.toLowerCase()}`}
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
