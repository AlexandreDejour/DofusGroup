import { EventEnriched } from "../../../types/event";
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

  eventEnriched: (obj: any): obj is EventEnriched => {
    return (
      obj !== null &&
      typeof obj === "object" &&
      typeof obj.id === "string" &&
      typeof obj.title === "string" &&
      obj.date instanceof Date &&
      typeof obj.duration === "number" &&
      (typeof obj.area === "string" || obj.area === undefined) &&
      (typeof obj.sub_area === "string" || obj.sub_area === undefined) &&
      (typeof obj.donjon_name === "string" || obj.donjon_name === undefined) &&
      (typeof obj.description === "string" || obj.description === undefined) &&
      typeof obj.max_players === "number" &&
      typeof obj.status === "string" &&
      obj.tag !== undefined &&
      obj.server !== undefined &&
      Array.isArray(obj.characters) &&
      obj.characters.every(typeGuard.characterEnriched) &&
      Array.isArray(obj.comments) &&
      obj.user !== undefined
    );
  },
};
