import "./Form.scss";

import { useTypedTranslation } from "../../../../i18n/i18n-helper";

interface RegisterFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function RegisterForm({ handleSubmit }: RegisterFormProps) {
  const t = useTypedTranslation();

  return (
    <div className="content_modal">
      <h3 className="content_modal_title">{t("auth.register")}</h3>
      <form onSubmit={handleSubmit} className="content_modal_form" role="form">
        <label htmlFor="username" className="content_modal_form_label">
          <span>{t("auth.username")}:</span>
          <input
            type="text"
            name="username"
            id="username"
            required
            placeholder={t("auth.username")}
            className="content_modal_form_label_input"
          />
        </label>

        <label htmlFor="mail" className="content_modal_form_label">
          <span>{t("auth.email.default")}:</span>
          <input
            type="email"
            name="mail"
            id="mail"
            required
            placeholder={t("auth.email.default")}
            className="content_modal_form_label_input"
          />
        </label>

        <label htmlFor="password" className="content_modal_form_label">
          <span>{t("auth.password.default")}:</span>
          <input
            type="password"
            name="password"
            id="password"
            required
            title={t("auth.password.error.rules")}
            placeholder={t("auth.password.default")}
            className="content_modal_form_label_input"
          />
        </label>

        <label htmlFor="confirmPassword" className="content_modal_form_label">
          <span>{t("auth.password.confirm")}:</span>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            required
            placeholder={t("auth.password.confirm")}
            className="content_modal_form_label_input"
          />
        </label>

        <button
          type="submit"
          aia-label="Register"
          className="content_modal_form_button button"
        >
          {t("auth.register")}
        </button>
      </form>
    </div>
  );
}
