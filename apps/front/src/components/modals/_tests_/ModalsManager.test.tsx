import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalProvider from "../../../contexts/modalContext";

vi.mock("../../../config/config.ts", () => ({
  Config: {
    getInstance: () => ({
      baseUrl: "http://localhost",
    }),
  },
}));

// Mock useNotification
const showError = vi.fn();
vi.mock("../../../contexts/notificationContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  useNotification: () => ({
    showError,
  }),
}));

// Mock before component import
let mockUseModal: () => any = () => ({
  isOpen: true,
  modalType: "register",
  handleSubmit: vi.fn(),
  closeModal: vi.fn(),
  openModal: vi.fn(),
});

vi.mock("../../../contexts/modalContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  useModal: () => mockUseModal(),
}));

import ModalsManager from "../ModalsManager";
import { EventEnriched } from "../../../types/event";
import { CharacterEnriched } from "../../../types/character";

const FIELD_LABELS: Record<string, string> = {
  mail: "email",
  password: "mot de passe",
  username: "pseudo",
};

function renderModalsManager() {
  return render(
    <ModalProvider>
      <ModalsManager />
    </ModalProvider>,
  );
}

describe("ModalsManager", () => {
  let closeModal: ReturnType<typeof vi.fn>;
  let handleSubmit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    closeModal = vi.fn();
    handleSubmit = vi.fn();

    // Default mock : register form
    mockUseModal = () => ({
      isOpen: true,
      modalType: "register",
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
    });
  });

  it("Display RegisterForm when modalType is 'register'", () => {
    renderModalsManager();
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
  });

  it("Display LoginForm when modalType is 'login'", () => {
    mockUseModal = () => ({
      isOpen: true,
      modalType: "login",
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
    });

    renderModalsManager();
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByText(/Connexion/i)).toBeInTheDocument();
  });

  it.each(Object.entries(FIELD_LABELS))(
    "Display UpdateForm when modalType is '%s'",
    (field, expectedLabel) => {
      mockUseModal = () => ({
        isOpen: true,
        modalType: field,
        handleSubmit,
        closeModal,
        openModal: vi.fn(),
      });

      const { container } = renderModalsManager();

      expect(
        screen.getByRole("heading", {
          level: 3,
          name: new RegExp(`Modifier\\s+${expectedLabel}`, "i"),
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByLabelText(new RegExp(expectedLabel, "i")),
      ).toBeInTheDocument();

      const form = container.querySelector("form");
      expect(form).not.toBeNull();

      if (form) {
        fireEvent.submit(form);
        expect(handleSubmit).toHaveBeenCalled();
      }
    },
  );

  it("Display NewCharacterForm when modalType is 'newCharacter'", () => {
    mockUseModal = () => ({
      isOpen: true,
      modalType: "newCharacter",
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
      updateTarget: null,
    });
    renderModalsManager();
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("Display UpdateCharacterForm when modalType is 'updateCharacter' and target is valid", () => {
    const target: CharacterEnriched = {
      id: "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
      name: "Chronos",
      sex: "M",
      level: 50,
      alignment: "Neutre",
      stuff: "https://d-bk.net/fr/d/1QVjw",
      default_character: false,
      server: {
        id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
        name: "Dakal",
        mono_account: true,
      },
      breed: {
        id: "d81c200e-831c-419a-948f-c45d1bbf6aac",
        name: "Cra",
      },
      events: [],
      user: {
        id: "15ff46b5-60f3-4e86-98bc-da8fcaa3e29e",
        username: "toto",
      },
    };

    mockUseModal = () => ({
      isOpen: true,
      modalType: "updateCharacter",
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
      updateTarget: target,
    });

    renderModalsManager();
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("Display UpdateEventForm when modalType is 'updateEvent' and target is valid", () => {
    const target = {
      id: "05d29664-ca0e-4500-bf06-352384986d95",
      title: "Passage korriandre",
      date: "2025-09-20T09:50:00.000Z",
      duration: 40,
      area: "Île de Frigost",
      sub_area: "Antre du Korriandre",
      donjon_name: "Antre du Korriandre",
      description: "Tu payes, je te fais passer en fast",
      max_players: 8,
      status: "public",
      tag: {
        id: "6f2cf523-18be-470e-99e1-3fea1d91ab4c",
        name: "Donjon",
        color: "#c0392b",
      },
      server: {
        id: "3e354b84-1516-4160-b750-cbe798d7b11e",
        name: "Salar",
        mono_account: false,
      },
      comments: [],
      characters: [
        {
          id: "a5c8f77a-2b7d-4a45-87e2-fae117936829",
          name: "gniouf",
          sex: "M",
          level: 2,
          alignment: "Neutre",
          stuff: null,
          default_character: false,
          user: {
            id: "3d2ebbe3-8193-448c-bec8-8993e7055240",
            username: "totolebeau",
          },
          breed: {
            id: "bd0783a6-8012-4724-8319-42e2349b88a4",
            name: "Ecaflip",
          },
          server: {
            id: "73b70f36-b546-4ee4-95ce-9bbc4adb67df",
            name: "Brial",
            mono_account: false,
          },
        },
      ],
      user: {
        id: "3d2ebbe3-8193-448c-bec8-8993e7055240",
        username: "totolebeau",
      },
    };

    mockUseModal = () => ({
      isOpen: true,
      modalType: "updateEvent",
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
      updateTarget: target,
    });

    renderModalsManager();
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("Display close button", () => {
    renderModalsManager();
    expect(screen.getByLabelText(/Close modal/i)).toBeInTheDocument();
  });

  it("Close modal when user click on background", () => {
    renderModalsManager();
    fireEvent.click(screen.getByRole("dialog"));
    expect(closeModal).toHaveBeenCalled();
  });

  it("Don't close modal when user click on content", () => {
    renderModalsManager();
    fireEvent.click(screen.getByText(/Inscription/i));
    expect(closeModal).not.toHaveBeenCalled();
  });

  it("Display nothing if isOpen is false", () => {
    mockUseModal = () => ({
      isOpen: false,
      modalType: "register",
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
    });

    const { container } = renderModalsManager();
    expect(container.firstChild).toBeNull();
  });

  it("Display nothing if modalType is null", () => {
    mockUseModal = () => ({
      isOpen: true,
      modalType: null,
      handleSubmit,
      closeModal,
      openModal: vi.fn(),
    });

    const { container } = renderModalsManager();
    expect(container.firstChild).toBeNull();
  });
});
