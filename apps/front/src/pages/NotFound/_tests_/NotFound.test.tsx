import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { t } from "../../../i18n/i18n-helper";

import NotFound from "../NotFound";

// Mock react-router
const navigateMock = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("NotFound page", () => {
  it("Display element and redirect on click", () => {
    render(<NotFound />);

    expect(screen.getByText("404 - NOT FOUND")).toBeInTheDocument();

    expect(
      screen.getByText(`${t("system.error.notFound")}`),
    ).toBeInTheDocument();

    const button = screen.getByRole("button", { name: `${t("common.home")}` });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
