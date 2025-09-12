import "./ServerOptions.scss";

interface AlignementOptionsProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

export default function AlignmentOptions({
  name,
  value,
  onChange,
}: AlignementOptionsProps) {
  const options = [
    { value: "Bonta", label: "Bonta" },
    { value: "Brâkmar", label: "Brâkmar" },
    { value: "Neutre", label: "Neutre" },
  ];

  return (
    <label htmlFor="alignment" className="content_modal_form_label">
      <span>Alignement:</span>
      <select
        name={name}
        id="alignment"
        value={value}
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
