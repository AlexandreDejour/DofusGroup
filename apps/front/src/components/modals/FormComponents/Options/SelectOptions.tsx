import { BaseOptions } from "../../utils/generateOptions";

interface SelectOptionsProps<T, ID extends string | number> {
  name: string;
  value: string;
  items: T[];
  generateOptions: (items: T[]) => BaseOptions<ID>[];
  label: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function SelectOptions<T, ID extends string | number>({
  name,
  value,
  items,
  generateOptions,
  label,
  placeholder,
  onChange,
}: SelectOptionsProps<T, ID>) {
  const options = generateOptions(items);

  return (
    <label htmlFor={name} className="content_modal_form_label">
      <span>{label}:</span>
      <select
        id={name}
        name={`${name}_id`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          {placeholder ?? `Sélectionnez ${label.toLowerCase()}`}
        </option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
