import "./Form.scss";

import { useTranslation } from "react-i18next";

interface LoginFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function LoginForm({ handleSubmit }: LoginFormProps) {
  const { t } = useTranslation("translation");

  return (
    <div className="content_modal">
      <h3 className="content_modal_title">{t("login")}</h3>
      <form onSubmit={handleSubmit} className="content_modal_form" role="form">
        <label htmlFor="username" className="content_modal_form_label">
          <span>{t("username")}:</span>
          <input
            type="text"
            name="username"
            id="username"
            required
            placeholder={t("username")}
            className="content_modal_form_label_input"
          />
        </label>

        <label htmlFor="password" className="content_modal_form_label">
          <span>{t("password")}:</span>
          <input
            type="password"
            name="password"
            id="password"
            required
            placeholder={t("password")}
            className="content_modal_form_label_input"
          />
        </label>

        <button
          type="submit"
          aria-label="Login"
          className="content_modal_form_button button"
        >
          {t("toConnect")}
        </button>
      </form>
    </div>
  );
}
