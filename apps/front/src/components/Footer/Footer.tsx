import { Link } from "react-router";

import "./Footer.scss";
import { useAuth } from "../../contexts/authContext";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="footer">
      <div className="footer_container">
        <div className="footer_container_list">
          <h3>DofusGroup</h3>
          <ul>
            {user ? (
              <li>
                <Link to="/profile">Profil</Link>
              </li>
            ) : null}
            <li>
              <Link to="/about">À propos</Link>
            </li>
            <li>
              <Link to="/">Évènements</Link>
            </li>
          </ul>
        </div>
        <div className="footer_container_list">
          <h3>Autres liens</h3>
          <ul>
            <li>
              <a href="#">Signaler un bug</a>
            </li>
            <li>
              <a href="#">Nous contacter</a>
            </li>
            <li>
              <Link to="/privacy_policy">Politique de confidentialité</Link>
            </li>
            <li>
              <Link to="/gcu">Conditions générales d'utilisation</Link>
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

      <p>
        &copy; {new Date().getFullYear()} DofusGroup — Tous droits réservés.
      </p>
    </footer>
  );
}
