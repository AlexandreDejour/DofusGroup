type baseData = {
  id: number;
  name: {
    id: string;
    de: string;
    en: string;
    es: string;
    fr: string;
    pt: string;
  };
};

export type Area = baseData;
export type Dungeon = baseData;

export type SubArea = baseData & { dungeonId: number };
