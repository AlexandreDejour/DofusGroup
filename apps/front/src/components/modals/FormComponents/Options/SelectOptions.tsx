import "./SelectOptions.scss";

import { BaseOptions } from "../../utils/generateOptions";

interface SelectOptionsProps<T> {
  name: string;
  value: string;
  items: T[];
  generateOptions: (items: T[]) => BaseOptions[];
  label: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function SelectOptions<T>({
  name,
  value,
  items,
  generateOptions,
  label,
  placeholder,
  onChange,
}: SelectOptionsProps<T>) {
  const options = generateOptions(items);

  return (
    <label htmlFor={name} className="content_modal_form_label">
      <span>{label}:</span>
      <select
        id={name}
        name={`${name}_id`}
        value={value}
        required
        onChange={(e) => onChange(e.target.value)}
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
