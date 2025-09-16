import { Navigate, useParams } from "react-router";
import "./CharacterDetails.scss";
import { useEffect, useState } from "react";

import { Config } from "../../config/config";
import { ApiClient } from "../../services/client";
import { CharacterService } from "../../services/api/characterService";
import { isAxiosError } from "axios";
import { useAuth } from "../../contexts/authContext";
import { CharacterEnriched } from "../../types/character";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const characterService = new CharacterService(axios);

export default function CharacterDetails() {
  const { id } = useParams();
  const { user } = useAuth();

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
  }, [id]);

  if (!isLoading && character === null)
    return <Navigate to="/not-found" replace />;

  return (
    <main className="character">
      {character ? (
        <section>
          {character.sex === "M" ? (
            <img
              className="character_img"
              src={`/characters/${character.breed.name.toLocaleLowerCase()}_male.webp`}
              alt={`Miniature de classe ${character.breed.name.toLocaleLowerCase()}`}
            />
          ) : (
            <img
              className="character_img"
              src={`/characters/${character.breed.name.toLocaleLowerCase()}_female.webp`}
              alt={`Miniature de classe ${character.breed.name.toLocaleLowerCase()}`}
            />
          )}

          <div className="character_details">
            <p>Pseudo: {character.name}</p>
            <p>Classe: {character.breed.name}</p>
            <p>Niveau: {character.level}</p>
            <p>Serveur: {character.server.name}</p>
            <p>Sexe: {character.sex}</p>
            <p>Alignement: {character.alignment}</p>
            <a href={character.stuff}>Stuff: {character.stuff}</a>
          </div>

          {character.user.id === user?.id ? (
            <div className="character_buttons">
              <button type="button" className="button">
                Modifier
              </button>
              <button type="button" className="button delete">
                Supprimer
              </button>
            </div>
          ) : null}
        </section>
      ) : (
        <p>Chargement en cours</p>
      )}
    </main>
  );
}
