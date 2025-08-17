import { describe, it, expect } from "vitest";
import getVisiblePages from "../utils/getVisiblePages";

describe("getVisiblePages", () => {
  it("returns correct pages when totalPages > maxVisiblePages and currentPage in middle", () => {
    expect(getVisiblePages(5, 10, 5)).toEqual([3, 4, 5, 6, 7]);
  });

  it("returns correct pages when currentPage near start", () => {
    expect(getVisiblePages(1, 10, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getVisiblePages(2, 10, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns correct pages when currentPage near end", () => {
    expect(getVisiblePages(10, 10, 5)).toEqual([6, 7, 8, 9, 10]);
    expect(getVisiblePages(9, 10, 5)).toEqual([6, 7, 8, 9, 10]);
  });

  it("returns all pages if totalPages < maxVisiblePages", () => {
    expect(getVisiblePages(1, 3, 5)).toEqual([1, 2, 3]);
    expect(getVisiblePages(2, 3, 5)).toEqual([1, 2, 3]);
  });

  it("returns single page if totalPages = 1", () => {
    expect(getVisiblePages(1, 1, 5)).toEqual([1]);
  });

  it("handles even maxVisiblePages correctly", () => {
    expect(getVisiblePages(4, 10, 4)).toEqual([3, 4, 5, 6]);
  });

  it("handles maxVisiblePages = 1", () => {
    expect(getVisiblePages(5, 10, 1)).toEqual([5]);
  });
});
