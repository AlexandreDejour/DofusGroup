import "./Header.scss";

import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/authContext";
import { useModal } from "../../contexts/modalContext";
import { useScreen } from "../../contexts/screenContext";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { isDesktop } = useScreen();
  const { openModal } = useModal();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="header">
      {isDesktop ? (
        <div className="header_logo">
          <h1>DofusGroup</h1>
        </div>
      ) : (
        <div className="header_container">
          <div className="header_container_logo"></div>
          <h1>DofusGroup</h1>
        </div>
      )}
      <nav className="header_nav">
        <ul className="header_nav_list">
          <li className="header_nav_list_item nav_link link">
            <Link to="/">{t("events")}</Link>
          </li>
          {isDesktop && (
            <li className="header_nav_list_item nav_link link">
              <Link to="/about">{t("about")}</Link>
            </li>
          )}
          {user ? (
            <>
              <li className="header_nav_list_item nav_link link">
                <Link to="/profile">{t("profile")}</Link>
              </li>
              <li className="header_nav_list_item">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="nav_button button"
                >
                  {t("logout")}
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="header_nav_list_item">
                <button
                  type="button"
                  onClick={() => openModal("login")}
                  className="nav_button button"
                >
                  {t("login")}
                </button>
              </li>
              <li className="header_nav_list_item">
                <button
                  type="button"
                  onClick={() => openModal("register")}
                  className="nav_button button"
                >
                  {t("register")}
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
