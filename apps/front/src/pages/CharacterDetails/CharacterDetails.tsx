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
      }
    };
    fetchCharacter();
  });

  return (
    <main className="character">
      {character ? <p>{character.name}</p> : <p>Chargement en cours</p>}
    </main>
  );
}
