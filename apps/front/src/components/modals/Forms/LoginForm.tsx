import "../Form.scss";

interface LoginFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function LoginForm({ handleSubmit }: LoginFormProps) {
  return (
    <div className="content_modal">
      <h3 className="content_modal_title">Connexion</h3>
      <form onSubmit={handleSubmit} className="content_modal_form" role="form">
        <label htmlFor="username" className="content_modal_form_label">
          <span>Pseudo:</span>
          <input
            type="text"
            name="username"
            id="username"
            required
            placeholder="Pseudo"
            className="content_modal_form_label_input"
          />
        </label>

        <label htmlFor="password" className="content_modal_form_label">
          <span>Mot de passe:</span>
          <input
            type="password"
            name="password"
            id="password"
            required
            placeholder="Mot de passe"
            className="content_modal_form_label_input"
          />
        </label>

        <button
          type="submit"
          aria-label="Login"
          className="content_modal_form_button button"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
