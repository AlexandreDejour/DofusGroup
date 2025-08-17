import { Tag } from "./tag";
import { Server } from "./server";
import { Character } from "./character";

export type Event = {
  id: string;
  title: string;
  date: Date;
  duration: number;
  area?: string;
  sub_area?: string;
  donjon_name?: string;
  description?: string;
  max_players: number;
  status: string;
  tag: Tag;
  server: Server;
  characters: Character[];
};

export type PaginatedEvents = {
  events: Event[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
