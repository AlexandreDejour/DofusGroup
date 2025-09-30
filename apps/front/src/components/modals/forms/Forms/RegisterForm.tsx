import "./Form.scss";

import { useTranslation } from "react-i18next";

interface RegisterFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function RegisterForm({ handleSubmit }: RegisterFormProps) {
  const { t } = useTranslation("translation");

  return (
    <div className="content_modal">
      <h3 className="content_modal_title">{t("register")}</h3>
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

        <label htmlFor="mail" className="content_modal_form_label">
          <span>{t("email")}:</span>
          <input
            type="email"
            name="mail"
            id="mail"
            required
            placeholder={t("email")}
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
            title={t("minimumPasswordRules")}
            placeholder={t("password")}
            className="content_modal_form_label_input"
          />
        </label>

        <label htmlFor="confirmPassword" className="content_modal_form_label">
          <span>{t("confirmPassword")}:</span>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            required
            placeholder={t("confirmPassword")}
            className="content_modal_form_label_input"
          />
        </label>

        <button
          type="submit"
          aia-label="Register"
          className="content_modal_form_button button"
        >
          {t("register")}
        </button>
      </form>
    </div>
  );
}
