import { describe, it, expect } from "vitest";

import { generateOptions } from "../utils/generateOptions";

describe("generateOptions", () => {
  describe("servers", () => {
    it("should map servers correctly", () => {
      const servers = [{ id: "123", name: "Server A", mono_account: true }];
      const result = generateOptions.servers(servers);

      expect(result).toEqual([{ id: "123", value: "123", label: "Server A" }]);
    });

    it("should return an empty array when no servers provided", () => {
      expect(generateOptions.servers([])).toEqual([]);
    });
  });

  describe("alignments", () => {
    it("should map alignments correctly", () => {
      const alignments = [{ id: 1, name: "Bonta" }];
      const result = generateOptions.alignments(alignments);

      expect(result).toEqual([{ id: 1, value: "Bonta", label: "Bonta" }]);
    });
  });

  describe("breeds", () => {
    it("should generate male breed options with correct imgSrc", () => {
      const breeds = [{ id: "123", name: "Cra" }];
      const result = generateOptions.breeds(breeds, "M");

      expect(result).toEqual([
        {
          id: "123",
          value: "123",
          label: "Cra",
          imgSrc: "/miniatures/cra_male.webp",
        },
      ]);
    });

    it("should generate female breed options with correct imgSrc", () => {
      const breeds = [{ id: "123", name: "Iop" }];
      const result = generateOptions.breeds(breeds, "F");

      expect(result).toEqual([
        {
          id: "123",
          value: "123",
          label: "Iop",
          imgSrc: "/miniatures/iop_female.webp",
        },
      ]);
    });
  });

  describe("tags", () => {
    it("should map tags correctly", () => {
      const tags = [{ id: "123", name: "PvP", color: "#0000" }];
      const result = generateOptions.tags(tags);

      expect(result).toEqual([{ id: "123", value: "123", label: "PvP" }]);
    });
  });

  describe("characters", () => {
    it("should map characters correctly", () => {
      const characters = [
        {
          id: "123",
          name: "Hero",
          sex: "M",
          level: 200,
          alignment: "Bonta",
          stuff: "",
          default_character: true,
        },
      ];
      const result = generateOptions.characters(characters);

      expect(result).toEqual([{ id: "123", value: "123", label: "Hero" }]);
    });
  });

  describe("areas", () => {
    it("should map areas correctly", () => {
      const areas = [
        {
          id: 1,
          name: {
            id: "123",
            en: "Astrub",
            es: "Astrub",
            pt: "Astrub",
            de: "Astrub",
            fr: "Astrub",
          },
        },
      ];
      const result = generateOptions.areas(areas);

      expect(result).toEqual([{ id: 1, value: "Astrub", label: "Astrub" }]);
    });
  });

  describe("subAreas", () => {
    it("should map subAreas correctly", () => {
      const subAreas = [
        {
          id: 2,
          dungeonId: 2,
          name: {
            id: "123",
            en: "Astrub forest",
            es: "Bosque de Astrub",
            pt: "Floresta de Astrub",
            de: "Astrub-Wald",
            fr: "Forêt d’Astrub",
          },
        },
      ];
      const result = generateOptions.subAreas(subAreas);

      expect(result).toEqual([
        { id: 2, value: "Forêt d’Astrub", label: "Forêt d’Astrub" },
      ]);
    });
  });

  describe("dungeons", () => {
    it("should map dungeons correctly", () => {
      const dungeons = [
        {
          id: 3,
          name: {
            id: "123",
            en: "Bouftou Dungeon",
            es: "Mazmorra de Bouftou",
            pt: "Calabouço Bouftou",
            de: "Bouftou-Dungeon",
            fr: "Donjon Bouftou",
          },
        },
      ];
      const result = generateOptions.dungeons(dungeons);

      expect(result).toEqual([
        { id: 3, value: "Donjon Bouftou", label: "Donjon Bouftou" },
      ]);
    });
  });

  describe("statutes", () => {
    it("should map statutes correctly", () => {
      const statutes = [{ id: 1, value: "active", label: "Active" }];
      const result = generateOptions.statutes(statutes);

      expect(result).toEqual([{ id: 1, value: "active", label: "Active" }]);
    });
  });
});
