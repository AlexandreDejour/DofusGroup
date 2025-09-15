import { describe, it, expect, vi } from "vitest";
import formatDateToLocalInput from "../utils/formatDateToLocalInput";

describe("formatDateToLocalInput", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Should format simple UTC date", () => {
    const date = new Date("2023-05-10T12:34:56Z");
    const result = formatDateToLocalInput(date);

    // Ouput must respect YYYY-MM-DDTHH:mm format
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it("Should balance positive jetlag (ex: UTC+2)", () => {
    const date = new Date("2023-05-10T12:00:00Z");

    // Mock navigator with -120 minutes (UTC+2) offset
    vi.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(-120);

    const result = formatDateToLocalInput(date);

    expect(result).toBe("2023-05-10T14:00");
  });

  it("Should balance negative jetlag (ex: UTC-5)", () => {
    const date = new Date("2023-05-10T12:00:00Z");

    // Mock navigator with +300 minutes (UTC-5) offset
    vi.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(300);

    const result = formatDateToLocalInput(date);

    expect(result).toBe("2023-05-10T07:00");
  });

  it("Should keep precision to minutes and troncate seconds", () => {
    const date = new Date("2023-05-10T12:34:56.789Z");
    vi.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(0);

    const result = formatDateToLocalInput(date);

    expect(result).toBe("2023-05-10T12:34");
  });

  it("Should work for a date far in the future", () => {
    const date = new Date("2999-12-31T23:59:59Z");
    vi.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(0);

    const result = formatDateToLocalInput(date);

    expect(result).toBe("2999-12-31T23:59");
  });
});
