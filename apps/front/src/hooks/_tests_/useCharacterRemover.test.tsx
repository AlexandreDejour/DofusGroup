import { vi } from "vitest";
import { render } from "@testing-library/react";

import useCharacterRemover from "../useCharacterRemover";

const showError = vi.fn();
const showSuccess = vi.fn();

vi.mock("../../../../contexts/notificationContext", () => ({
  useNotification: () => ({
    showSuccess,
    showError,
  }),
}));

let mockRemoveCharacter: any;

vi.mock("../../../../services/api/eventService", () => {
  return {
    EventService: vi.fn().mockImplementation(() => ({
      removeCharacter: (...args: any[]) => mockRemoveCharacter(...args),
    })),
  };
});

function setupHook(event: any, setEvent: any) {
  const ref = { current: null as any };

  function TestComponent() {
    ref.current = useCharacterRemover(event, setEvent);
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
    mockRemoveCharacter = vi.fn().mockResolvedValue(event); // Mock successful response

    const result = setupHook(event, setEvent);

    await result.current(event.id, "char-1");

    expect(mockRemoveCharacter).toHaveBeenCalledWith(event.id, "char-1");
    expect(setEvent).toHaveBeenCalledWith(event);
    expect(showSuccess).toHaveBeenCalledWith(
      "Deletion successful !",
      "This character is no longer part of the event.",
    );
  });

  it("should show error message on failure", async () => {
    const errorMessage = "Error removing character";
    mockRemoveCharacter = vi.fn().mockRejectedValue(new Error(errorMessage)); // Mock error response

    const result = setupHook(event, setEvent);

    await result.current(event.id, "char-1");

    expect(showError).toHaveBeenCalledWith("Error", errorMessage);
  });
});
