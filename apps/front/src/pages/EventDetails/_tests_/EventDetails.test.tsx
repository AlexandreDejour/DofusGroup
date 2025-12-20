import { Dispatch, SetStateAction } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, vi, beforeEach, afterEach, Mock } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

import { EventEnriched } from "../../../types/event";

import { t } from "../../../i18n/i18n-helper";

import EventDetails from "../EventDetails";

// Mock react-router
const navigateMock = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
    Navigate: ({ to }: { to: string }) => {
      navigateMock(to);
      return null;
    },
    useParams: () => ({ id: "evt-1" }),
  };
});

// Mock contexts
vi.mock("../../../contexts/authContext", () => ({
  useAuth: () => ({
    user: { id: "9c63878b-4763-4de7-ac1e-d1ada9fc0159", username: "toto" },
  }),
}));

const openModal = vi.fn();
const handleDelete = vi.fn();
vi.mock("../../../contexts/modalContext", () => ({
  useModal: () => ({
    openModal,
    handleDelete,
    updateTarget: vi.fn(),
  }),
}));

const showSuccess = vi.fn();
const showError = vi.fn();
vi.mock("../../../contexts/notificationContext", () => ({
  useNotification: () => ({
    showSuccess,
    showError,
  }),
}));

// Mock hooks
vi.mock("../../../hooks/useFetchEvent", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("../../../hooks/useCharacterRemover", () => ({
  __esModule: true,
  default: vi.fn(),
}));

import useFetchEvent from "../../../hooks/useFetchEvent";
import useCharacterRemover from "../../../hooks/useCharacterRemover";

// Mock event data
const mockEvent = {
  id: "55c4e602-e91f-4cda-8abe-a5458717dd7e",
  title: "titre test",
  tag: {
    id: "3e6cc90a-9665-4646-9952-2aa953dd0e44",
    name: "Donjon",
    color: "#0000",
  },
  server: {
    id: "ea36c49d-7b90-47df-b378-e487f6f78e7f",
    name: "Djaul",
    mono_account: true,
  },
  date: new Date("2025-10-26T10:00"),
  duration: 120,
  area: "Amakna",
  sub_area: "Forêt d’Amakna",
  donjon_name: "Donjon Corbac",
  max_players: 8,
  description: "Description test",
  status: "public",
  characters: [],
  comments: [],
  user: { id: "9c63878b-4763-4de7-ac1e-d1ada9fc0159", username: "toto" },
};

function renderWithRouter() {
  const removeCharacterMock = vi.fn();
  return render(
    <MemoryRouter initialEntries={["/event/evt-1"]}>
      <Routes>
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/not-found" element={<p>Not Found Page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("EventDetails", () => {
  beforeEach(() => {
    (useFetchEvent as unknown as Mock).mockImplementation(
      (
        id: string,
        setEvent: Dispatch<SetStateAction<EventEnriched | null>>,
      ) => {
        // simulate useEffect
        Promise.resolve().then(() => {
          setEvent(mockEvent);
        });

        return {
          isLoading: false,
          error: null,
        };
      },
    );

    const removeCharacterMock = vi.fn();
    (useCharacterRemover as unknown as Mock).mockImplementation(
      () => removeCharacterMock,
    );

    openModal.mockClear();
    handleDelete.mockClear();
    navigateMock.mockClear();
    showSuccess.mockClear();
    showError.mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("Displays spinner when loading", () => {
    (useFetchEvent as unknown as Mock).mockImplementation(() => ({
      isLoading: true,
      error: null,
    }));

    renderWithRouter();
    expect(screen.getByLabelText("Loading Spinner")).toBeInTheDocument();
  });

  it("Renders event details after fetch", async () => {
    renderWithRouter();
    await waitFor(() => screen.getByText(/titre test/i));

    expect(
      screen.getByText(`${t("common.createdBy")} toto`),
    ).toBeInTheDocument();
    expect(screen.getByText(/Djaul/i)).toBeInTheDocument();
    expect(screen.getByText(/forêt d’amakna/i)).toBeInTheDocument();
    expect(screen.getByText(/donjon corbac/i)).toBeInTheDocument();
    expect(screen.getByText(/description test/i)).toBeInTheDocument();
  });

  it("Shows action buttons if user owns the event", async () => {
    renderWithRouter();
    await waitFor(() => screen.getByText(/titre test/i));

    expect(
      screen.getByRole("button", { name: t("common.change") }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: t("common.delete.default") }),
    ).toBeInTheDocument();
  });

  it("Calls openModal when clicking Modifier", async () => {
    renderWithRouter();
    await waitFor(() => screen.getByText(/titre test/i));

    fireEvent.click(screen.getByRole("button", { name: t("common.change") }));
    expect(openModal).toHaveBeenCalledWith("updateEvent", mockEvent);
  });

  it("Calls handleDelete when clicking Supprimer", async () => {
    renderWithRouter();
    await waitFor(() => screen.getByText(/titre test/i));

    fireEvent.click(
      screen.getByRole("button", { name: t("common.delete.default") }),
    );
    expect(handleDelete).toHaveBeenCalledWith("event_details", mockEvent.id);
  });

  it("Calls openModal when clicking Rejoindre", async () => {
    renderWithRouter();
    await waitFor(() => screen.getByText(/titre test/i));

    const joinButtons = screen.getAllByRole("button", {
      name: t("common.join"),
    });
    fireEvent.click(joinButtons[0]);
    expect(openModal).toHaveBeenCalledWith("joinEvent", mockEvent);
  });

  it("Navigates back when clicking Retour", async () => {
    renderWithRouter();
    await waitFor(() => screen.getByText(/titre test/i));

    fireEvent.click(screen.getByRole("button", { name: t("common.return") }));
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it("Navigates to /not-found if event is null", async () => {
    (useFetchEvent as unknown as Mock).mockImplementation(() => ({
      event: null,
      isLoading: true,
    }));

    renderWithRouter();
    await waitFor(() => {
      expect(screen.queryByText(/titre test/i)).not.toBeInTheDocument();
    });
  });
});
