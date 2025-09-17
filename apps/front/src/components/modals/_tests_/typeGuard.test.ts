// typeGuard.test.ts
import { describe, it, expect } from "vitest";

import { CharacterEnriched } from "../../../types/character";

import { typeGuard } from "../utils/typeGuard";

describe("typeGuard.characterEnriched", () => {
  const validCharacter: CharacterEnriched = {
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

  it("should return true for a valid CharacterEnriched object", () => {
    expect(typeGuard.characterEnriched(validCharacter)).toBe(true);
  });

  it("should return false if object is null", () => {
    expect(typeGuard.characterEnriched(null)).toBe(false);
  });

  it("should return false if object is not an object", () => {
    expect(typeGuard.characterEnriched("string")).toBe(false);
    expect(typeGuard.characterEnriched(123)).toBe(false);
    expect(typeGuard.characterEnriched(true)).toBe(false);
  });

  it("should return false if required string fields are missing or invalid", () => {
    const invalid = { ...validCharacter, id: 123 as any };
    expect(typeGuard.characterEnriched(invalid)).toBe(false);

    const invalid2 = { ...validCharacter, name: null as any };
    expect(typeGuard.characterEnriched(invalid2)).toBe(false);
  });

  it("should return false if level is not a number", () => {
    const invalid = { ...validCharacter, level: "42" as any };
    expect(typeGuard.characterEnriched(invalid)).toBe(false);
  });

  it("should allow alignment to be null", () => {
    const withNullAlignment = { ...validCharacter, alignment: null };
    expect(typeGuard.characterEnriched(withNullAlignment)).toBe(true);
  });

  it("should allow stuff to be null", () => {
    const withNullStuff = { ...validCharacter, stuff: null };
    expect(typeGuard.characterEnriched(withNullStuff)).toBe(true);
  });

  it("should return false if default_character is not boolean", () => {
    const invalid = { ...validCharacter, default_character: "true" as any };
    expect(typeGuard.characterEnriched(invalid)).toBe(false);
  });

  it("should return false if enriched properties (user, breed, server) are missing", () => {
    const noUser = { ...validCharacter, user: undefined };
    expect(typeGuard.characterEnriched(noUser)).toBe(false);

    const noBreed = { ...validCharacter, breed: undefined };
    expect(typeGuard.characterEnriched(noBreed)).toBe(false);

    const noServer = { ...validCharacter, server: undefined };
    expect(typeGuard.characterEnriched(noServer)).toBe(false);
  });
});
