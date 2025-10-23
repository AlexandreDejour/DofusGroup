import { useNavigate } from "react-router";
import { useTypedTranslation } from "../i18n/i18n-helper";
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
import { displayModalError } from "./utils/displayModalError";
import { displayTargetError } from "./utils/displayTargetError";
import { CommentService } from "../services/api/commentService";
import { CharacterService } from "../services/api/characterService";
import isUpdateField from "../components/modals/utils/isUpdateField";
import { cleanProfanity, containsProfanity } from "./utils/profanity";

const config = Config.getInstance();
const axios = new ApiClient(config.backUrl);
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
  | "oldPassword"
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
  const t = useTypedTranslation();

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

          if (containsProfanity(data.username)) {
            showError(
              t("system.error.profanity"),
              t("system.error.inappropriate"),
            );
            return;
          }

          await authService.register(data);

          showSuccess(
            t("auth.success.register"),
            t("auth.prompt.connect"),
            6000,
          );
        }

        if (modalType === "login") {
          const keys: (keyof LoginForm)[] = ["username", "password"];
          const data = formDataToObject<LoginForm>(formData, { keys });
          const response = await authService.login(data);

          setUser(response);

          showSuccess(
            t("auth.success.login"),
            t("auth.success.connected", { username: response.username }),
          );
        }

        if (isUpdateField(modalType)) {
          if (!user) return;

          const keys: (keyof UpdateForm)[] = [modalType];

          if (keys[0] === "password")
            keys.push("confirmPassword", "oldPassword");
          const data = formDataToObject<UpdateForm>(formData, { keys });
          const response = await userService.update(user.id, data);

          setUser(response);

          showSuccess(
            t("system.success.dataUpdated"),
            t("system.success.updated"),
          );
        }

        if (modalType === "newCharacter") {
          if (!user) {
            showError(
              t("auth.prompt.loginRequired"),
              t("auth.prompt.loginRequiredAction"),
            );
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
          const numberKeys: (keyof CreateCharacterForm)[] = ["level"];

          const data = formDataToObject<CreateCharacterForm>(formData, {
            keys,
            numberKeys,
          });

          if (containsProfanity(data.name)) {
            showError(
              t("system.error.profanity"),
              t("system.error.inappropriate"),
            );
            return;
          }

          const cleanData = cleanProfanity(data);

          await characterService.create(user.id, cleanData);
          const response = await userService.getOne(user.id);

          setUser({ ...user, ...response });

          showSuccess(
            t("system.success.create"),
            t("character.success.created"),
          );
        }

        if (modalType === "updateCharacter") {
          if (!user) {
            showError(
              t("auth.prompt.loginRequired"),
              t("auth.prompt.loginRequiredAction"),
            );
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
          const numberKeys: (keyof CreateCharacterForm)[] = ["level"];

          const data = formDataToObject<CreateCharacterForm>(formData, {
            keys,
            numberKeys,
          });

          if (containsProfanity(data.name)) {
            showError(
              t("system.error.profanity"),
              t("system.error.inappropriate"),
            );
            return;
          }

          const cleanData = cleanProfanity(data);

          const characterData = await characterService.update(
            user.id,
            updateTarget.id,
            cleanData,
          );
          const userData = await userService.getOne(user.id);

          setUpdateTarget(characterData);
          setUser({ ...user, ...userData });

          showSuccess(
            t("system.success.dataUpdated"),
            t("character.success.updated"),
          );
        }

        if (modalType === "newEvent") {
          if (!user) {
            showError(
              t("auth.prompt.loginRequired"),
              t("auth.prompt.loginRequiredAction"),
            );
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

          if (containsProfanity(data.title)) {
            showError(
              t("system.error.profanity"),
              t("system.error.inappropriate"),
            );
            return;
          }

          const cleanData = cleanProfanity(data);

          await eventService.create(user.id, cleanData);
          const response = await userService.getOne(user.id);

          setUser({ ...user, ...response });

          showSuccess(t("system.success.create"), t("event.create"));
        }

        if (modalType === "updateEvent") {
          if (!user) {
            showError(
              t("auth.prompt.loginRequired"),
              t("auth.prompt.loginRequiredAction"),
            );
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

          if (containsProfanity(data.title)) {
            showError(
              t("system.error.profanity"),
              t("system.error.inappropriate"),
            );
            return;
          }

          const cleanData = cleanProfanity(data);

          const eventData = await eventService.update(
            user.id,
            updateTarget?.id,
            cleanData,
          );
          const userData = await userService.getOne(user.id);

          setUpdateTarget(eventData);
          setUser({ ...user, ...userData });

          showSuccess(
            t("system.success.dataUpdated"),
            t("event.success.updated"),
          );
        }

        if (modalType === "joinEvent") {
          if (!user) {
            showError(
              t("auth.prompt.loginRequired"),
              t("auth.prompt.loginRequiredAction"),
            );
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

          showSuccess(t("auth.success.register"), t("event.prompt.joined"));
        }

        if (modalType === "comment") {
          if (!user) {
            showError(
              t("auth.prompt.loginRequired"),
              t("auth.prompt.loginRequiredAction"),
            );
            return;
          }

          if (!updateTarget) return;

          const keys: (keyof CreateCommentForm)[] = ["content"];

          const data = formDataToObject<CreateCommentForm>(formData, {
            keys,
          });

          const cleanData = cleanProfanity(data);

          await commentService.create(user.id, updateTarget.id, cleanData);

          showSuccess(t("comment.new"), t("comment.success.added"));
        }

        if (modalType === "updateComment") {
          if (!user) {
            showError(
              t("auth.prompt.loginRequired"),
              t("auth.prompt.loginRequiredAction"),
            );
            return;
          }

          if (!updateTarget) return;

          const keys: (keyof CreateCommentForm)[] = ["content"];

          const data = formDataToObject<CreateCommentForm>(formData, {
            keys,
          });

          const cleanData = cleanProfanity(data);

          await commentService.update(user.id, updateTarget.id, cleanData);

          showSuccess(
            t("system.success.dataUpdated"),
            t("comment.success.updated"),
          );
        }

        closeModal();
      } catch (error) {
        displayModalError(error, t, showError, modalType);
      }
    },
    [modalType, closeModal],
  );

  const handleDelete = useCallback(
    async (targetType: TargetType, targetId?: string) => {
      if (!user) {
        showError(
          t("auth.prompt.loginRequired"),
          t("auth.prompt.loginRequiredAction"),
        );
        return;
      }

      try {
        if (targetType === "event" && targetId) {
          await eventService.delete(user.id, targetId);
          const response = await userService.getOne(user.id);

          showSuccess(t("system.success.deleted"), t("event.success.deleted"));

          setUser({ ...user, ...response });
        }

        if (targetType === "event_details" && targetId) {
          await eventService.delete(user.id, targetId);

          showSuccess(t("system.success.deleted"), t("event.success.deleted"));

          navigate(-1);
        }

        if (targetType === "character" && targetId) {
          await characterService.delete(user.id, targetId);

          const userCharacters = await characterService.getAllByUserId(user.id);
          const events = await eventService.getAllByUserId(user.id);

          if (!userCharacters.length) {
            await Promise.all(
              events.map((event) => eventService.delete(user.id, event.id)),
            );

            showSuccess(
              t("system.success.deleted"),
              `${t("character.success.deleted")} ${t(
                "event.noOwnerCharacter",
              )}`,
            );
          } else {
            const characterids = userCharacters.flatMap(
              (character) => character.id,
            );
            const eventsWithoutOwnerCharacters = events.filter(
              (event) =>
                !event.characters.some((character) =>
                  characterids.includes(character.id),
                ),
            );

            if (eventsWithoutOwnerCharacters) {
              await Promise.all(
                eventsWithoutOwnerCharacters.map((event) =>
                  eventService.delete(user.id, event.id),
                ),
              );
            }

            showSuccess(
              t("system.success.deleted"),
              `${t("character.success.deleted")} ${t(
                "event.noOwnerCharacter",
              )}`,
            );
          }

          const response = await userService.getOne(user.id);
          setUser({ ...user, ...response });
        }

        if (targetType === "character_details" && targetId) {
          await characterService.delete(user.id, targetId);

          showSuccess(
            t("system.success.deleted"),
            t("character.success.deleted"),
          );

          navigate(-1);
        }

        if (targetType === "comment" && targetId) {
          await commentService.delete(user.id, targetId);

          showSuccess(
            t("system.success.deleted"),
            t("comment.success.deleted"),
          );
        }

        if (targetType === "user") {
          await userService.delete(user.id);

          showSuccess(
            t("system.success.deleted"),
            t("auth.success.accountDeleted"),
          );

          setUser(null);
        }
      } catch (error) {
        displayTargetError(error, t, showError, targetType);
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
