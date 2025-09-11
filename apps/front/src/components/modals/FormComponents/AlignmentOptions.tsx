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
    <label htmlFor="server" className="content_modal_form_label">
      <span>Serveur:</span>
      <select
        name={name}
        id="server"
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
