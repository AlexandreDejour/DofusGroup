import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";

import Pagination from "../Pagination";

vi.mock("../utils/getVisiblePages", () => ({
  __esModule: true,
  default: (
    currentPage: number,
    totalPages: number,
    maxVisiblePages: number,
  ) => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  },
}));

const renderPagination = ({
  totalPages = 5,
  currentPage = 1,
  maxVisiblePages = 5,
  onPageChange = vi.fn(),
} = {}) => {
  render(
    <MemoryRouter>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        maxVisiblePages={maxVisiblePages}
        onPageChange={onPageChange}
      />
    </MemoryRouter>,
  );
  return { onPageChange };
};

describe("Pagination", () => {
  it("Display right pages number", () => {
    renderPagination({ totalPages: 5 });
    expect(screen.getAllByRole("button")).toHaveLength(5);
  });

  it("Display active page with right properties", () => {
    renderPagination({ totalPages: 5, currentPage: 3 });
    const activeButton = screen.getByRole("button", { name: "To page 3" });
    const liElement = activeButton.closest("li");
    expect(liElement).toHaveClass("active");
  });

  it("Call onPageChange with the right page number on click", () => {
    const { onPageChange } = renderPagination({ totalPages: 5 });
    const page2 = screen.getByText("2");
    fireEvent.click(page2);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("Buttons contains right properties", () => {
    renderPagination({ totalPages: 3 });
    expect(screen.getByText("1")).toHaveAttribute("aria-label", "To page 1");
    expect(screen.getByText("2")).toHaveAttribute("aria-label", "To page 2");
    expect(screen.getByText("3")).toHaveAttribute("aria-label", "To page 3");
  });

  it("Work with different totalPages and current pages", () => {
    renderPagination({ totalPages: 7, currentPage: 5 });
    const activeButton = screen.getByRole("button", { name: "To page 5" });
    const liElement = activeButton.closest("li");
    expect(liElement).toHaveClass("active");
    expect(screen.getAllByRole("button")).toHaveLength(7);
  });
});
