import "./ModalsManager.scss";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useModal } from "../../contexts/modalContext";

import { typeGuard } from "./utils/typeGuard";

import LoginForm from "./forms/Forms/LoginForm";
import UpdateForm from "./forms/Forms/UpdateForm";
import RegisterForm from "./forms/Forms/RegisterForm";
import NewEventForm from "./forms/NewEventForm/NewEventForm";
import JoinEventForm from "./forms/JoinEventForm/JoinEventForm";
import UpdateEventForm from "./forms/UpdateEventForm/UpdateEventForm";
import NewCharacterForm from "./forms/NewCharacterForm/NewCharacterForm";
import UpdateCharacterForm from "./forms/UpdateCharacterForm/UpdateCharacterForm";
import CommentForm from "./forms/Forms/CommentForm";

export default function ModalsManager() {
  const { isOpen, modalType, updateTarget, handleSubmit, closeModal } =
    useModal();

  if (!isOpen || !modalType) return null;

  return (
    <div className="modal" onClick={closeModal} role="dialog">
      <div
        className={`modal_content ${modalType}`}
        onClick={(e) => e.stopPropagation()}
      >
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

          {modalType === "updateCharacter" &&
            typeGuard.characterEnriched(updateTarget) && (
              <UpdateCharacterForm
                updateTarget={updateTarget}
                handleSubmit={(event) => handleSubmit(event)}
              />
            )}

          {modalType === "newEvent" && (
            <NewEventForm handleSubmit={(event) => handleSubmit(event)} />
          )}

          {modalType === "updateEvent" &&
            typeGuard.eventEnriched(updateTarget) && (
              <UpdateEventForm
                updateTarget={updateTarget}
                handleSubmit={(event) => handleSubmit(event)}
              />
            )}

          {modalType === "joinEvent" &&
            typeGuard.eventEnriched(updateTarget) && (
              <JoinEventForm handleSubmit={(event) => handleSubmit(event)} />
            )}

          {modalType === "comment" && typeGuard.eventEnriched(updateTarget) && (
            <CommentForm handleSubmit={(event) => handleSubmit(event)} />
          )}

          {modalType === "updateComment" &&
            typeGuard.commentEnriched(updateTarget) && (
              <CommentForm
                updateTarget={updateTarget}
                handleSubmit={(event) => handleSubmit(event)}
              />
            )}
        </div>
      </div>
    </div>
  );
}
