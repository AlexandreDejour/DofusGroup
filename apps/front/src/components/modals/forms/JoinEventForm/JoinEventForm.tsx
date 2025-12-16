import "./JoinEventForm.scss";

import { useTypedTranslation } from "../../../../i18n/i18n-helper";

import { useAuth } from "../../../../contexts/authContext";
import { useModal } from "../../../../contexts/modalContext";

import { typeGuard } from "../../utils/typeGuard";

import CharactersCheckbox from "../../formComponents/Checkbox/CharactersCheckbox";
import useFetchUserCharactersEnriched from "../../../../hooks/useFetchUserCharactersEnriched";

interface JoinEventFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function JoinEventForm({ handleSubmit }: JoinEventFormProps) {
  const t = useTypedTranslation();

  const { user } = useAuth();
  const { updateTarget } = useModal();

  if (!user || !updateTarget) return;
  if (!typeGuard.eventEnriched(updateTarget)) return;

  const { characters } = useFetchUserCharactersEnriched(user, updateTarget);

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
