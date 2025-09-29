import "./Form.scss";

interface RegisterFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function RegisterForm({ handleSubmit }: RegisterFormProps) {
  return (
    <div className="content_modal">
      <h3 className="content_modal_title">Inscription</h3>
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

        <label htmlFor="mail" className="content_modal_form_label">
          <span>Email:</span>
          <input
            type="email"
            name="mail"
            id="mail"
            required
            placeholder="Email"
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
            title="Le mot de passe ne respecte pas les conditions minimales de sécurité"
            placeholder="Mot de passe"
            className="content_modal_form_label_input"
          />
        </label>

        <label htmlFor="confirmPassword" className="content_modal_form_label">
          <span>Confirmation mot de passe:</span>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            required
            placeholder="Confirmation mot de passe"
            className="content_modal_form_label_input"
          />
        </label>

        <button
          type="submit"
          aria-label="Register"
          className="content_modal_form_button button"
        >
          S'incrire
        </button>
      </form>
    </div>
  );
}
