import React, { createContext, useCallback, useContext, useState } from "react";

import { useAuth } from "./authContext";
import { useNotification } from "./notificationContext";

import {
  RegisterForm,
  LoginForm,
  UpdateForm,
  CreateCharacterForm,
} from "../types/form";

import { Config } from "../config/config";
import { ApiClient } from "../services/client";
import formDataToObject from "./utils/formDataToObject";
import { AuthService } from "../services/api/authService";
import { UserService } from "../services/api/userService";
import { CharacterService } from "../services/api/characterService";
import isUpdateField from "../components/modals/utils/isUpdateField";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const authService = new AuthService(axios);
const userService = new UserService(axios);
const characterService = new CharacterService(axios);

export interface ModalContextType {
  isOpen: boolean;
  modalType: string | null; // ex: "register", "login", "newEvent", etc.
  formData: FormData;
  resetForm: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  openModal: (modalType: ModalType) => void;
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
  | null;

const ModalContext = createContext<ModalContextType | null>(null);

export default function ModalProvider({ children }: ModalProviderProps) {
  const { user, setUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [formData, setFormData] = useState<FormData>(new FormData());

  const resetForm = () => setFormData(new FormData());

  const openModal = useCallback((modalType: ModalType) => {
    setModalType(modalType);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalType(null);
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
          const data = formDataToObject<RegisterForm>(formData, keys);
          await authService.register(data);

          showSuccess(
            "Inscription réussi !",
            "Votre compte a été créé avec succès. Veuillez vous connecter.",
            6000,
          );
        }

        if (modalType === "login") {
          const keys: (keyof LoginForm)[] = ["username", "password"];
          const data = formDataToObject<LoginForm>(formData, keys);
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
          const data = formDataToObject<UpdateForm>(formData, keys);
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

          const data = formDataToObject<CreateCharacterForm>(
            formData,
            keys,
            booleanKeys,
            numberKeys,
          );

          await characterService.create(user.id, data);
          const response = await userService.getOne(user.id);

          setUser({ ...user, ...response });

          showSuccess(
            "Création de personnage réussie !",
            `Vous avez créer un nouveau personnage.`,
          );
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

  const contextValues: ModalContextType = {
    isOpen,
    modalType,
    formData,
    resetForm,
    openModal,
    closeModal,
    handleSubmit,
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
