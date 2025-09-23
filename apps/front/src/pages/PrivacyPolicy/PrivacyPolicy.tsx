import "./PrivacyPolicy.scss";

export default function PrivacyPolicy() {
  const CONTACT_EMAIL = "";

  return (
    <main className="privacy">
      <header>
        <h2>Politique de Confidentialité</h2>
        <p>
          Dernière mise à jour :{" "}
          <strong>{new Date().toLocaleDateString()}</strong>
        </p>
      </header>

      <section>
        <h3>1. Introduction</h3>
        <p>
          La présente politique de confidentialité explique comment fonctionne
          le site communautaire <strong>DofusGroup</strong> destiné aux joueurs
          du jeu <strong>Dofus</strong> (ci-après « nous », « notre » ou « le
          site »). Nous nous engageons à traiter vos données personnelles avec
          confidentialité et conformément au Règlement Général sur la Protection
          des Données (RGPD) et à la législation française applicable.
        </p>
      </section>

      <section>
        <h3>2. Données collectées</h3>
        <p>
          Lors de la création d’un compte, nous recueillons uniquement les
          informations suivantes :
        </p>
        <ul>
          <li>pseudo ;</li>
          <li>adresse e-mail ;</li>
          <li>mot de passe (stocké sous forme hachée, jamais en clair).</li>
        </ul>
        <p>
          Aucune autre donnée personnelle n’est collectée automatiquement par le
          site.
        </p>
      </section>

      <section>
        <h3>3. Finalités du traitement</h3>
        <p>Les données collectées sont utilisées uniquement pour :</p>
        <ul>
          <li>
            permettre l’inscription et l’authentification des utilisateurs ;
          </li>
          <li>
            identifier l’utilisateur dans l’espace communautaire et lors de la
            création d’événements ;
          </li>
          <li>
            sécuriser l’accès au compte et prévenir les usages frauduleux ;
          </li>
          <li>
            permettre à l’utilisateur de gérer son compte (mise à jour,
            suppression).
          </li>
        </ul>
        <p>
          Nous n’utilisons pas vos données à des fins publicitaires ou de
          profilage.
        </p>
      </section>

      <section>
        <h3>4. Cookies</h3>
        <p>
          Le site utilise uniquement des <strong>cookies techniques</strong>{" "}
          nécessaires au fonctionnement : notamment pour stocker le JSON Web
          Token (JWT) permettant de maintenir la session et d'authentifier
          l’utilisateur. Nous n’utilisons pas de cookies publicitaires ou de
          suivi tiers.
        </p>
      </section>

      <section>
        <h3>5. Partage des données</h3>
        <p>
          Nous ne vendons ni n’échangeons vos informations personnelles. Les
          données peuvent être accessibles uniquement aux personnes autorisées
          (équipe technique / administrateurs) dans le cadre de la maintenance
          et du support.
        </p>
        <p>
          Seules des API publiques nécessaires au fonctionnement du site (ex.
          chargement de polices) peuvent être appelées depuis le front ; ces
          appels n’entraînent pas le partage de données personnelles par défaut.
        </p>
      </section>

      <section>
        <h3>6. Sécurité</h3>
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles
          pour protéger vos données :
        </p>
        <ul>
          <li>hachage sécurisé des mots de passe ;</li>
          <li>chiffrement des adresses e-mail ;</li>
          <li>accès restreint aux serveurs en production ;</li>
          <li>utilisation de connexions sécurisées (HTTPS/TLS).</li>
        </ul>
        <p>
          En production, seuls les services nécessaires auront accès au serveur.
          En cas d'incident grave impliquant des données personnelles, nous
          prendrons les mesures appropriées et informerons les personnes
          concernées conformément à la réglementation.
        </p>
      </section>

      <section>
        <h3>7. Conservation et suppression des données</h3>
        <p>
          Vos données sont conservées tant que votre compte est actif. Si vous
          supprimez votre compte depuis votre page de profil, toutes vos données
          personnelles sont supprimées définitivement et ne sont pas conservées.
        </p>
      </section>

      <section>
        <h3>8. Droits des utilisateurs</h3>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li>
            droit d'accès : obtenir une copie des données personnelles que nous
            détenons ;
          </li>
          <li>
            droit de rectification : corriger ou mettre à jour vos informations
            ;
          </li>
          <li>
            droit à l'effacement : supprimer votre compte et vos données ;
          </li>
          <li>
            droit à la portabilité : demander l'export de vos données dans un
            format réutilisable ;
          </li>
          <li>
            droit d'opposition et retrait du consentement lorsque le traitement
            est fondé sur ce dernier.
          </li>
        </ul>
        <p>
          Vous pouvez exercer ces droits directement depuis votre profil. Vous
          pouvez également nous contacter par e-mail à :{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      <section>
        <h3>9. Modalités de contact</h3>
        <p>
          Pour toute question relative à la présente politique ou pour exercer
          vos droits, merci d’écrire à :{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      <section>
        <h3>10. Modifications de la politique</h3>
        <p>
          Nous nous réservons le droit d’actualiser cette politique de
          confidentialité. En cas de modification substantielle, nous
          indiquerons la date de mise à jour en haut de cette page et, si
          nécessaire, nous informerons les utilisateurs connectés.
        </p>
      </section>
    </main>
  );
}
