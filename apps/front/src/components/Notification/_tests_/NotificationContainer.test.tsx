import { render, screen, fireEvent, within } from "@testing-library/react";

import { Notification } from "../../../types/notification";

import NotificationContainer from "../NotificationContainer";

// Variable pour rendre le mock dynamique
let notificationsMock: Notification[] = [];
let removeNotificationMock = vi.fn();

vi.mock("../../../contexts/notificationContext", () => ({
  useNotification: () => ({
    notifications: notificationsMock,
    removeNotification: removeNotificationMock,
  }),
}));

vi.mock("../NotificationItem", () => ({
  __esModule: true,
  default: ({ notification, onClose }: any) => (
    <div data-testid={`notification-${notification.id}`}>
      {notification.message}
      <button onClick={() => onClose(notification.id)}>close</button>
    </div>
  ),
}));

describe("NotificationContainer", () => {
  beforeEach(() => {
    removeNotificationMock = vi.fn();
    notificationsMock = [
      {
        id: "1",
        type: "success",
        title: "Test",
        message: "notification test.",
      },
      { id: "2", type: "error", title: "Error", message: "Unknown error !" },
    ];
  });

  it("Display nothing if notifications is empty", () => {
    notificationsMock = [];
    const { container } = render(<NotificationContainer />);
    expect(container.firstChild).toBeNull();
  });

  it("Display all notifications", () => {
    render(<NotificationContainer />);
    expect(screen.getByTestId("notification-1")).toHaveTextContent(
      "notification test",
    );
    expect(screen.getByTestId("notification-2")).toHaveTextContent(
      "Unknown error !",
    );
  });

  it("Call removeNotification when click on close button", () => {
    render(<NotificationContainer />);
    const notif1 = screen.getByTestId("notification-1");
    const closeBtn = within(notif1).getByText("close");
    fireEvent.click(closeBtn);
    expect(removeNotificationMock).toHaveBeenCalledWith("1");
  });
});
