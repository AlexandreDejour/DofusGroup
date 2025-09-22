import { Tag } from "./tag";
import { User } from "./user";
import { Server } from "./server";
import { CommentEnriched } from "./comment";
import { Character, CharacterEnriched } from "./character";

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

export type EventEnriched = Omit<Event, "characters"> & {
  characters: CharacterEnriched[];
  comments: CommentEnriched[];
  user: User;
};

export type PaginatedEvents = {
  events: Event[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
