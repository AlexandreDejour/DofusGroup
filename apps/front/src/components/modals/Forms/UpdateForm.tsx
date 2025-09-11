import "../Form.scss";

interface UpdateFormProps {
  field: string;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function UpdateForm({ field, handleSubmit }: UpdateFormProps) {
  const FIELD_MAP: Record<string, { label: string; type: string }> = {
    mail: { label: "email", type: "email" },
    password: { label: "mot de passe", type: "password" },
    username: { label: "pseudo", type: "text" },
  };

  const { label, type } = FIELD_MAP[field] || { label: "", type: "text" };

  return (
    <div className="content_modal">
      <h3 className="content_modal_title">Modifier {label}</h3>
      <form onSubmit={handleSubmit} className="content_modal_form">
        <label htmlFor={field} className="content_modal_form_label">
          <span>{label.charAt(0).toUpperCase() + label.slice(1)}</span>
          <input
            type={type}
            name={field}
            id={field}
            required
            placeholder={label.charAt(0).toUpperCase() + label.slice(1)}
            className="content_modal_form_label_input"
          />
        </label>

        <button
          type="submit"
          aria-label="Update"
          className="content_modal_form_button button"
        >
          Modifier
        </button>
      </form>
    </div>
  );
}
