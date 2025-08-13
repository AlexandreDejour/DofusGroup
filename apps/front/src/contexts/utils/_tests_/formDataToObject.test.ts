import { describe, it, expect, vi } from "vitest";

vi.mock("dompurify", () => {
  return {
    default: {
      sanitize: vi.fn((x: string) => x),
    },
  };
});

import DOMPurify from "dompurify";

import formDataToObject from "../formDataToObject";

interface TestForm {
  username: string;
  email: string;
  password: string;
  [key: string]: string;
}

describe("formDataToObject", () => {
  const sanitizeMock = vi.spyOn(DOMPurify, "sanitize");

  it("Convert formData as object", () => {
    const formData = new FormData();
    formData.append("username", "Alice");
    formData.append("email", "alice@example.com");
    formData.append("password", "secret");

    const keys: (keyof TestForm)[] = ["username", "email", "password"];
    const result = formDataToObject<TestForm>(formData, keys);

    expect(result).toEqual({
      username: "Alice",
      email: "alice@example.com",
      password: "secret",
    });
  });

  it("Call DOMPurify.sanitize for each values", () => {
    const formData = new FormData();
    formData.append("username", "<script>alert('xss')</script>");
    formData.append("email", "bob@example.com");
    formData.append("password", "secret");

    const keys: (keyof TestForm)[] = ["username", "email", "password"];
    formDataToObject<TestForm>(formData, keys);

    expect(sanitizeMock).toHaveBeenCalledWith("<script>alert('xss')</script>");
    expect(sanitizeMock).toHaveBeenCalledWith("bob@example.com");
    expect(sanitizeMock).toHaveBeenCalledWith("secret");
  });

  it("Return empty string for empty keys", () => {
    const formData = new FormData();
    formData.append("username", "Charlie");

    const keys: (keyof TestForm)[] = ["username", "email", "password"];
    const result = formDataToObject<TestForm>(formData, keys);

    expect(result).toEqual({
      username: "Charlie",
      email: "",
      password: "",
    });
  });
});
