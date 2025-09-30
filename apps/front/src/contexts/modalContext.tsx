import { useNavigate } from "react-router";
import React, { createContext, useCallback, useContext, useState } from "react";

import { useAuth } from "./authContext";
import { useNotification } from "./notificationContext";

import {
  RegisterForm,
  LoginForm,
  UpdateForm,
  CreateCharacterForm,
  CreateEventForm,
  CreateCommentForm,
} from "../types/form";
import { Event } from "../types/event";
import { CommentEnriched } from "../types/comment";
import { CharacterEnriched } from "../types/character";

import { Config } from "../config/config";
import { ApiClient } from "../services/client";
import formDataToObject from "./utils/formDataToObject";
import { AuthService } from "../services/api/authService";
import { UserService } from "../services/api/userService";
import { EventService } from "../services/api/eventService";
import { CommentService } from "../services/api/commentService";
import { CharacterService } from "../services/api/characterService";
import isUpdateField from "../components/modals/utils/isUpdateField";
import { useTranslation } from "react-i18next";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const authService = new AuthService(axios);
const userService = new UserService(axios);
const eventService = new EventService(axios);
const commentService = new CommentService(axios);
const characterService = new CharacterService(axios);

export interface ModalContextType {
  isOpen: boolean;
  modalType: string | null; // ex: "register", "login", "newEvent", etc.
  updateTarget: Event | CharacterEnriched | CommentEnriched | null;
  formData: FormData;
  resetForm: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleDelete: (targetType: TargetType, targetId?: string) => Promise<void>;
  openModal: (
    modalType: ModalType,
    updateTarget?: Event | CharacterEnriched | CommentEnriched,
  ) => void;
  closeModal: () => void;
}

interface ModalProviderProps {
  children: React.ReactNode;
}

export type ModalType =
  | "register"
  | "login"
  | "mail"
  | "password"
  | "confirmPassword"
  | "username"
  | "newCharacter"
  | "updateCharacter"
  | "newEvent"
  | "updateEvent"
  | "joinEvent"
  | "comment"
  | "updateComment"
  | null;

export type TargetType =
  | "user"
  | "event"
  | "event_details"
  | "character"
  | "character_details"
  | "comment";

const ModalContext = createContext<ModalContextType | null>(null);

export default function ModalProvider({ children }: ModalProviderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("translation");

  const { user, setUser } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [updateTarget, setUpdateTarget] = useState<
    Event | CharacterEnriched | CommentEnriched | null
  >(null);

  const resetForm = () => setFormData(new FormData());

  const openModal = useCallback(
    (
      modalType: ModalType,
      updateTarget?: Event | CharacterEnriched | CommentEnriched,
    ) => {
      if (updateTarget) setUpdateTarget(updateTarget);

      setModalType(modalType);
      setIsOpen(true);
    },
    [],
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalType(null);
    setUpdateTarget(null);
    setFormData(new FormData());
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const form = event.currentTarget as HTMLFormElement;
      const formData = new FormData(form);

      if (!modalType) return;
      try {
        if (modalType === "register") {
          const keys: (keyof RegisterForm)[] = [
            "username",
            "mail",
            "password",
            "confirmPassword",
          ];
          const data = formDataToObject<RegisterForm>(formData, { keys });
          await authService.register(data);

          showSuccess(
            `${t("successfullyRegister")} !`,
            `${t("wouldYouConnect")}.`,
            6000,
          );
        }

        if (modalType === "login") {
          const keys: (keyof LoginForm)[] = ["username", "password"];
          const data = formDataToObject<LoginForm>(formData, { keys });
          const response = await authService.login(data);

          setUser(response);

          showSuccess(
            `${t("successfullyLogin")} !`,
            `${t("youAreConnected")}.`,
          );
        }

        if (isUpdateField(modalType)) {
          if (!user) return;

          const keys: (keyof UpdateForm)[] = [modalType];
          console.log(keys);

          if (keys[0] === "password") keys.push("confirmPassword");
          const data = formDataToObject<UpdateForm>(formData, { keys });
          const response = await userService.update(user.id, data);

          setUser(response);

          showSuccess(
            `${t("successfullyUpdate")} !`,
            `${t("informationsUpdated")}.`,
          );
        }

        if (modalType === "newCharacter") {
          if (!user) {
            showError(`${t("loginNeeded")} !`, `${t("actionNeedLogin")}.`);
            return;
          }

          const keys: (keyof CreateCharacterForm)[] = [
            "name",
            "sex",
            "level",
            "alignment",
            "stuff",
            "default_character",
            "breed_id",
            "server_id",
          ];
          const booleanKeys: (keyof CreateCharacterForm)[] = [
            "default_character",
          ];
          const numberKeys: (keyof CreateCharacterForm)[] = ["level"];

          const data = formDataToObject<CreateCharacterForm>(formData, {
            keys,
            booleanKeys,
            numberKeys,
          });

          await characterService.create(user.id, data);
          const response = await userService.getOne(user.id);

          setUser({ ...user, ...response });

          showSuccess(
            `${t("successfullyCreateCharacter")} !`,
            `${t("characterCreated")}.`,
          );
        }

        if (modalType === "updateCharacter") {
          if (!user) {
            showError(`${t("loginNeeded")} !`, `${t("actionNeedLogin")}.`);
            return;
          }

          if (!updateTarget) return;

          const keys: (keyof CreateCharacterForm)[] = [
            "name",
            "sex",
            "level",
            "alignment",
            "stuff",
            "default_character",
            "breed_id",
            "server_id",
          ];
          const booleanKeys: (keyof CreateCharacterForm)[] = [
            "default_character",
          ];
          const numberKeys: (keyof CreateCharacterForm)[] = ["level"];

          const data = formDataToObject<CreateCharacterForm>(formData, {
            keys,
            booleanKeys,
            numberKeys,
          });

          const characterData = await characterService.update(
            user.id,
            updateTarget.id,
            data,
          );
          const userData = await userService.getOne(user.id);

          setUpdateTarget(characterData);
          setUser({ ...user, ...userData });

          showSuccess(
            `${t("successfullyUpdate")} !`,
            `${t("characterUpdated")}.`,
          );
        }

        if (modalType === "newEvent") {
          if (!user) {
            showError(`${t("loginNeeded")} !`, `${t("actionNeedLogin")}.`);
            return;
          }

          const keys: (keyof CreateEventForm)[] = [
            "title",
            "date",
            "duration",
            "area",
            "sub_area",
            "donjon_name",
            "description",
            "max_players",
            "status",
            "tag_id",
            "server_id",
            "characters_id",
          ];
          const dateKeys: (keyof CreateEventForm)[] = ["date"];
          const numberKeys: (keyof CreateEventForm)[] = [
            "duration",
            "max_players",
          ];
          const arrayKeys: (keyof CreateEventForm)[] = ["characters_id"];

          const data = formDataToObject<CreateEventForm>(formData, {
            keys,
            dateKeys,
            numberKeys,
            arrayKeys,
          });

          await eventService.create(user.id, data);
          const response = await userService.getOne(user.id);

          setUser({ ...user, ...response });

          showSuccess(
            `${t("successfullyCreateEvent")}`,
            `${t("eventCreated")}.`,
          );
        }

        if (modalType === "updateEvent") {
          if (!user) {
            showError(`${t("loginNeeded")} !`, `${t("actionNeedLogin")}.`);
            return;
          }

          if (!updateTarget) return;

          const keys: (keyof CreateEventForm)[] = [
            "title",
            "date",
            "duration",
            "area",
            "sub_area",
            "donjon_name",
            "description",
            "max_players",
            "status",
            "tag_id",
            "server_id",
            "characters_id",
          ];
          const dateKeys: (keyof CreateEventForm)[] = ["date"];
          const numberKeys: (keyof CreateEventForm)[] = [
            "duration",
            "max_players",
          ];
          const arrayKeys: (keyof CreateEventForm)[] = ["characters_id"];

          const data = formDataToObject<CreateEventForm>(formData, {
            keys,
            dateKeys,
            numberKeys,
            arrayKeys,
          });

          const eventData = await eventService.update(
            user.id,
            updateTarget?.id,
            data,
          );
          const userData = await userService.getOne(user.id);

          setUpdateTarget(eventData);
          setUser({ ...user, ...userData });

          showSuccess(`${t("successfullyUpdate")} !`, `${t("eventUpdated")}.`);
        }

        if (modalType === "joinEvent") {
          if (!user) {
            showError(`${t("loginNeeded")} !`, `${t("actionNeedLogin")}.`);
            return;
          }

          if (!updateTarget) return;

          const keys: (keyof CreateEventForm)[] = [
            "title",
            "date",
            "duration",
            "area",
            "sub_area",
            "donjon_name",
            "description",
            "max_players",
            "status",
            "tag_id",
            "server_id",
            "characters_id",
          ];
          const arrayKeys: (keyof CreateEventForm)[] = ["characters_id"];

          const data = formDataToObject<CreateEventForm>(formData, {
            keys,
            arrayKeys,
          });

          await eventService.addCharacters(updateTarget.id, data);

          showSuccess(`${t("successfullyRegister")}`, `${t("youJoinEvent")}.`);
        }

        if (modalType === "comment") {
          if (!user) {
            showError(`${t("loginNeeded")} !`, `${t("actionNeedLogin")}.`);
            return;
          }

          if (!updateTarget) return;

          const keys: (keyof CreateCommentForm)[] = ["content"];

          const data = formDataToObject<CreateCommentForm>(formData, {
            keys,
          });

          await commentService.create(user.id, updateTarget.id, data);

          showSuccess(`${t("newComment")} !`, `${t("addNewComment")}.`);
        }

        if (modalType === "updateComment") {
          if (!user) {
            showError(`${t("loginNeeded")} !`, `${t("actionNeedLogin")}.`);
            return;
          }

          if (!updateTarget) return;

          const keys: (keyof CreateCommentForm)[] = ["content"];

          const data = formDataToObject<CreateCommentForm>(formData, {
            keys,
          });

          await commentService.update(user.id, updateTarget.id, data);

          showSuccess(
            `${t("successfullyUpdate")} !`,
            `${t("commentUpdated")}.`,
          );
        }

        closeModal();
      } catch (error) {
        if (error instanceof Error) {
          showError(`${t("error")}`, error.message);
        } else {
          showError(`${t("error")}`, `${t("errorOccurred")}.`);
        }
      }
    },
    [modalType, closeModal],
  );

  const handleDelete = useCallback(
    async (targetType: TargetType, targetId?: string) => {
      if (!user) {
        showError(`${t("loginNeeded")} !`, `${t("actionNeedLogin")}.`);
        return;
      }

      try {
        if (targetType === "event" && targetId) {
          await eventService.delete(user.id, targetId);
          const response = await userService.getOne(user.id);

          showSuccess(`${t("dataDeletion")} !`, `${t("eventDeleted")}.`);

          setUser({ ...user, ...response });
        }

        if (targetType === "event_details" && targetId) {
          await eventService.delete(user.id, targetId);

          showSuccess(
            `${t("dataDeletion")} !`,
            "Votre évènement a été supprimé avec succès",
          );

          navigate(-1);
        }

        if (targetType === "character" && targetId) {
          await characterService.delete(user.id, targetId);
          const response = await userService.getOne(user.id);

          showSuccess(`${t("dataDeletion")} !`, `${t("characterDeleted")}.`);

          setUser({ ...user, ...response });
        }

        if (targetType === "character_details" && targetId) {
          await characterService.delete(user.id, targetId);

          showSuccess(`${t("dataDeletion")} !`, `${t("characterDeleted")}.`);

          navigate(-1);
        }

        if (targetType === "comment" && targetId) {
          await commentService.delete(user.id, targetId);

          showSuccess(`${t("dataDeletion")} !`, `${t("commentDeleted")}.`);
        }

        if (targetType === "user") {
          await userService.delete(user.id);

          showSuccess(`${t("dataDeletion")} !`, `${t("accountDeleted")}.`);

          setUser(null);
        }
      } catch (error) {
        if (error instanceof Error) {
          showError(`${t("error")}`, error.message);
        } else {
          showError(`${t("error")}`, `${t("errorOccurred")}.`);
        }
      }
    },
    [user, setUser],
  );

  const contextValues: ModalContextType = {
    isOpen,
    modalType,
    updateTarget,
    formData,
    resetForm,
    openModal,
    closeModal,
    handleSubmit,
    handleDelete,
  };

  return (
    <ModalContext.Provider value={contextValues}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used in modalProvider");
  }

  return context;
}
