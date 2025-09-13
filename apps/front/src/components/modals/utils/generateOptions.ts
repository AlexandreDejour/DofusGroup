import { Area, Dungeon, SubArea } from "../../../types/dofusDB";
import { Breed } from "../../../types/breed";
import { Server } from "../../../types/server";
import { Alignment } from "../../../types/alignment";
import { Tag } from "../../../types/tag";
import { Status } from "../../../types/status";
import { Character } from "../../../types/character";

export type BaseOptions = {
  value: string;
  label: string;
};

type ServerOptions = BaseOptions;
type AlignmentOptions = BaseOptions;
type AreaOptions = BaseOptions;
type SubAreaOptions = BaseOptions;
type DungeonOptions = BaseOptions;
type TagOptions = BaseOptions;
type StatusOptions = BaseOptions;
type CharacterOptions = BaseOptions;

type BreedOption = ServerOptions & {
  imgSrc: string;
};

export const generateOptions = {
  servers: (servers: Server[]): ServerOptions[] =>
    servers.map((s) => ({ value: s.id, label: s.name })),

  alignments: (alignments: Alignment[]): AlignmentOptions[] =>
    alignments.map((a) => ({ value: a.name, label: a.name })),

  breeds: (breeds: Breed[], sex: string): BreedOption[] => {
    const completeSex = sex === "F" ? "female" : "male";

    return breeds.map((b) => ({
      value: b.id,
      label: b.name,
      imgSrc: `/miniatures/${b.name.toLowerCase()}_${completeSex}.webp`,
    }));
  },

  tags: (tags: Tag[]): TagOptions[] =>
    tags.map((t) => ({ value: t.id, label: t.name })),

  characters: (characters: Character[]): CharacterOptions[] =>
    characters.map((c) => ({ value: c.id, label: c.name })),

  areas: (areas: Area[]): AreaOptions[] =>
    areas.map((a) => ({ value: a.name.fr, label: a.name.fr })),

  subAreas: (subAreas: SubArea[]): SubAreaOptions[] =>
    subAreas.map((s) => ({ value: s.name.fr, label: s.name.fr })),

  dungeons: (dungeons: Dungeon[]): DungeonOptions[] =>
    dungeons.map((d) => ({ value: d.name.fr, label: d.name.fr })),

  statutes: (statutes: Status[]): StatusOptions[] =>
    statutes.map((s) => ({ value: s.value, label: s.label })),
};
