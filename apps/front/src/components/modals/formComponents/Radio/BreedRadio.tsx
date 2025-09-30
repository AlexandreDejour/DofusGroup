import "./BreedRadio.scss";

import { Breed } from "../../../../types/breed";

import { t } from "../../../../i18n/i18n-helper";
import { generateOptions } from "../../utils/generateOptions";

export interface BreedRadioProps {
  name: string;
  value: string;
  sex: string;
  breeds: Breed[];
  onChange: (value: string) => void;
}

export default function BreedRadio({
  name,
  value,
  sex,
  breeds,
  onChange,
}: BreedRadioProps) {
  const options = generateOptions.breeds(breeds, sex);

  return (
    <fieldset className="breed">
      <legend className="breed_legend">{t("breed.upperCase")}:</legend>
      <div className="breed_choices">
        {options.map((opt) => (
          <label
            key={opt.value}
            htmlFor={opt.value}
            className="breed_choices_label"
          >
            <input
              type="radio"
              id={opt.value}
              name={`${name}_id`}
              value={opt.value}
              required
              className="sr-only"
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            <img src={opt.imgSrc} alt={`Miniature de ${opt.label}`} />
            <span className="sr-only">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
