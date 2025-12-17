import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { t } from "../../../../i18n/i18n-helper";
import UpdateEventForm from "../UpdateEventForm/UpdateEventForm";

// ─────────────────────────────────────────────
// Mocks
// ─────────────────────────────────────────────

// i18n
vi.mock("../../../../i18n/i18n-helper", () => ({
  useTypedTranslation: () => (k: string) => k,
  t: (k: string) => k,
}));

// Utils
vi.mock("../../utils/formatDateToLocalInput", () => ({
  __esModule: true,
  default: () => "2025-12-24T20:00",
}));

// Hooks
vi.mock("../../../../hooks/useFetchTags", () => ({
  __esModule: true,
  default: () => ({
    tags: [{ id: "tag-1", label: "Donjon" }],
  }),
}));

vi.mock("../../../../hooks/useFetchAreas", () => ({
  __esModule: true,
  default: () => ({
    areas: [{ id: "a-1", name: "Amakna" }],
  }),
}));

vi.mock("../../../../hooks/useFetchSubAreas", () => ({
  __esModule: true,
  default: (_areas: any, area: string) => ({
    subAreas: area ? [{ id: "sa-1", name: "Coin des bouftous" }] : [],
  }),
}));

// useFetchDungeons doit retourner dungeons et isDungeon
let mockIsDungeon = true;
vi.mock("../../../../hooks/useFetchDungeons", () => ({
  __esModule: true,
  default: (
    _tags: any,
    _tag: string,
    _areas: any,
    _area: string,
    _subAreas: any,
    _subArea: string,
  ) => ({
    dungeons: [{ id: "d-1", name: "Donjon Bouftou" }],
    isDungeon: mockIsDungeon,
  }),
}));

// SelectOptions mock
vi.mock("../../formComponents/Options/SelectOptions", () => ({
  __esModule: true,
  default: ({ items, label, value, onChange }: any) => (
    <div data-testid={`select-${label}`}>
      {items?.map((it: any) => (
        <button
          key={it.id}
          data-testid={`option-${label}-${it.id}`}
          onClick={() => onChange(it.value ?? it.id)}
        >
          {it.name ?? it.label}
        </button>
      ))}
      <input
        aria-label={`hidden-${label}`}
        value={value ?? ""}
        readOnly
        style={{ display: "none" }}
      />
    </div>
  ),
}));

// ─────────────────────────────────────────────
// Test data
// ─────────────────────────────────────────────

const updateTarget = {
  id: "evt-1",
  title: "Event test",
  description: "Description test",
  date: "2025-12-24T19:00:00Z",
  duration: 60,
  max_players: 8,
  status: "public",
  donjon_name: "Donjon Bouftou",
  area: "a-1",
  sub_area: "sa-1",
  tag: { id: "tag-1", label: "Donjon" },
  server: { id: "srv-1", name: "Salar" },
};

// ─────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────

describe("UpdateEventForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Display all fields with prefilled values and dungeons select if isDungeon=true", async () => {
    render(
      <UpdateEventForm
        updateTarget={updateTarget as any}
        handleSubmit={() => {}}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: t("event.modification"),
      }),
    ).toBeInTheDocument();

    expect(screen.getByDisplayValue(updateTarget.title)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(updateTarget.description),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(updateTarget.duration.toString()),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(updateTarget.max_players.toString()),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue("2025-12-24T20:00")).toBeInTheDocument();
    });

    // Dungeon field is rendered because isDungeon = true
    expect(screen.getByTestId("select-common.dungeon")).toBeInTheDocument();
  });

  it("Do not display dungeon select if isDungeon=false", () => {
    // change value before render
    mockIsDungeon = false;

    render(
      <UpdateEventForm
        updateTarget={updateTarget as any}
        handleSubmit={() => {}}
      />,
    );

    expect(
      screen.queryByTestId("select-common.dungeon"),
    ).not.toBeInTheDocument();

    // reset value for other tests
    mockIsDungeon = true;
  });

  it("Permit to update title, date and duration", () => {
    render(
      <UpdateEventForm
        updateTarget={updateTarget as any}
        handleSubmit={() => {}}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(t("common.title")), {
      target: { value: "New title" },
    });
    fireEvent.change(screen.getByLabelText("date-input"), {
      target: { value: "2026-01-01T18:00" },
    });

    fireEvent.change(screen.getByPlaceholderText(t("common.durationInMin")), {
      target: { value: "120" },
    });

    expect(screen.getByDisplayValue("New title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2026-01-01T18:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("120")).toBeInTheDocument();
  });

  it("Permit to change tag, area and subArea", async () => {
    render(
      <UpdateEventForm
        updateTarget={updateTarget as any}
        handleSubmit={() => {}}
      />,
    );

    fireEvent.click(screen.getByTestId(`option-tag.default-tag-1`));
    fireEvent.click(screen.getByTestId(`option-common.area-a-1`));

    await waitFor(() => {
      expect(
        screen.getByTestId(`option-common.subArea-sa-1`),
      ).toBeInTheDocument();
    });
  });

  it("Permit to change visibility status", () => {
    render(
      <UpdateEventForm
        updateTarget={updateTarget as any}
        handleSubmit={() => {}}
      />,
    );

    fireEvent.click(screen.getByTestId(`option-common.visibility-1`));
    expect(screen.getByLabelText(`hidden-common.visibility`)).toHaveValue(
      "private",
    );
  });

  it("Submit form by calling handleSubmit", () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    render(
      <UpdateEventForm
        updateTarget={updateTarget as any}
        handleSubmit={handleSubmit}
      />,
    );

    fireEvent.submit(screen.getByRole("form"));
    expect(handleSubmit).toHaveBeenCalled();
  });
});
