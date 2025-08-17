import "./ModalsManager.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useModal } from "../../contexts/modalContext";
import RegisterForm from "./RegisterForm/RegisterForm";
import LoginForm from "./LoginForm/LoginForm";

export default function ModalsManager() {
  const { isOpen, modalType, error, handleSubmit, closeModal } = useModal();

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={closeModal} role="dialog">
      <div className="modal_content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          aria-label="Close modal"
          role="button"
          className="modal_content_close link"
          onClick={closeModal}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div className="modal_content_form">
          {modalType === "register" && (
            <RegisterForm
              handleSubmit={(event) => handleSubmit(event)}
              error={error}
            />
          )}

          {modalType === "login" && (
            <LoginForm
              handleSubmit={(event) => handleSubmit(event)}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
}
