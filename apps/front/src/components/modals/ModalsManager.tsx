import "./ModalsManager.scss";

import DOMPurify from "dompurify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useModal } from "../../contexts/modalContext";
import RegisterForm from "./RegisterForm/RegisterForm";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function ModalsManager() {
  const { isOpen, modalType, error, closeModal, setError } = useModal();

  async function handleSubmit(formData: FormData) {
    const passwordRegex = new RegExp(
      "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_\\-+=\\[\\]{};'\":\\\\|,.<>/?`~]).{8,}$",
    );

    try {
      const rawData = Object.fromEntries(formData);

      const data = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [
          key,
          DOMPurify.sanitize(value as string),
        ]),
      );

      if (data.password) {
        if (!passwordRegex.test(data.password as string)) {
          throw new Error(
            "Le mot de passe ne respecte pas les conditions minimales de sécurité",
          );
        }
        if (data.password !== data.confirmPassword) {
          throw new Error(
            "Le mot de passe et la confirmation doivent être identique",
          );
        }
      }
      setError(null);
      console.log(data);
      closeModal();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur est survenue");
      }
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={closeModal}>
      <div className="modal_content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          aria-label="Close modal"
          className="modal_content_close link"
          onClick={closeModal}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div className="modal_content_form">
          {modalType === "register" && (
            <RegisterForm handleSubmit={handleSubmit} error={error} />
          )}
        </div>
      </div>
    </div>
  );
}
