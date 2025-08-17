import React, { createContext, useContext, useState } from "react";

import { Config } from "../config/config";
import { ApiClient } from "../services/client";
import { AuthService } from "../services/api/authService";
import formDataToObject from "./utils/formDataToObject";
import { RegisterForm, LoginForm } from "../types/form";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const authService = new AuthService(axios);

export interface ModalContextType {
  isOpen: boolean;
  modalType: string | null; // ex: "register", "login", "newEvent", etc.
  formData: FormData;
  resetForm: React.Dispatch<React.SetStateAction<FormData>>;
  error: string | null;
  setError: (message: string | null) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  openModal: (type: string) => void;
  closeModal: () => void;
}

interface ModalProviderProps {
  children: React.ReactNode;
}

const ModalContext = createContext<ModalContextType | null>(null);

export default function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    try {
      if (modalType === "register") {
        const keys: (keyof RegisterForm)[] = [
          "username",
          "mail",
          "password",
          "confirmPassword",
        ];
        const data = formDataToObject<RegisterForm>(formData, keys);
        const response = await authService.register(data);
      }

      if (modalType === "login") {
        const keys: (keyof LoginForm)[] = ["username", "password"];
        const data = formDataToObject<LoginForm>(formData, keys);
        console.log(data);
        const response = await authService.login(data);
        console.log(response);
      }

      setError(null);
      closeModal();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur est survenue");
      }
    }
  }

  const resetForm = () => setFormData(new FormData());

  const openModal = (type: string) => {
    setModalType(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalType(null);
    setError(null);
    setFormData(new FormData());
  };

  const contextValues: ModalContextType = {
    isOpen,
    modalType,
    formData,
    resetForm,
    error,
    setError,
    handleSubmit,
    openModal,
    closeModal,
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
