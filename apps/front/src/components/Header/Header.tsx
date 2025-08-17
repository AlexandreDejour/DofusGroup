import "./Header.scss";

import { Link } from "react-router-dom";

import { useModal } from "../../contexts/modalContext";

export default function Header() {
  const { openModal } = useModal();

  return (
    <header>
      <div className="logo">
        <h1>DofusGroup</h1>
      </div>
      <nav>
        <ul>
          <li className="nav_link link">
            <Link to="/events">Évènements</Link>
          </li>
          <li className="nav_link link">
            <Link to="/about">À propos</Link>
          </li>
          <li>
            <button
              type="button"
              onClick={() => openModal("login")}
              className="button"
            >
              Connexion
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => openModal("register")}
              className="button"
            >
              Inscription
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
