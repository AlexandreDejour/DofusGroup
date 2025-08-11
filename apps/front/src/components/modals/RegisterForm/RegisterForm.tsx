import "./RegisterForm.scss";

interface RegisterFormProps {
  handleSubmit: (formData: FormData) => Promise<void>;
}

export default function RegisterForm({ handleSubmit }: RegisterFormProps) {
  return (
    <div className="register_modal">
      <h3 className="register_modal_title">Inscription</h3>
      <form action={handleSubmit} className="register_modal_form">
        <label htmlFor="username" className="register_modal_form_label">
          <span>Username:</span>
          <input
            type="text"
            name="username"
            id="username"
            required
            placeholder="Username"
            className="register_modal_form_label_input"
          />
        </label>

        <label htmlFor="mail" className="register_modal_form_label">
          <span>Email:</span>
          <input
            type="email"
            name="mail"
            id="mail"
            required
            placeholder="Email"
            className="register_modal_form_label_input"
          />
        </label>

        <label htmlFor="password" className="register_modal_form_label">
          <span>Mot de passe:</span>
          <input
            type="password"
            name="password"
            id="password"
            required
            title="Le mot de passe ne respecte pas les conditions minimales de sécurité"
            placeholder="Mot de passe"
            className="register_modal_form_label_input"
          />
        </label>

        <label htmlFor="confirmPassword" className="register_modal_form_label">
          <span>Confirmation mot de passe:</span>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            required
            placeholder="Confirmation mot de passe"
            className="register_modal_form_label_input"
          />
        </label>

        <button
          type="submit"
          aria-label="Register"
          className="register_modal_form_button button"
        >
          S'incrire
        </button>
      </form>
    </div>
  );
}
