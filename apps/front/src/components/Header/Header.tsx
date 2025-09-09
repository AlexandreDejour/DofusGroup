import "./Header.scss";

import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/authContext";
import { useModal } from "../../contexts/modalContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { openModal } = useModal();

  return (
    <header className="header">
      <div className="header_logo">
        <h1>DofusGroup</h1>
      </div>
      <nav className="header_nav">
        <ul className="header_nav_list">
          <li className="header_nav_list_item nav_link link">
            <Link to="/">Évènements</Link>
          </li>
          {user ? (
            <>
              <li className="header_nav_list_item nav_link link">
                <Link to="/characters">Personnages</Link>
              </li>
              <li className="header_nav_list_item nav_link link">
                <Link to="/profile">Profil</Link>
              </li>
              <li className="header_nav_list_item">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="nav_button button"
                >
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="header_nav_list_item nav_link link">
                <Link to="/about">À propos</Link>
              </li>
              <li className="header_nav_list_item">
                <button
                  type="button"
                  onClick={() => openModal("login")}
                  className="nav_button button"
                >
                  Connexion
                </button>
              </li>
              <li className="header_nav_list_item">
                <button
                  type="button"
                  onClick={() => openModal("register")}
                  className="nav_button button"
                >
                  Inscription
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
