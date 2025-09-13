import "./ModalsManager.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useModal } from "../../contexts/modalContext";

import LoginForm from "./Forms/LoginForm";
import UpdateForm from "./Forms/UpdateForm";
import RegisterForm from "./Forms/RegisterForm";
import NewEventForm from "./Forms/NewEventForm";
import NewCharacterForm from "./Forms/NewCharacterForm";

export default function ModalsManager() {
  const { isOpen, modalType, handleSubmit, closeModal } = useModal();

  if (!isOpen || !modalType) return null;

  return (
    <div className="modal" onClick={closeModal} role="dialog">
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
            <RegisterForm handleSubmit={(event) => handleSubmit(event)} />
          )}

          {modalType === "login" && (
            <LoginForm handleSubmit={(event) => handleSubmit(event)} />
          )}

          {["mail", "password", "username"].includes(modalType) && (
            <UpdateForm field={modalType} handleSubmit={handleSubmit} />
          )}

          {modalType === "newCharacter" && (
            <NewCharacterForm handleSubmit={(event) => handleSubmit(event)} />
          )}

          {modalType === "newEvent" && (
            <NewEventForm handleSubmit={(event) => handleSubmit(event)} />
          )}
        </div>
      </div>
    </div>
  );
}
