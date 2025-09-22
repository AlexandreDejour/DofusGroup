import "../Form.scss";

interface CommentFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function CommentForm({ handleSubmit }: CommentFormProps) {
  return (
    <div className="content_modal">
      <h3 className="content_modal_title">Ajouter un commentaire</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="comment" className="content_modal_form_label">
          <span>Commentaire: </span>
          <input
            type="text"
            name="comment"
            id="comment"
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
