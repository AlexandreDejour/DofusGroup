import { Link } from "react-router";

import "./Footer.scss";

export default function Footer() {
  return (
    <footer>
      <div className="footer_container">
        <h3>DofusGroup</h3>
        <ul>
          <li className="link">
            <Link to="/events">Évènements</Link>
          </li>
          <li className="link">
            <Link to="/about">À propos</Link>
          </li>
        </ul>
      </div>
      <div className="footer_container">
        <h3>Autres liens</h3>
        <ul>
          <li>
            <Link to="/gcu">Conditions générales d'utilisation</Link>
          </li>
          <li>
            <Link to="/confidentiality">Politique de confidentialité</Link>
          </li>
          <li>
            <a href="#">Nous contacter</a>
          </li>
          <li>
            <a href="#">Signaler un bug</a>
          </li>
        </ul>
      </div>
      <div className="footer_container">
        <h3>Sites utiles</h3>
        <ul>
          <li>
            <a href="https://www.dofus.com/fr">Dofus</a>
          </li>
          <li>
            <a href="https://www.dofusbook.net/fr/">DofusBook</a>
          </li>
          <li>
            <a href="https://dofusdb.fr/fr/">DofusDB</a>
          </li>
          <li>
            <a href="https://www.dofuspourlesnoobs.com/">
              Dofus pour les noobs
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
