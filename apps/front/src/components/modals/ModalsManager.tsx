import "./ModalsManager.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useModal } from "../../contexts/modalContext";
import RegisterForm from "./RegisterForm/RegisterForm";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function ModalsManager() {
  const { isOpen, modalType, closeModal } = useModal();

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={closeModal}>
      <div className="modal_content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal_content_close"
          onClick={closeModal}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {modalType === "register" && <RegisterForm />}
      </div>
    </div>
  );
}
