export type baseItem = {
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

export type BaseData = {
  data: baseItem[];
};

export type Area = baseItem;
export type Dungeon = baseItem;
export type SubArea = baseItem & { dungeonId: number };

export type BaseDataSubArea = {
  data: SubArea[];
};
