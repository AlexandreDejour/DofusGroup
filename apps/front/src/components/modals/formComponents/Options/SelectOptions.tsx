import { useTypedTranslation } from "../../../../i18n/i18n-helper";

import { BaseOptions } from "../../utils/generateOptions";

export interface SelectOptionsProps<T, ID extends string | number> {
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
  const t = useTypedTranslation();

  const options = generateOptions(items);
  const stringValues = [
    "alignment",
    "donjon_name",
    "area",
    "sub_area",
    "status",
  ];

  return (
    <label htmlFor={name} className={`content_modal_form_label ${name}`}>
      <span>{label}:</span>
      <select
        id={name}
        name={stringValues.includes(name) ? name : `${name}_id`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">
          {placeholder ?? `${t("common.select")} ${label.toLowerCase()}`}
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
