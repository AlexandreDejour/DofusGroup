import "./NotFound.scss";

import { useNavigate } from "react-router";

import { useTypedTranslation } from "../../i18n/i18n-helper";

export default function NotFound() {
  const navigate = useNavigate();
  const t = useTypedTranslation();

  return (
    <main className="notFound">
      <h2>404 - NOT FOUND</h2>
      <p>{t("system.error.notFound")}</p>
      <button
        type="button"
        className="notFound_button button"
        onClick={() => navigate("/")}
      >
        {t("common.home")}
      </button>
    </main>
  );
}
