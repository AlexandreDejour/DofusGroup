import React, { createContext, useContext, useState } from "react";

interface ModalContextType {
  isOpen: boolean;
  modalType: string | null; // ex: "signup", "login", "profileEdit", etc.
  error: string | null;
  openModal: (type: string) => void;
  closeModal: () => void;
  setError: (message: string | null) => void;
}

interface ModalProviderProps {
  children: React.ReactNode;
}

const ModalContext = createContext<ModalContextType | null>(null);

export default function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    error,
    openModal,
    closeModal,
    setError,
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
