import "./Profile.scss";

import { useTypedTranslation } from "../../i18n/i18n-helper";

import { useAuth } from "../../contexts/authContext";
import { useModal } from "../../contexts/modalContext";

import useUserEnriched from "./hooks/useFetchUserEnriched";
import useUpComingEvents from "./hooks/useFetchIncomingEvents";

import Spinner from "../../components/Spinner/Spinner";
import CharacterCard from "../../components/CharacterCard/CharacterCard";
import ProfileEventCard from "../../components/ProfileEventCard/ProfileEventCard";

export default function Profile() {
  const t = useTypedTranslation();

  const { user } = useAuth();
  const { openModal, handleDelete } = useModal();

  const { userEnriched, isLoading: userEnrichedLoading } = useUserEnriched();
  const { upComingEvents, isLoading: upComingEventsLoading } =
    useUpComingEvents(userEnriched);

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
                  !userEnriched.characters?.length
                    ? t("event.error.disable")
                    : ""
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
          </section>

          <section className="profile_section">
            <h2 className="profile_section_title">{t("event.upComing")}</h2>
            {!upComingEventsLoading ? (
              upComingEvents && upComingEvents.length ? (
                <ul className="profile_section_list">
                  {upComingEvents.map((event) => (
                    <li key={event.id} className="profile_section_list_item">
                      <ProfileEventCard event={event} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{t("event.noEvent")}</p>
              )
            ) : (
              <Spinner
                size={50}
                color="#808080"
                loading={upComingEventsLoading}
              />
            )}
          </section>

          <section className="profile_section">
            <h2 className="profile_section_title">{t("event.your")}</h2>
            {!userEnrichedLoading ? (
              userEnriched.events && userEnriched.events.length ? (
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
              )
            ) : (
              <Spinner
                size={50}
                color="#808080"
                loading={userEnrichedLoading}
              />
            )}
          </section>

          <section className="profile_section">
            <h2 className="profile_section_title">{t("character.your")}</h2>
            {!userEnrichedLoading ? (
              userEnriched.characters && userEnriched.characters.length ? (
                <ul className="profile_section_list">
                  {userEnriched.characters
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((character) => (
                      <li
                        key={character.id}
                        className="profile_section_list_item"
                      >
                        <CharacterCard
                          character={character}
                          handleDelete={handleDelete}
                        />
                      </li>
                    ))}
                </ul>
              ) : (
                <p>{t("character.noCharacter")}</p>
              )
            ) : (
              <Spinner
                size={50}
                color="#808080"
                loading={userEnrichedLoading}
              />
            )}
          </section>
        </main>
      ) : null}
    </>
  );
}
