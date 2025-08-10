import { Link } from "react-router-dom";

import "./Header.scss";

export default function Header() {
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
            <button type="button">Connexion</button>
          </li>
          <li>
            <button type="button">Inscription</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
