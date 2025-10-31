import "./Footer.scss";

import i18n from "../../i18n/i18n";
import { Link } from "react-router";
import { useTypedTranslation } from "../../i18n/i18n-helper";
import ReactCountryFlag from "react-country-flag";

import { useAuth } from "../../contexts/authContext";

export default function Footer() {
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const t = useTypedTranslation();

  const { user } = useAuth();

  return (
    <footer className="footer">
      <div className="footer_container">
        <div className="footer_container_list">
          <h3>DofusGroup</h3>
          <ul>
            {user ? (
              <li>
                <Link to="/profile">{t("common.profile")}</Link>
              </li>
            ) : null}
            <li>
              <Link to="/about">{t("common.about")}</Link>
            </li>
            <li>
              <Link to="/">{t("event.list")}</Link>
            </li>
          </ul>
        </div>
        <div className="footer_container_list">
          <h3>{t("common.otherLinks")}</h3>
          <ul>
            <li>
              <a href="#">{t("settings.reportBug")}</a>
            </li>
            <li>
              <a href="#">{t("settings.contact")}</a>
            </li>
            <li>
              <Link to="/privacy_policy">{t("settings.privacyPolicy")}</Link>
            </li>
            <li>
              <Link to="/gcu">{t("settings.gcu")}</Link>
            </li>
          </ul>
        </div>
        <div className="footer_container_list">
          <h3>{t("common.usefulSites")}</h3>
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
          className="footer_language_button"
          aria-label={t("settings.language.change", {
            language: t("settings.language.french"),
          })}
          onClick={() => changeLanguage("fr")}
        >
          <ReactCountryFlag
            countryCode="FR"
            alt={t("common.flag.french")}
            svg
            style={{ width: "50%", height: "100%" }}
          />
        </button>
        <button
          className="footer_language_button"
          aria-label={t("settings.language.change", {
            language: t("settings.language.english"),
          })}
          onClick={() => changeLanguage("en")}
        >
          <ReactCountryFlag
            countryCode="GB"
            alt={t("common.flag.english")}
            svg
            style={{ width: "50%", height: "100%" }}
          />
        </button>
      </div>

      <p>
        &copy; {new Date().getFullYear()} DofusGroup —{" "}
        {t("common.allRightsReserved")}
      </p>
    </footer>
  );
}
