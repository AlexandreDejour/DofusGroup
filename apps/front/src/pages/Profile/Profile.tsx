import "./Profile.scss";

import { useTypedTranslation } from "../../i18n/i18n-helper";

import { CharacterEnriched } from "../../types/character";

import { useAuth } from "../../contexts/authContext";
import { useModal } from "../../contexts/modalContext";

import useUserEnriched from "../../hooks/useFetchUserEnriched";
import useFetchUpComingEvents from "../../hooks/useFetchUpComingEvents";

import Spinner from "../../components/Spinner/Spinner";
import CharacterCard from "../../components/CharacterCard/CharacterCard";
import ProfileEventCard from "../../components/ProfileEventCard/ProfileEventCard";

export default function Profile() {
  const t = useTypedTranslation();

  const { user } = useAuth();
  const { handleDelete } = useModal();

  const { userEnriched, isLoading: userEnrichedLoading } = useUserEnriched();
  const { upComingEvents, isLoading: upComingEventsLoading } =
    useFetchUpComingEvents(userEnriched);

  return (
    <>
      {user && userEnriched ? (
        <main className="profile">
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
                    .sort((a: CharacterEnriched, b: CharacterEnriched) =>
                      a.name.localeCompare(b.name),
                    )
                    .map((character: CharacterEnriched) => (
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
