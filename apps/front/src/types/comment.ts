import { User } from "./user";
import { Event } from "./event";

export type Comment = {
  id: string;
  content: string;
};

export type CommentEnriched = Comment & {
  user: User;
  event: Event;
};
