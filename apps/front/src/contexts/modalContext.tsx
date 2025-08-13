import React, { createContext, useContext, useState } from "react";
import DOMPurify from "dompurify";

import { Config } from "../config/config";
import { ApiClient } from "../services/client";
import { AuthService } from "../services/api/authService";
import formDataToObject from "./utils/formDataToObject";
import { RegisterForm } from "../types/form";

const config = Config.getInstance();
const axios = new ApiClient(config.baseUrl);
const authService = new AuthService(axios);

interface ModalContextType {
  isOpen: boolean;
  modalType: string | null; // ex: "register", "login", "newEvent", etc.
  formData: FormData;
  resetForm: React.Dispatch<React.SetStateAction<FormData>>;
  error: string | null;
  setError: (message: string | null) => void;
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

  async function handleSubmit(event: Event, formData: FormData) {
    event.preventDefault();

    try {
      const rawData = Object.fromEntries(formData);

      const data = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [
          key,
          DOMPurify.sanitize(value as string),
        ]),
      );

      if (modalType === "register") {
        const data = formDataToObject<RegisterForm>(formData, [
          "username",
          "mail",
          "password",
          "confirmPassword",
        ]);
        const response = authService.register(data);
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

  const resetForm = () => setFormData(new FormData());

  const openModal = (type: string) => {
    setModalType(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalType(null);
    setError(null);
  };

  const contextValues: ModalContextType = {
    isOpen,
    modalType,
    formData,
    resetForm,
    error,
    setError,
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
