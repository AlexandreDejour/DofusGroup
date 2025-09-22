import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/authContext";
import { useNotification } from "../../../contexts/notificationContext";
import "./JoinEventForm.scss";
import { isAxiosError } from "axios";

import { Config } from "../../../config/config";
import { ApiClient } from "../../../services/client";
import { CharacterService } from "../../../services/api/characterService";
import { CharacterEnriched } from "../../../types/character";
import CharactersCheckbox from "../FormComponents/Checkbox/CharactersCheckbox";
import { useModal } from "../../../contexts/modalContext";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const characterService = new CharacterService(axios);

interface JoinEventFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function JoinEventForm({ handleSubmit }: JoinEventFormProps) {
  const { user } = useAuth();
  const { updateTarget } = useModal();
  const { showError } = useNotification();

  const [characters, setCharacters] = useState<CharacterEnriched[]>([]);

  if (!user || !updateTarget) return;

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await characterService.getAllEnrichedByUserId(user.id);

        const availableCharacters = response.filter(
          (character) => character.server.id === updateTarget.server.id,
        );

        setCharacters(availableCharacters);
      } catch (error) {
        if (isAxiosError(error)) {
          showError("Erreur", error.message);
        } else if (error instanceof Error) {
          showError("Erreur", "Une erreur est survenue");
          console.error("General error:", error.message);
        }
      }
    };
    fetchCharacters();
  }, [user, updateTarget]);

  return (
    <div className="content_modal">
      <h3 className="content_modal_title">Rejoindre l'évènement</h3>
      <form onSubmit={handleSubmit} className="content_modal_form" role="form">
        {characters.length ? (
          <CharactersCheckbox characters={characters} />
        ) : (
          <p>Aucun personnages disponible sur ce serveur</p>
        )}
        <button type="submit" className="content_modal_form_button button">
          Rejoindre
        </button>
      </form>
    </div>
  );
}
