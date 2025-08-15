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
        <label htmlFor="mail" className="login_modal_form_label">
          <span>Email:</span>
          <input
            type="email"
            name="mail"
            id="mail"
            placeholder="Email"
            className="login_modal_form_input"
          />
        </label>

        <label htmlFor="password" className="login_modal_form_label">
          <span>Mot de passe:</span>
          <input
            type="password"
            name="password"
            id="password"
            className="login_modal_form_input"
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
