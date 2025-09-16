import { Navigate, useNavigate, useParams } from "react-router";
import "./CharacterDetails.scss";
import { useEffect, useState } from "react";

import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { CharacterService } from "../../services/api/characterService";
import { isAxiosError } from "axios";
import { useAuth } from "../../contexts/authContext";
import { CharacterEnriched } from "../../types/character";
import { useModal } from "../../contexts/modalContext";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const characterService = new CharacterService(axios);

export default function CharacterDetails() {
  const navigate = useNavigate();
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
          {character.sex === "M" ? (
            <img
              className="character_section_img"
              src={`/characters/${character.breed.name.toLocaleLowerCase()}_male.webp`}
              alt={`Miniature de classe ${character.breed.name.toLocaleLowerCase()}`}
            />
          ) : (
            <img
              className="character_section_img"
              src={`/characters/${character.breed.name.toLocaleLowerCase()}_female.webp`}
              alt={`Miniature de classe ${character.breed.name.toLocaleLowerCase()}`}
            />
          )}

          <div className="character_section_details">
            <p>
              <span>Classe:</span> {character.breed.name}
            </p>
            <p>
              <span>Serveur:</span> {character.server.name}
            </p>
            <p>
              <span>Niveau:</span> {character.level}
            </p>
            <p>
              <span>Alignement:</span> {character.alignment}
            </p>
            <p>
              <span>Sexe:</span> {character.sex}
            </p>
            <a href={character.stuff}>
              <span>Stuff:</span> {character.stuff}
            </a>
          </div>

          {character.user.id === user?.id ? (
            <div className="character_section_buttons">
              <button
                type="button"
                className="button"
                onClick={() => openModal("updateCharacter", character)}
              >
                Modifier
              </button>
              <button
                type="button"
                className="button delete"
                onClick={() => handleDelete("character_details", character.id)}
              >
                Supprimer
              </button>
            </div>
          ) : null}
        </section>
      ) : (
        <p>Chargement en cours</p>
      )}
      <button
        type="button"
        className="character_button button"
        onClick={() => navigate("/profile")}
      >
        Retour
      </button>
    </main>
  );
}
