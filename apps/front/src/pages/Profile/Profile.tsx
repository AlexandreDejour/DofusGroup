import "./Profile.scss";

import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../contexts/authContext";
import { useModal } from "../../contexts/modalContext";
import { useNotification } from "../../contexts/notificationContext";

import { UserEnriched } from "../../types/user";

import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { UserService } from "../../services/api/userService";
import CharacterCard from "../../components/CharacterCard/CharacterCard";
import ProfileEventCard from "../../components/ProfileEventCard/ProfileEventCard";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const userService = new UserService(axios);

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { showError } = useNotification();
  const { user, isAuthLoading } = useAuth();
  const { openModal, handleDelete } = useModal();

  const [userEnriched, setUserEnriched] = useState<UserEnriched | null>(null);

  useEffect(() => {
    const fetchUserEnriched = async () => {
      if (isAuthLoading) return;

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

    fetchUserEnriched();
  }, [user, isAuthLoading]);

  return (
    <>
      {user && userEnriched ? (
        <main className="profile">
          <section className="profile_section">
            <h2 className="profile_section_title">Profil</h2>

            <div className="profile_section_details">
              <p className="profile_section_details_info">
                {t("username")}: {user.username}
              </p>
              <p className="profile_section_details_info">
                {t("events")}: {userEnriched.events?.length}
              </p>
              <p className="profile_section_details_info">
                {t("characters")}: {userEnriched.characters?.length}
              </p>
            </div>

            <div className="profile_section_actions">
              <button
                type="button"
                className="profile_section_actions_button button"
                onClick={() => openModal("username")}
              >
                {t("changeUsername")}
              </button>
              <button
                type="button"
                className="profile_section_actions_button button"
                onClick={() => openModal("password")}
              >
                {t("changePassword")}
              </button>
              <button
                type="button"
                className="profile_section_actions_button button"
                onClick={() => openModal("mail")}
              >
                {t("changeEmail")}
              </button>
              <button
                type="button"
                className="profile_section_actions_button button delete"
                onClick={() => handleDelete("user")}
              >
                {t("deleteAccount")}
              </button>
              <button
                type="button"
                className="profile_section_actions_button button"
                onClick={() => openModal("newEvent")}
              >
                {t("createEvent")}
              </button>
              <button
                type="button"
                className="profile_section_actions_button button"
                onClick={() => openModal("newCharacter")}
              >
                {t("createCharacter")}
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
              <p>{t("anyEvent")}</p>
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
              <p>{t("anyCharacter")}</p>
            )}
          </section>
        </main>
      ) : null}
    </>
  );
}
