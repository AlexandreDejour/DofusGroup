import "./Form.scss";

import { useTypedTranslation } from "../../../../i18n/i18n-helper";

interface LoginFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function LoginForm({ handleSubmit }: LoginFormProps) {
  const t = useTypedTranslation();

  return (
    <div className="content_modal">
      <h3 className="content_modal_title">{t("auth.login")}</h3>
      <form onSubmit={handleSubmit} className="content_modal_form" role="form">
        <label htmlFor="mail" className="content_modal_form_label">
          <span>{t("auth.email")}:</span>
          <input
            type="email"
            name="mail"
            id="mail"
            required
            placeholder={t("auth.email")}
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
            placeholder={t("auth.password.default")}
            className="content_modal_form_label_input"
          />
        </label>

        <button
          type="submit"
          aria-label="Login"
          className="content_modal_form_button button"
        >
          {t("auth.login")}
        </button>
      </form>
    </div>
  );
}
