import "./RegisterForm.scss";

export default function RegisterForm() {
  async function handleAction(formData: FormData) {
    const data = Object.fromEntries(formData);
    console.log(data);
  }

  return (
    <div className="register_modal">
      <h3 className="register_modal_title">Inscription</h3>
      <form action="{handeAction}" className="register_modal_form">
        <label htmlFor="username" className="register_modal_form_label">
          <span>Username:</span>
          <input
            type="text"
            name="username"
            id="username"
            required
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
