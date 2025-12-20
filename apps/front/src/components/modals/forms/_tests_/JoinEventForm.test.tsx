import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import JoinEventForm from "../JoinEventForm/JoinEventForm";

// -------------------------
// Mocks
// -------------------------

// i18n
vi.mock("../../../../i18n/i18n-helper", () => ({
  useTypedTranslation: () => (key: string) => key,
}));

// authContext
vi.mock("../../../../contexts/authContext", () => ({
  __esModule: true,
  useAuth: vi.fn(() => ({
    user: { id: "user-1", username: "toto" },
    setUser: vi.fn(),
    isAuthLoading: false,
    logout: vi.fn(),
  })),
}));

// modalContext
const mockUpdateTarget = { id: "evt-1", title: "Event test" };
vi.mock("../../../../contexts/modalContext", () => ({
  __esModule: true,
  useModal: () => ({
    updateTarget: mockUpdateTarget,
  }),
}));

// typeGuardq
vi.mock("../../utils/typeGuard", () => ({
  typeGuard: { eventEnriched: (_: any) => true },
}));

// CharactersCheckbox
vi.mock("../../formComponents/Checkbox/CharactersCheckbox", () => ({
  __esModule: true,
  default: ({ characters }: any) => (
    <div data-testid="characters-checkbox">{characters.length}</div>
  ),
}));

// useFetchUserCharactersEnriched
vi.mock("../../../../hooks/useFetchUserCharactersEnriched", () => ({
  __esModule: true,
  default: (_user: any, _event: any) => ({
    characters: [{ id: "char-1", name: "Chronos" }],
  }),
}));

import { useAuth } from "../../../../contexts/authContext";

describe("JoinEventForm", () => {
  const handleSubmitMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with characters checkbox if user & event exist", () => {
    render(<JoinEventForm handleSubmit={handleSubmitMock} />);

    // Maintenant le formulaire doit exister
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();

    const checkbox = screen.getByTestId("characters-checkbox");
    expect(checkbox).toHaveTextContent("1");

    const submitButton = screen.getByRole("button", { name: "common.join" });
    expect(submitButton).toBeInTheDocument();
  });

  it("renders null if no user", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      setUser: vi.fn(),
      isLoading: false,
      logout: vi.fn(),
    });

    render(<JoinEventForm handleSubmit={handleSubmitMock} />);
    expect(screen.queryByRole("form")).toBeNull();
  });

  it("renders null if no event", () => {
    // override useModal pour ce test
    vi.doMock("../../../../contexts/modalContext", () => ({
      __esModule: true,
      useModal: () => ({
        updateTarget: null,
      }),
    }));

    render(<JoinEventForm handleSubmit={handleSubmitMock} />);
    expect(screen.queryByRole("form")).toBeNull();
  });
});
