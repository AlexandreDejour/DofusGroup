import { describe, it, expect } from "vitest";
import isUpdateField from "../utils/isUpdateField";

describe("isUpdateField", () => {
  it("Return true for 'mail'", () => {
    expect(isUpdateField("mail")).toBe(true);
  });

  it("Return true for 'password'", () => {
    expect(isUpdateField("password")).toBe(true);
  });

  it("Return true for 'username'", () => {
    expect(isUpdateField("username")).toBe(true);
  });

  it("Return false for unknown value", () => {
    expect(isUpdateField("random" as any)).toBe(false);
  });

  it("Return false for empty value", () => {
    expect(isUpdateField("" as any)).toBe(false);
  });

  it("Return false for non string type", () => {
    expect(isUpdateField(123 as any)).toBe(false);
    expect(isUpdateField(null as any)).toBe(false);
    expect(isUpdateField(undefined as any)).toBe(false);
  });
});
