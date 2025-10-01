// typeGuard.test.ts
import { describe, it, expect } from "vitest";

import { CharacterEnriched } from "../../../../types/character";

import { typeGuard } from "../typeGuard";

describe("typeGuard.characterEnriched", () => {
  const validCharacter: CharacterEnriched = {
    id: "cfff40b3-9625-4f0a-854b-d8d6d6b4b667",
    name: "Chronos",
    sex: "M",
    level: 50,
    alignment: "Neutre",
    stuff: "https://d-bk.net/fr/d/1QVjw",
    default_character: false,
    server_id: "de5a6c69-bc0b-496c-9b62-bd7ea076b8ed",
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

describe("typeGuard.eventEnriched", () => {
  const validEvent = {
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

  it("should return true for a valid EventEnriched object", () => {
    expect(typeGuard.eventEnriched(validEvent)).toBe(true);
  });

  it("should return false if object is null or not an object", () => {
    expect(typeGuard.eventEnriched(null)).toBe(false);
    expect(typeGuard.eventEnriched("string")).toBe(false);
  });

  it("should return false if required string fields are missing", () => {
    const invalid = { ...validEvent, id: null as any };
    expect(typeGuard.eventEnriched(invalid)).toBe(false);

    const invalid2 = { ...validEvent, title: null as any };
    expect(typeGuard.eventEnriched(invalid2)).toBe(false);
  });

  it("should allow optional string fields to be null", () => {
    const eventWithNulls = {
      ...validEvent,
      area: null,
      sub_area: null,
      donjon_name: null,
      description: null,
    };
    expect(typeGuard.eventEnriched(eventWithNulls)).toBe(true);
  });

  it("should return false if max_players or duration are not numbers", () => {
    const invalid = { ...validEvent, max_players: "8" as any };
    expect(typeGuard.eventEnriched(invalid)).toBe(false);

    const invalid2 = { ...validEvent, duration: "120" as any };
    expect(typeGuard.eventEnriched(invalid2)).toBe(false);
  });

  it("should return false if enriched properties (tag, server, characters, comments, user) are missing", () => {
    const noTag = { ...validEvent, tag: undefined };
    expect(typeGuard.eventEnriched(noTag)).toBe(false);

    const noServer = { ...validEvent, server: undefined };
    expect(typeGuard.eventEnriched(noServer)).toBe(false);

    const noCharacters = { ...validEvent, characters: undefined };
    expect(typeGuard.eventEnriched(noCharacters)).toBe(false);

    const noComments = { ...validEvent, comments: undefined };
    expect(typeGuard.eventEnriched(noComments)).toBe(false);

    const noUser = { ...validEvent, user: undefined };
    expect(typeGuard.eventEnriched(noUser)).toBe(false);
  });

  describe("typeGuard.isDate", () => {
    it("should return true for Date instances", () => {
      expect(typeGuard.isDate(new Date())).toBe(true);
      expect(typeGuard.isDate(new Date("2030-01-01"))).toBe(true);
    });

    it("should return false for strings", () => {
      expect(typeGuard.isDate("2023-01-01")).toBe(false);
      expect(typeGuard.isDate("")).toBe(false);
    });

    it("should return false for numbers", () => {
      expect(typeGuard.isDate(0)).toBe(false);
      expect(typeGuard.isDate(1234567890)).toBe(false);
    });

    it("should return false for null and undefined", () => {
      expect(typeGuard.isDate(null)).toBe(false);
      expect(typeGuard.isDate(undefined)).toBe(false);
    });

    it("should return false for objects and arrays", () => {
      expect(typeGuard.isDate({})).toBe(false);
      expect(typeGuard.isDate({ date: new Date() })).toBe(false);
      expect(typeGuard.isDate([])).toBe(false);
      expect(typeGuard.isDate([new Date()])).toBe(false);
    });

    it("should return false for functions", () => {
      expect(typeGuard.isDate(() => {})).toBe(false);
      expect(typeGuard.isDate(Date)).toBe(false);
    });
  });
});
