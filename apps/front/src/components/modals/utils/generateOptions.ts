import { Breed } from "../../../types/breed";
import { Server } from "../../../types/server";

interface ServerOptions {
  value: string;
  label: string;
}

interface BreedOption extends ServerOptions {
  imgSrc: string;
}

export const generateOptions = {
  servers: (servers: Server[]): ServerOptions[] =>
    servers.map((s) => ({ value: s.id, label: s.name })),

  breeds: (breeds: Breed[], sex: string): BreedOption[] => {
    const completeSex = sex === "F" ? "female" : "male";

    return breeds.map((b) => ({
      value: b.id,
      label: b.name,
      imgSrc: `/miniatures/${b.name.toLowerCase()}_${completeSex}.webp`,
    }));
  },
};
