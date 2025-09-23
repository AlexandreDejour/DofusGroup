import "./NotificationItem.scss";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { Notification } from "../../types/notification";

interface NotificationItemProps {
  notification: Notification;
  onClose: (id: string) => void;
}

export default function NotificationItem({
  notification,
  onClose,
}: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return "✅";
      case "error":
        return "⚠";
      case "info":
        return "ℹ️";
      default:
        return "ℹ️";
    }
  };

  return (
    <div
      className={`notification ${
        notification.isClosing ? "notification--closing" : ""
      } notification--${notification.type}`}
    >
      <div className="notification__content">
        <div className="notification__header">
          <span className="notification__icon">{getIcon()}</span>
          <h4 className="notification__title">{notification.title}</h4>
        </div>
        <p className="notification__message">{notification.message}</p>
      </div>
      <button
        className="notification__close"
        onClick={() => onClose(notification.id)}
        aria-label="Close notifisation"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}
