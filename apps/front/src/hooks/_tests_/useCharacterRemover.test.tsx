import { vi } from "vitest";
import { render } from "@testing-library/react";

import useCharacterRemover from "../useCharacterRemover";

const showError = vi.fn();
const showSuccess = vi.fn();

vi.mock("../../contexts/notificationContext", () => ({
  useNotification: () => ({
    showSuccess,
    showError,
  }),
}));

vi.mock("../../i18n/i18n-helper", () => ({
  useTypedTranslation: () => (key: string) => key,
}));

// Helpers
function setupHook(event: any, setEvent: any, service: any) {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useCharacterRemover(event, setEvent, service);
    return null;
  }

  render(<TestComponent />);
  return ref;
}

describe("useCharacterRemover hook", () => {
  const setEvent = vi.fn();
  const event = {
    id: "event-1",
    title: "Test Event",
    characters: [{ id: "char-1", name: "Test Character" }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should remove character and show success message", async () => {
    const mockService = {
      removeCharacter: vi.fn().mockResolvedValue(event),
    };

    const result = setupHook(event, setEvent, mockService);

    await result.current(event.id, "char-1");

    expect(mockService.removeCharacter).toHaveBeenCalledWith(
      event.id,
      "char-1",
    );
    expect(setEvent).toHaveBeenCalledWith(event);
    expect(showSuccess).toHaveBeenCalledWith(
      "system.success.deleted",
      "event.error.characterOut",
    );
  });

  it("should show error message on failure", async () => {
    const errorMessage = "Error removing character";

    const mockService = {
      removeCharacter: vi.fn().mockRejectedValue(new Error(errorMessage)),
    };

    const result = setupHook(event, setEvent, mockService);

    await result.current(event.id, "char-1");

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      errorMessage,
    );
  });

  it("should show generic error message when rejection is not an Error", async () => {
    const mockService = {
      removeCharacter: vi.fn().mockRejectedValue("boom"),
    };

    const result = setupHook(event, setEvent, mockService);

    await result.current(event.id, "char-1");

    expect(showError).toHaveBeenCalledWith(
      "system.error.default",
      "system.error.occurred",
    );
  });
});
