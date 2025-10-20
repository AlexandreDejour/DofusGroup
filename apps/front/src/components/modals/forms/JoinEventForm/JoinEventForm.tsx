import "./JoinEventForm.scss";

import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useTypedTranslation } from "../../../../i18n/i18n-helper";

import { useAuth } from "../../../../contexts/authContext";
import { useModal } from "../../../../contexts/modalContext";
import { useNotification } from "../../../../contexts/notificationContext";

import { Config } from "../../../../config/config";
import { ApiClient } from "../../../../services/client";
import { typeGuard } from "../../utils/typeGuard";
import { CharacterService } from "../../../../services/api/characterService";
import { CharacterEnriched } from "../../../../types/character";

import CharactersCheckbox from "../../formComponents/Checkbox/CharactersCheckbox";

const config = Config.getInstance();
const axios = new ApiClient(config.backUrl);
const characterService = new CharacterService(axios);

interface JoinEventFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function JoinEventForm({ handleSubmit }: JoinEventFormProps) {
  const t = useTypedTranslation();

  const { user } = useAuth();
  const { updateTarget } = useModal();
  const { showError } = useNotification();

  const [characters, setCharacters] = useState<CharacterEnriched[]>([]);

  if (!user || !updateTarget) return;

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await characterService.getAllEnrichedByUserId(user.id);

        if (!typeGuard.eventEnriched(updateTarget)) {
          return;
        }

        const availableCharacters = response.filter(
          (character) => character.server.id === updateTarget.server.id,
        );

        setCharacters(availableCharacters);
      } catch (error) {
        if (isAxiosError(error)) {
          showError(t("common.error.default"), error.message);
        } else if (error instanceof Error) {
          showError(t("common.error.default"), t("system.error.occurred"));
          console.error("General error:", error.message);
        }
      }
    };
    fetchCharacters();
  }, [user, updateTarget]);

  return (
    <div className="join_event">
      <h3 className="join_event_title">{t("event.join")}</h3>
      <form onSubmit={handleSubmit} className="join_event_form" role="form">
        {characters.length ? (
          <CharactersCheckbox characters={characters} />
        ) : (
          <p>{t("character.error.noneOnServer")}</p>
        )}
        <button type="submit" className="join_event_form_button button">
          {t("common.join")}
        </button>
      </form>
    </div>
  );
}
