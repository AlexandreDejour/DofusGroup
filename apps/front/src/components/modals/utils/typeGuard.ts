import { CharacterEnriched } from "../../../types/character";

export const typeGuard = {
  characterEnriched: (obj: any): obj is CharacterEnriched => {
    return (
      obj !== null &&
      typeof obj === "object" &&
      // character properties
      typeof obj.id === "string" &&
      typeof obj.name === "string" &&
      typeof obj.sex === "string" &&
      typeof obj.level === "number" &&
      (typeof obj.alignment === "string" || obj.alignment === null) &&
      (typeof obj.stuff === "string" || obj.stuff === null) &&
      typeof obj.default_character === "boolean" &&
      // enriched properties
      obj.user !== undefined &&
      obj.breed !== undefined &&
      obj.server !== undefined
    );
  },
};
