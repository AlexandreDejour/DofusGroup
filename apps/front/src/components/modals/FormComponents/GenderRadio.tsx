import "./GenderRadio.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMars, faVenus } from "@fortawesome/free-solid-svg-icons";

interface GenderRadioProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

export default function GenderRadio({
  name,
  value,
  onChange,
}: GenderRadioProps) {
  const options = [
    {
      value: "M",
      label: "Mâle",
      icon: <FontAwesomeIcon icon={faMars} style={{ fontSize: "2rem" }} />,
    },
    {
      value: "F",
      label: "Femelle",
      icon: <FontAwesomeIcon icon={faVenus} style={{ fontSize: "2rem" }} />,
    },
  ];

  return (
    <fieldset className="gender">
      <legend className="gender_legend">Sexe:</legend>
      <div className="gender_choices">
        {options.map((opt) => (
          <label
            key={opt.value}
            htmlFor={opt.value}
            className="gender_choices_label"
          >
            {opt.icon}
            <input
              type="radio"
              id={opt.value}
              name={name}
              value={opt.value}
              required
              className="gender_choices_label_input"
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            <span className="sr-only">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
