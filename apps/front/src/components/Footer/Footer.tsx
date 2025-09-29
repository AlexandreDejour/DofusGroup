import "./Footer.scss";

import { Link } from "react-router";
import ReactCountryFlag from "react-country-flag";

import { useAuth } from "../../contexts/authContext";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer_container">
        <div className="footer_container_list">
          <h3>DofusGroup</h3>
          <ul>
            {user ? (
              <li>
                <Link to="/profile">{t("profile")}</Link>
              </li>
            ) : null}
            <li>
              <Link to="/about">{t("about")}</Link>
            </li>
            <li>
              <Link to="/">{t("events")}</Link>
            </li>
          </ul>
        </div>
        <div className="footer_container_list">
          <h3>{t("otherLinks")}</h3>
          <ul>
            <li>
              <a href="#">{t("reportBug")}</a>
            </li>
            <li>
              <a href="#">{t("contactUs")}</a>
            </li>
            <li>
              <Link to="/privacy_policy">{t("privacyPolicy")}</Link>
            </li>
            <li>
              <Link to="/gcu">{t("gcu")}</Link>
            </li>
          </ul>
        </div>
        <div className="footer_container_list">
          <h3>Sites utiles</h3>
          <ul>
            <li>
              <a
                href="https://www.dofus.com/fr"
                target="_blank"
                rel="noreferrer"
              >
                Dofus
              </a>
            </li>
            <li>
              <a href="https://dofusdb.fr/fr/" target="_blank" rel="noreferrer">
                DofusDB
              </a>
            </li>
            <li>
              <a
                href="https://www.dofusbook.net/fr/"
                target="_blank"
                rel="noreferrer"
              >
                DofusBook
              </a>
            </li>
            <li>
              <a
                href="https://www.dofuspourlesnoobs.com/"
                target="_blank"
                rel="noreferrer"
              >
                Dofus pour les noobs
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer_language">
        <button
          aria-label={t("changeLanguage", { language: t("french") })}
          onClick={() => changeLanguage("fr")}
        >
          <ReactCountryFlag
            countryCode="FR"
            svg
            style={{ width: "24px", height: "24px" }}
          />
        </button>
        <button
          aria-label={t("changeLanguage", { language: t("english") })}
          onClick={() => changeLanguage("en")}
        >
          <ReactCountryFlag
            countryCode="GB"
            svg
            style={{ width: "24px", height: "24px" }}
          />
        </button>
      </div>

      <p>
        &copy; {new Date().getFullYear()} DofusGroup — {t("allRightsReserved")}.
      </p>
    </footer>
  );
}
