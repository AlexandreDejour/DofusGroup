import { EventEnriched } from "../../../types/event";
import { CommentEnriched } from "../../../types/comment";
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
      // character properties
      typeof obj.id === "string" &&
      typeof obj.title === "string" &&
      typeof obj.date === "string" &&
      typeof obj.duration === "number" &&
      (typeof obj.area === "string" || obj.area === null) &&
      (typeof obj.sub_area === "string" || obj.sub_area === null) &&
      (typeof obj.donjon_name === "string" || obj.donjon_name === null) &&
      (typeof obj.description === "string" || obj.description === null) &&
      typeof obj.max_players === "number" &&
      typeof obj.status === "string" &&
      // enriched properties
      obj.tag !== undefined &&
      obj.server !== undefined &&
      obj.characters !== undefined &&
      obj.comments !== undefined &&
      obj.user !== undefined
    );
  },

  commentEnriched: (obj: any): obj is CommentEnriched => {
    return (
      obj !== null &&
      typeof obj === "object" &&
      // comment properties
      typeof obj.id === "string" &&
      typeof obj.content === "string" &&
      // enriched properties
      obj.user !== undefined
    );
  },
};
