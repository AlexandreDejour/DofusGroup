import { Tag } from "./tag.js";
import { User } from "./user.js";
import { Server } from "./server.js";
import { Comment } from "./comment.js";
import { Character } from "./character.js";

export type Event = {
  id: string;
  title: string;
  date: Date;
  duration: number;
  area: string;
  sub_area: string;
  donjon_name: string;
  description?: string;
  max_players: number;
  status: string;
  tag?: Tag;
  server?: Server;
  characters?: Character[];
};

export type EventEnriched = Event & {
  user?: User;
  comments?: Comment[];
};

export type EventBodyData = Omit<
  Event,
  "id" | "tag" | "server" | "characters"
> & {
  tag_id: string;
  user_id: string;
  server_id: string;
  characters_id: string[];
};
