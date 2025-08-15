import "./LoginForm.scss";

interface LoginFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
}

export default function LoginForm({ handleSubmit, error }: LoginFormProps) {
  return (
    <div className="login_modal">
      <h3 className="login_modal_title">Connexion</h3>
      <form onSubmit={handleSubmit} className="login_modal_form" role="form">
        <label htmlFor="username" className="login_modal_form_label">
          <span>Pseudo:</span>
          <input
            type="text"
            name="username"
            id="username"
            required
            placeholder="Pseudo"
            className="login_modal_form_label_input"
          />
        </label>

        <label htmlFor="password" className="login_modal_form_label">
          <span>Mot de passe:</span>
          <input
            type="password"
            name="password"
            id="password"
            required
            placeholder="Mot de passe"
            className="login_modal_form_label_input"
          />
        </label>

        <button
          type="submit"
          aria-label="Login"
          role="button"
          className="login_modal_form_button button"
        >
          Se connecter
        </button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}
