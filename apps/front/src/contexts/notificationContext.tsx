import React, { createContext, useContext, useState, useCallback } from "react";

import { v4 as uuidv4 } from "uuid";

import type { Notification, NotificationType } from "../types/notification";

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    type: NotificationType,
    title: string,
    message: string,
    duration?: number,
  ) => void;
  removeNotification: (id: string) => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, duration?: number) => void;
  showInfo: (title: string, message: string, duration?: number) => void;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export default function NotificationProvider({
  children,
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (
      type: NotificationType,
      title: string,
      message: string,
      duration: number = 5000,
    ) => {
      const id: string = uuidv4();
      const notification: Notification = {
        id,
        type,
        title,
        message,
        duration,
      };

      setNotifications((prev) => [...prev, notification]);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    [],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  const showSuccess = useCallback(
    (title: string, message: string, duration?: number) => {
      addNotification("success", title, message, duration);
    },
    [addNotification],
  );

  const showError = useCallback(
    (title: string, message: string, duration?: number) => {
      addNotification("error", title, message, duration);
    },
    [addNotification],
  );

  const showInfo = useCallback(
    (title: string, message: string, duration?: number) => {
      addNotification("info", title, message, duration);
    },
    [addNotification],
  );

  const contextValues: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={contextValues}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useContext must be used in NotificationProvider");
  }

  return context;
}
