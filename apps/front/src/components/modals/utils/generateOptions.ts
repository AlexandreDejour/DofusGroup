import i18n from "i18next";

import { Tag } from "../../../types/tag";
import { Breed } from "../../../types/breed";
import { Status } from "../../../types/status";
import { Server } from "../../../types/server";
import { Alignment } from "../../../types/alignment";
import { Character } from "../../../types/character";
import { Area, Dungeon, SubArea } from "../../../types/dofusDB";

export type BaseOptions<ID extends string | number> = {
  id: ID;
  value: string;
  label: string;
};

type TagOptions = BaseOptions<string>;
type AreaOptions = BaseOptions<number>;
type StatusOptions = BaseOptions<number>;
type ServerOptions = BaseOptions<string>;
type SubAreaOptions = BaseOptions<number>;
type DungeonOptions = BaseOptions<number>;
type AlignmentOptions = BaseOptions<number>;
type CharacterOptions = BaseOptions<string>;

type BreedOption = ServerOptions & {
  imgSrc: string;
};

export const generateOptions = {
  servers: (servers: Server[]): ServerOptions[] =>
    servers.map((s) => ({ id: s.id, value: s.id, label: s.name })),

  alignments: (alignments: Alignment[]): AlignmentOptions[] =>
    alignments.map((a) => ({ id: a.id, value: a.name, label: a.name })),

  breeds: (breeds: Breed[], sex: string): BreedOption[] => {
    const completeSex = sex === "F" ? "female" : "male";

    return breeds.map((b) => ({
      id: b.id,
      value: b.id,
      label: b.name,
      imgSrc: `/miniatures/${b.name.toLowerCase()}_${completeSex}.webp`,
    }));
  },

  tags: (tags: Tag[]): TagOptions[] =>
    tags.map((t) => ({ id: t.id, value: t.id, label: t.name })),

  characters: (characters: Character[]): CharacterOptions[] =>
    characters.map((c) => ({ id: c.id, value: c.id, label: c.name })),

  areas: (areas: Area[]): AreaOptions[] => {
    const lang = i18n.language as "fr" | "en";
    return areas.map((a) => ({
      id: a.id,
      value: a.name[lang],
      label: a.name[lang],
    }));
  },

  subAreas: (subAreas: SubArea[]): SubAreaOptions[] => {
    const lang = i18n.language as "fr" | "en";
    return subAreas.map((s) => ({
      id: s.id,
      value: s.name[lang],
      label: s.name[lang],
    }));
  },

  dungeons: (dungeons: Dungeon[]): DungeonOptions[] => {
    const lang = i18n.language as "fr" | "en";
    return dungeons.map((d) => ({
      id: d.id,
      value: d.name[lang],
      label: d.name[lang],
    }));
  },

  statutes: (statutes: Status[]): StatusOptions[] =>
    statutes.map((s) => ({ id: s.id, value: s.value, label: s.label })),
};
