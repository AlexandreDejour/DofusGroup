import "./Form.scss";

import { t } from "../../../../i18n/i18n-helper";

interface UpdateFormProps {
  field: string;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function UpdateForm({ field, handleSubmit }: UpdateFormProps) {
  const FIELD_MAP: Record<string, { label: string; type: string }> = {
    mail: { label: t("auth.email.default"), type: "email" },
    password: { label: t("auth.password.default"), type: "password" },
    username: { label: t("auth.username"), type: "text" },
  };

  const { label, type } = FIELD_MAP[field] || { label: "", type: "text" };

  return (
    <div className="content_modal">
      <h3 className="content_modal_title">
        {t("common.change")} {label}
      </h3>
      <form onSubmit={handleSubmit} className="content_modal_form" role="form">
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

        {field === "password" && (
          <label
            htmlFor={`confirm${field.charAt(0).toUpperCase() + field.slice(1)}`}
            className="content_modal_form_label"
          >
            <span>
              {t("common.confirm")} {label}
            </span>
            <input
              type={type}
              name={`confirm${field.charAt(0).toUpperCase() + field.slice(1)}`}
              id={`confirm${field.charAt(0).toUpperCase() + field.slice(1)}`}
              required
              placeholder={`${t("common.confirm")} ${label}`}
              className="content_modal_form_label_input"
            />
          </label>
        )}

        <button
          type="submit"
          aria-label="Update"
          className="content_modal_form_button button"
        >
          {t("common.change")}
        </button>
      </form>
    </div>
  );
}
