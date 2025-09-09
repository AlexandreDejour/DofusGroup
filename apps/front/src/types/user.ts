import { Character } from "./character";
import { Comment } from "./comment";
import { Event } from "./event";

export type User = {
  id: string;
  username: string;
};

export type AuthUser = User & {
  password: string;
  mail: string;
};

export type UserEnriched = User & {
  events?: Event[];
  comments?: Comment[];
  characters?: Character[];
};
