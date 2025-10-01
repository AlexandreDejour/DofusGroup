import "./CharacterDetails.scss";

import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useTypedTranslation } from "../../i18n/i18n-helper";
import { Navigate, useNavigate, useParams } from "react-router";

import { CharacterEnriched } from "../../types/character";

import { useAuth } from "../../contexts/authContext";
import { useModal } from "../../contexts/modalContext";

import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { CharacterService } from "../../services/api/characterService";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const characterService = new CharacterService(axios);

export default function CharacterDetails() {
  const navigate = useNavigate();
  const t = useTypedTranslation();

  const { id } = useParams();
  const { user } = useAuth();
  const { updateTarget, openModal, handleDelete } = useModal();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [character, setCharacter] = useState<CharacterEnriched | null>(null);

  if (!id) return <Navigate to="/not-found" replace />;

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await characterService.getOneEnriched(id);

        setCharacter(response);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error("Axios error:", error.message);
        } else if (error instanceof Error) {
          console.error("General error:", error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCharacter();
  }, [id, updateTarget]);

  if (!isLoading && character === null)
    return <Navigate to="/not-found" replace />;

  return (
    <main className="character">
      {character ? (
        <section className="character_section">
          <h2>
            {character.name.charAt(0).toLocaleUpperCase() +
              character.name.slice(1)}
          </h2>
          <div className="character_section_details">
            {character.sex === "M" ? (
              <img
                className="character_section_details_img"
                src={`/characters/${character.breed.name.toLocaleLowerCase()}_male.webp`}
                alt={`${t(
                  "common.classThumbnail",
                )} ${character.breed.name.toLocaleLowerCase()}`}
              />
            ) : (
              <img
                className="character_section_details_img"
                src={`/characters/${character.breed.name.toLocaleLowerCase()}_female.webp`}
                alt={`${t(
                  "common.classThumbnail",
                )} ${character.breed.name.toLocaleLowerCase()}`}
              />
            )}
            <div className="character_section_details_infos">
              <p>
                <span>{t("breed.upperCase")}:</span> {character.breed.name}
              </p>
              <p>
                <span>{t("server.upperCase")}:</span> {character.server.name}
              </p>
              <p>
                <span>{t("common.level")}:</span> {character.level}
              </p>
              <p>
                <span>{t("common.alignment")}:</span> {character.alignment}
              </p>
              <p>
                <span>{t("common.sex")}:</span> {character.sex}
              </p>
              <a href={character.stuff ? character.stuff : ""}>
                <span>{t("common.stuff")}:</span> {character.stuff}
              </a>
            </div>
          </div>

          {character.user.id === user?.id ? (
            <div className="character_section_buttons">
              <button
                type="button"
                className="button"
                onClick={() => openModal("updateCharacter", character)}
              >
                {t("common.change")}
              </button>
              <button
                type="button"
                className="button delete"
                onClick={() => handleDelete("character_details", character.id)}
              >
                {t("common.delete.default")}
              </button>
            </div>
          ) : null}
        </section>
      ) : (
        <p>{t("common.loading")}</p>
      )}
      <button
        type="button"
        className="character_button button"
        onClick={() => navigate(-1)}
      >
        {t("common.return")}
      </button>
    </main>
  );
}
