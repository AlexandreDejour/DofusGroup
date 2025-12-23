import "./ProfileActions.scss";

import { useModal } from "../../contexts/modalContext";
import { useTypedTranslation } from "../../i18n/i18n-helper";

import useUserEnriched from "../../hooks/useFetchUserEnriched";

export default function ProfileActions() {
  const t = useTypedTranslation();

  const { openModal, handleDelete } = useModal();

  const { userEnriched } = useUserEnriched();

  return (
    <>
      {userEnriched ? (
        <>
          <h2 className="profile_section_title">{t("common.profile")}</h2>

          <div className="profile_section_actions">
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
              title={
                !userEnriched.characters?.length ? t("event.error.disable") : ""
              }
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
        </>
      ) : null}
    </>
  );
}
