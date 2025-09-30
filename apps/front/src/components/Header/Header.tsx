import "./Header.scss";

import { Link } from "react-router-dom";
import { useTypedTranslation } from "../../i18n/i18n-helper";

import { useAuth } from "../../contexts/authContext";
import { useModal } from "../../contexts/modalContext";
import { useScreen } from "../../contexts/screenContext";

export default function Header() {
  const t = useTypedTranslation();

  const { isDesktop } = useScreen();
  const { openModal } = useModal();
  const { user, logout } = useAuth();

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
            <Link to="/">{t("event.list")}</Link>
          </li>
          {isDesktop && (
            <li className="header_nav_list_item nav_link link">
              <Link to="/about">{t("common.about")}</Link>
            </li>
          )}
          {user ? (
            <>
              <li className="header_nav_list_item nav_link link">
                <Link to="/profile">{t("common.profile")}</Link>
              </li>
              <li className="header_nav_list_item">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="nav_button button"
                >
                  {t("auth.logout")}
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
                  {t("auth.login")}
                </button>
              </li>
              <li className="header_nav_list_item">
                <button
                  type="button"
                  onClick={() => openModal("register")}
                  className="nav_button button"
                >
                  {t("auth.register")}
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
