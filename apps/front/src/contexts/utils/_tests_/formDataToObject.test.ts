import { describe, it, expect, vi } from "vitest";
import DOMPurify from "dompurify";
import formDataToObject from "../formDataToObject";

vi.mock("dompurify", () => ({
  default: {
    sanitize: vi.fn((x: string) => x),
  },
}));

describe("formDataToObject", () => {
  const sanitizeMock = vi.spyOn(DOMPurify, "sanitize");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should convert FormData to a plain object with string values", () => {
    const formData = new FormData();
    formData.append("username", "Alice");
    formData.append("email", "alice@example.com");

    const keys = ["username", "email"];
    const result = formDataToObject(formData, { keys });

    expect(result).toEqual({
      username: "Alice",
      email: "alice@example.com",
    });
    expect(sanitizeMock).toHaveBeenCalledTimes(2);
  });

  it("should convert boolean keys correctly based on presence", () => {
    const formData = new FormData();
    formData.append("is_active", "true");
    const keys = ["is_active", "is_admin"];
    const booleanKeys = ["is_active", "is_admin"];

    const result = formDataToObject(formData, { keys, booleanKeys });

    expect(result).toEqual({
      is_active: true,
      is_admin: false,
    });
    expect(sanitizeMock).not.toHaveBeenCalled();
  });

  it("should convert number keys correctly and sanitize values", () => {
    const formData = new FormData();
    formData.append("age", "30");
    const keys = ["age"];
    const numberKeys = ["age"];

    const result = formDataToObject(formData, { keys, numberKeys });

    expect(result).toEqual({
      age: 30,
    });
    expect(sanitizeMock).toHaveBeenCalledWith("30");
  });

  it("should convert date keys correctly and sanitize values", () => {
    const formData = new FormData();
    const dateString = "2023-10-27T10:00:00.000Z";
    formData.append("event_date", dateString);
    const keys = ["event_date"];
    const dateKeys = ["event_date"];

    const result = formDataToObject(formData, { keys, dateKeys });

    expect(result).toEqual({
      event_date: new Date(dateString),
    });
    expect(sanitizeMock).toHaveBeenCalledWith(dateString);
  });

  it("should convert array keys correctly and filter empty values", () => {
    const formData = new FormData();
    formData.append("tags", "tag1");
    formData.append("tags", "tag2");
    formData.append("tags", "");
    const keys = ["tags"];
    const arrayKeys = ["tags"];

    const result = formDataToObject(formData, { keys, arrayKeys });

    expect(result).toEqual({
      tags: ["tag1", "tag2"],
    });
    expect(sanitizeMock).toHaveBeenCalledTimes(3);
    expect(sanitizeMock).toHaveBeenCalledWith("tag1");
    expect(sanitizeMock).toHaveBeenCalledWith("tag2");
    expect(sanitizeMock).toHaveBeenCalledWith("");
  });

  it("should return empty strings for keys not present in FormData", () => {
    const formData = new FormData();
    formData.append("username", "Charlie");

    const keys = ["username", "email"];
    const result = formDataToObject(formData, { keys });

    expect(result).toEqual({
      username: "Charlie",
    });
    expect(sanitizeMock).toHaveBeenCalledTimes(1);
    expect(sanitizeMock).toHaveBeenCalledWith("Charlie");
  });

  it("should handle multiple types of conversions in a single call", () => {
    const formData = new FormData();
    formData.append("name", "Test User");
    formData.append("is_active", "on");
    formData.append("age", "45");
    formData.append("start_date", "2024-01-01");
    formData.append("roles", "admin");
    formData.append("roles", "editor");

    const keys = [
      "name",
      "is_active",
      "age",
      "start_date",
      "roles",
      "not_present",
    ];
    const booleanKeys = ["is_active"];
    const numberKeys = ["age"];
    const dateKeys = ["start_date"];
    const arrayKeys = ["roles"];

    const result = formDataToObject(formData, {
      keys,
      booleanKeys,
      numberKeys,
      dateKeys,
      arrayKeys,
    });

    expect(result).toEqual({
      name: "Test User",
      is_active: true,
      age: 45,
      start_date: new Date("2024-01-01"),
      roles: ["admin", "editor"],
    });

    expect(sanitizeMock).toHaveBeenCalledTimes(5);
    expect(sanitizeMock).toHaveBeenCalledWith("Test User");
    expect(sanitizeMock).toHaveBeenCalledWith("45");
    expect(sanitizeMock).toHaveBeenCalledWith("2024-01-01");
    expect(sanitizeMock).toHaveBeenCalledWith("admin");
    expect(sanitizeMock).toHaveBeenCalledWith("editor");
  });
});
