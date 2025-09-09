import "./Profile.scss";

import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

import { useAuth } from "../../contexts/authContext";
import { useNotification } from "../../contexts/notificationContext";

import { UserEnriched } from "../../types/user";
import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { UserService } from "../../services/api/userService";
import EventCard from "../../components/EventCard/EventCard";
import CharacterCard from "../../components/CharacterCard/CharacterCard";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const userService = new UserService(axios);

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError } = useNotification();
  const [userEnriched, setUserEnriched] = useState<UserEnriched | null>(null);

  useEffect(() => {
    const fetchUserExtended = async () => {
      if (!user) {
        navigate("/", { replace: true });
        return;
      }

      try {
        const response = await userService.getOneEnriched(user.id);

        setUserEnriched(response);
      } catch (error) {
        if (isAxiosError(error)) {
          showError("Erreur", error.message);
        } else if (error instanceof Error) {
          showError("Erreur", "Une erreur est survenue");
          console.error("General error:", error.message);
        }
      }
    };

    fetchUserExtended();
  }, []);

  return (
    <>
      {userEnriched ? (
        <main className="profile">
          <section className="profile_section">
            <h2 className="profile_section_title">Profil</h2>

            <div className="profile_section_details">
              <p className="profile_section_details_info">
                Pseudo: {userEnriched.username}
              </p>
              <p className="profile_section_details_info">
                Évènements: {userEnriched.events?.length}
              </p>
              <p className="profile_section_details_info">
                Personnages: {userEnriched.characters?.length}
              </p>
            </div>

            <div className="profile_section_actions">
              <button
                type="button"
                className="profile_section_actions_button button"
              >
                Modifier le pseudo
              </button>
              <button
                type="button"
                className="profile_section_actions_button button"
              >
                Modifier le mot de passe
              </button>
              <button
                type="button"
                className="profile_section_actions_button button"
              >
                Modifier l'email
              </button>
              <button
                type="button"
                className="profile_section_actions_button button delete"
              >
                Supprimer mon compte
              </button>
              <button
                type="button"
                className="profile_section_actions_button button"
              >
                Créer un évènement
              </button>
              <button
                type="button"
                className="profile_section_actions_button button"
              >
                Créer un personnage
              </button>
            </div>
          </section>

          <section className="profile_section">
            <h2 className="profile_section_title">Évènements</h2>
            {userEnriched.events && userEnriched.events.length ? (
              <ul className="profile_section_list_event">
                {userEnriched.events.map((event) => (
                  <li key={event.id}>
                    <EventCard event={event} />
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          <section className="profile_section">
            <h2 className="profile_section_title">Personnages</h2>
            {userEnriched.characters && userEnriched.characters.length ? (
              <ul className="profile_section_list_character">
                {userEnriched.characters.map((character) => (
                  <li
                    key={character.id}
                    className="profile_section_list_character_item"
                  >
                    <CharacterCard character={character} />
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        </main>
      ) : null}
    </>
  );
}
