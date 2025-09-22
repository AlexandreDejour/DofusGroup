import "../Form.scss";

import { typeGuard } from "../utils/typeGuard";
import { useModal } from "../../../contexts/modalContext";

interface CommentFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function CommentForm({ handleSubmit }: CommentFormProps) {
  const { updateTarget } = useModal();

  return (
    <div className="content_modal">
      {typeGuard.commentEnriched(updateTarget) ? (
        <h3 className="content_modal_title">Modifier un commentaire</h3>
      ) : (
        <h3 className="content_modal_title">Ajouter un commentaire</h3>
      )}

      <form onSubmit={handleSubmit} className="content_modal_form" role="form">
        <label htmlFor="content" className="content_modal_form_label">
          <span>Commentaire: </span>
          <textarea
            name="content"
            id="content"
            rows={3}
            required
            placeholder="Commentaire"
            className="content_modal_form_label_input"
          />
        </label>

        <button
          type="submit"
          aria-label="Comment"
          className="content_modal_form_button button"
        >
          Commenter
        </button>
      </form>
    </div>
  );
}
