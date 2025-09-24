import "./About.scss";

export default function About() {
  return (
    <main className="about">
      <header>
        <h2>À propos de DofusGroup</h2>
        <p className="lead">
          DofusGroup est une plateforme communautaire de création d'événements
          autour d'activités dans le MMORPG <strong>Dofus</strong>, permettant
          aux joueurs de s'organiser facilement en groupe.
        </p>
      </header>

      <section>
        <h3>1. Une plateforme pour mieux s’organiser</h3>
        <p>
          L'application permet aux utilisateurs, une fois leur compte créé, de
          créer des événements afin de trouver des joueurs souhaitant se joindre
          à eux. Chaque utilisateur peut ajouter dans son profil plusieurs
          personnages (représentant ses avatars en jeu) et les inscrire aux
          événements disponibles sur la plateforme. Un système de commentaires
          rattaché à chaque événement permet d'échanger entre participants.
        </p>
      </section>

      <section>
        <h3>2. Pourquoi DofusGroup ?</h3>
        <p>
          Il n'existe actuellement pas d'outil performant répondant à ce besoin
          précis : planifier des sessions de jeu à l'avance et organiser des
          groupes de manière claire. DofusGroup n'a pas pour vocation de trouver
          un groupe instantanément, mais plutôt d'offrir un moyen de prévoir une
          activité à une date et une heure données, de s'inscrire à l'avance et
          de constituer un groupe stable avant la session de jeu.
        </p>
      </section>

      <section>
        <h3>3. Public visé</h3>
        <p>La plateforme s'adresse principalement aux :</p>
        <ul>
          <li>Joueurs monocomptes dépendants d'autres joueurs pour avancer.</li>
          <li>
            Guildes souhaitant planifier des sessions entre leurs membres.
          </li>
        </ul>
        <p>
          Les événements peuvent être rendus privés : ils sont alors accessibles
          uniquement via l'URL de l'événement. Le principal bénéfice pour
          l'utilisateur est une meilleure organisation et une optimisation des
          sessions de jeu, sans recourir au canal de recrutement du jeu, souvent
          peu lisible.
        </p>
      </section>

      <section>
        <h3>4. Qui suis-je ?</h3>
        <p>
          Je suis <strong>développeur en reconversion</strong> et j'ai commencé
          le developpement de DofusGroup en parallèle de ma formation. Mon
          expérience est orientée web. Une grande partie de mon apprentissage
          est autodidacte, ce qui me permet d'être curieux techniquement et
          d'apprendre rapidement de nouveaux outils.
        </p>
        <p>
          J'ai choisi Dofus comme point de départ car je suis passionné par cet
          univers depuis près de 20 ans. Le projet s'inscrit dans la tradition
          des fan-sites et outils communautaires développés par les joueurs au
          fil des années.
        </p>
        <p>
          Ce que j'apprécie le plus dans le développement : transformer un
          besoin concret en solution technique, travailler sur l'ergonomie et le
          design, et voir un projet prendre forme au fil du temps.
        </p>
      </section>

      <section>
        <h3>5. En résumé</h3>
        <p>
          DofusGroup est né d'un mélange de passion, d'apprentissage et d'envie
          de partage. C'est un projet pensé pour les joueurs, mais qui met
          également en valeur ma démarche en tant que développeur : créer des
          outils concrets, utiles et accessibles pour améliorer l'expérience
          utilisateur.
        </p>
      </section>
    </main>
  );
}
