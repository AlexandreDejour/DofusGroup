import { render, screen, fireEvent } from "@testing-library/react";

import type { Notification } from "../../../types/notification";

import NotificationItem from "../NotificationItem";

describe("NotificationItem", () => {
  const mockNotification: Notification = {
    id: "notif-1",
    type: "success",
    title: "Success",
    message: "This is notification",
    isClosing: false,
  };

  it("affiche le titre, le message et l'icône de succès", () => {
    render(
      <NotificationItem notification={mockNotification} onClose={vi.fn()} />,
    );
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("This is notification")).toBeInTheDocument();
    expect(screen.getByText("✅")).toBeInTheDocument();
  });

  it("Display error icon in case of error notification type", () => {
    render(
      <NotificationItem
        notification={{ ...mockNotification, type: "error" }}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("⚠")).toBeInTheDocument();
  });

  it("Display info icon in case of info notification type", () => {
    render(
      <NotificationItem
        notification={{ ...mockNotification, type: "info" }}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("ℹ️")).toBeInTheDocument();
  });

  it("Add --closing class if issClosing is true", () => {
    const { container } = render(
      <NotificationItem
        notification={{ ...mockNotification, isClosing: true }}
        onClose={vi.fn()}
      />,
    );
    expect(container.firstChild).toHaveClass("notification--closing");
  });

  it("Call onClose with correct id when clic on close button", () => {
    const onClose = vi.fn();
    render(
      <NotificationItem notification={mockNotification} onClose={onClose} />,
    );
    const closeBtn = screen.getByRole("button", {
      name: /close notifisation/i,
    });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledWith("notif-1");
  });
});
