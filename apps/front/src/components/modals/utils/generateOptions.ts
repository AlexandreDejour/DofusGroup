import { Area, Dungeon, SubArea } from "../../../types/dofusDB";
import { Breed } from "../../../types/breed";
import { Server } from "../../../types/server";
import { Alignment } from "../../../types/alignment";
import { Tag } from "../../../types/tag";
import { Status } from "../../../types/status";
import { Character } from "../../../types/character";

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

  areas: (areas: Area[]): AreaOptions[] =>
    areas.map((a) => ({ id: a.id, value: a.name.fr, label: a.name.fr })),

  subAreas: (subAreas: SubArea[]): SubAreaOptions[] =>
    subAreas.map((s) => ({ id: s.id, value: s.name.fr, label: s.name.fr })),

  dungeons: (dungeons: Dungeon[]): DungeonOptions[] =>
    dungeons.map((d) => ({ id: d.id, value: d.name.fr, label: d.name.fr })),

  statutes: (statutes: Status[]): StatusOptions[] =>
    statutes.map((s) => ({ id: s.id, value: s.value, label: s.label })),
};
