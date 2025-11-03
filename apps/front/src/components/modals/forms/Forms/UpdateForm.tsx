import "./Form.scss";

import { useModal } from "../../../../contexts/modalContext";
import { useTypedTranslation } from "../../../../i18n/i18n-helper";

interface UpdateFormProps {
  field: string;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function UpdateForm({ field, handleSubmit }: UpdateFormProps) {
  const t = useTypedTranslation();
  const { modalType } = useModal();

  const FIELD_MAP: Record<string, { label: string; type: string }> = {
    mail: { label: t("auth.email.default"), type: "email" },
    password: { label: t("auth.password.default"), type: "password" },
    username: { label: t("auth.username"), type: "text" },
  };

  const { label, type } = FIELD_MAP[field] || { label: "", type: "text" };

  return (
    <div className="content_modal">
      {field === "mail" && modalType === "mailToken" ? (
        <h3 className="content_modal_title">
          {t("common.validation")} {label}
        </h3>
      ) : (
        <h3 className="content_modal_title">
          {t("common.change")} {label}
        </h3>
      )}
      <form onSubmit={handleSubmit} className="content_modal_form" role="form">
        <label htmlFor={field} className="content_modal_form_label">
          {field === "mail" && modalType === "mailToken" ? (
            <span>{label}</span>
          ) : (
            <span>
              {t("common.new")} {label}
            </span>
          )}
          <input
            type={type}
            name={field}
            id={field}
            required
            placeholder={
              field === "mail" && modalType === "mailToken"
                ? `${label}`
                : `${t("common.new")} ${label}`
            }
            className="content_modal_form_label_input"
          />
        </label>

        {field === "password" && (
          <>
            <label
              htmlFor={`confirm${
                field.charAt(0).toUpperCase() + field.slice(1)
              }`}
              className="content_modal_form_label"
            >
              <span>
                {t("common.confirm")} {label}
              </span>
              <input
                type={type}
                name={`confirm${
                  field.charAt(0).toUpperCase() + field.slice(1)
                }`}
                id={`confirm${field.charAt(0).toUpperCase() + field.slice(1)}`}
                required
                placeholder={`${t("common.confirm")} ${label}`}
                className="content_modal_form_label_input"
              />
            </label>

            <label
              htmlFor={`old${field.charAt(0).toUpperCase() + field.slice(1)}`}
              className="content_modal_form_label"
            >
              <span>
                {t("common.old")} {label}
              </span>
              <input
                type={type}
                name={`old${field.charAt(0).toUpperCase() + field.slice(1)}`}
                id={`old${field.charAt(0).toUpperCase() + field.slice(1)}`}
                required
                placeholder={`${t("common.old")} ${label}`}
                className="content_modal_form_label_input"
              />
            </label>
          </>
        )}

        {field === "mail" && modalType === "mailToken" ? (
          <button
            type="submit"
            aria-label="Update"
            className="content_modal_form_button button"
          >
            {t("common.send")}
          </button>
        ) : (
          <button
            type="submit"
            aria-label="Update"
            className="content_modal_form_button button"
          >
            {t("common.change")}
          </button>
        )}
      </form>
    </div>
  );
}
