import "./Profile.scss";

import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../../contexts/authContext";
import { useNotification } from "../../contexts/notificationContext";

import { UserEnriched } from "../../types/user";
import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { UserService } from "../../services/api/userService";
import ProfileEventCard from "../../components/ProfileEventCard/ProfileEventCard";
import CharacterCard from "../../components/CharacterCard/CharacterCard";
import { EventService } from "../../services/api/eventService";
import { CharacterService } from "../../services/api/characterService";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const userService = new UserService(axios);
const eventService = new EventService(axios);
const characterService = new CharacterService(axios);

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

  const handleDelete = useCallback(
    async (targetType: string, targetId: string) => {
      if (!user || !userEnriched) return;
      try {
        if (targetType === "event") {
          await eventService.delete(user.id, targetId);

          setUserEnriched({
            ...userEnriched,
            events: userEnriched.events?.filter((e) => e.id !== targetId) || [],
          });
        }

        if (targetType === "character") {
          await characterService.delete(user.id, targetId);
          setUserEnriched({
            ...userEnriched,
            characters:
              userEnriched.characters?.filter((c) => c.id !== targetId) || [],
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          showError("Erreur", error.message);
        } else {
          showError("Erreur", "Une erreur est survenue");
        }
      }
    },
    [],
  );

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
              <ul className="profile_section_list">
                {userEnriched.events.map((event) => (
                  <li key={event.id} className="profile_section_list_item">
                    <ProfileEventCard
                      event={event}
                      handleDelete={handleDelete}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p>Vous n'avez créé aucun évènement</p>
            )}
          </section>

          <section className="profile_section">
            <h2 className="profile_section_title">Personnages</h2>
            {userEnriched.characters && userEnriched.characters.length ? (
              <ul className="profile_section_list">
                {userEnriched.characters.map((character) => (
                  <li key={character.id} className="profile_section_list_item">
                    <CharacterCard
                      character={character}
                      handleDelete={handleDelete}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p>Vous n'avez créé aucun personnage</p>
            )}
          </section>
        </main>
      ) : null}
    </>
  );
}
