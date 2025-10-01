import "./Profile.scss";

import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useTypedTranslation } from "../../i18n/i18n-helper";

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
  const t = useTypedTranslation();

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
          showError(t("common.error.default"), error.message);
        } else if (error instanceof Error) {
          showError(t("common.error.default"), t("common.error.occurred"));
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
            <h2 className="profile_section_title">{t("common.profile")}</h2>

            <div className="profile_section_details">
              <p className="profile_section_details_info">
                {t("auth.username")}: {user.username}
              </p>
              <p className="profile_section_details_info">
                {t("event.list")}: {userEnriched.events?.length}
              </p>
              <p className="profile_section_details_info">
                {t("character.list")}: {userEnriched.characters?.length}
              </p>
            </div>

            <div
              className="profile_section_actions"
              title={
                !userEnriched.characters?.length ? t("event.error.disable") : ""
              }
            >
              <button
                type="button"
                className="profile_section_actions_button button"
                onClick={() => openModal("username")}
              >
                {t("auth.usernameChange")}
              </button>
              <button
                type="button"
                className="profile_section_actions_button button"
                onClick={() => openModal("password")}
              >
                {t("auth.password.change")}
              </button>
              <button
                type="button"
                className="profile_section_actions_button button"
                onClick={() => openModal("mail")}
              >
                {t("auth.email.change")}
              </button>
              <button
                type="button"
                className="profile_section_actions_button button delete"
                onClick={() => handleDelete("user")}
              >
                {t("common.delete.account")}
              </button>
              <button
                type="button"
                className="profile_section_actions_button button"
                onClick={() => openModal("newEvent")}
                disabled={!userEnriched.characters?.length}
                style={{
                  background: !userEnriched.characters?.length
                    ? "grey"
                    : "radial-gradient(circle, rgba(96,186,96,1) 0%, rgba(156,217,92,1) 90%)",
                }}
              >
                {t("event.create")}
              </button>
              <button
                type="button"
                className="profile_section_actions_button button"
                onClick={() => openModal("newCharacter")}
              >
                {t("character.create")}
              </button>
            </div>
          </section>

          <section className="profile_section">
            <h2 className="profile_section_title">{t("event.list")}</h2>
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
              <p>{t("event.noEvent")}</p>
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
              <p>{t("character.noCharacter")}</p>
            )}
          </section>
        </main>
      ) : null}
    </>
  );
}
