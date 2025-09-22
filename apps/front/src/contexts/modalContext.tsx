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
  | "character_details";

const ModalContext = createContext<ModalContextType | null>(null);

export default function ModalProvider({ children }: ModalProviderProps) {
  const navigate = useNavigate();

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
            "Inscription réussi !",
            "Votre compte a été créé avec succès. Veuillez vous connecter.",
            6000,
          );
        }

        if (modalType === "login") {
          const keys: (keyof LoginForm)[] = ["username", "password"];
          const data = formDataToObject<LoginForm>(formData, { keys });
          const response = await authService.login(data);

          setUser(response);

          showSuccess(
            "Connexion réussie !",
            `Bonjour ${response.username} ! Vous êtes maintenant connecté(e).`,
          );
        }

        if (isUpdateField(modalType)) {
          if (!user) return;

          const keys: (keyof UpdateForm)[] = [modalType];
          const data = formDataToObject<UpdateForm>(formData, { keys });
          const response = await userService.update(user.id, data);

          setUser(response);

          showSuccess(
            "Mise à jour réussie !",
            `Vos informations ont été mise à jour avec succès.`,
          );
        }

        if (modalType === "newCharacter") {
          if (!user) return;

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
            "Création de personnage réussie !",
            `Vous avez créer un nouveau personnage.`,
          );
        }

        if (modalType === "updateCharacter") {
          if (!user || !updateTarget) return;

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
            "Mise à jour réussie !",
            `Vous avez mis à jour votre personnage.`,
          );
        }

        if (modalType === "newEvent") {
          if (!user) return;

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
            "Création d'évènement réussie !",
            `Vous avez créer un nouvel évènement.`,
          );
        }

        if (modalType === "updateEvent") {
          if (!user || !updateTarget) return;

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

          showSuccess(
            "Mise à jour réussie !",
            `Vous avez mis à jour votre évènement.`,
          );
        }

        if (modalType === "joinEvent") {
          if (!user || !updateTarget) return;

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

          showSuccess(
            "Inscription réussie !",
            `Vous avez rejoint l'évènement.`,
          );
        }

        if (modalType === "comment") {
          if (!user || !updateTarget) return;

          const keys: (keyof CreateCommentForm)[] = ["content"];

          const data = formDataToObject<CreateCommentForm>(formData, {
            keys,
          });

          await commentService.create(user.id, updateTarget.id, data);

          showSuccess(
            "Nouveau commentaire !",
            `Vous avez ajouter un nouveau commentaire.`,
          );
        }

        if (modalType === "updateComment") {
          if (!user || !updateTarget) return;

          const keys: (keyof CreateCommentForm)[] = ["content"];

          const data = formDataToObject<CreateCommentForm>(formData, {
            keys,
          });

          await commentService.update(user.id, updateTarget.id, data);

          showSuccess("Mise à jour !", `Vous avez modifier votre commentaire.`);
        }

        closeModal();
      } catch (error) {
        if (error instanceof Error) {
          showError("Erreur", error.message);
        } else {
          showError("Erreur", "Une erreur est survenue");
        }
      }
    },
    [modalType, closeModal],
  );

  const handleDelete = useCallback(
    async (targetType: TargetType, targetId?: string) => {
      if (!user) return;

      try {
        if (targetType === "event" && targetId) {
          await eventService.delete(user.id, targetId);
          const response = await userService.getOne(user.id);

          setUser({ ...user, ...response });
        }

        if (targetType === "event_details" && targetId) {
          await eventService.delete(user.id, targetId);

          navigate("/profile");
        }

        if (targetType === "character" && targetId) {
          await characterService.delete(user.id, targetId);
          const response = await userService.getOne(user.id);

          setUser({ ...user, ...response });
        }

        if (targetType === "character_details" && targetId) {
          await characterService.delete(user.id, targetId);

          navigate("/profile");
        }

        if (targetType === "user") {
          await userService.delete(user.id);

          setUser(null);
        }
      } catch (error) {
        if (error instanceof Error) {
          showError("Erreur", error.message);
        } else {
          showError("Erreur", "Une erreur est survenue");
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
