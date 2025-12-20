import { User } from "./user";

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type CommentEnriched = Comment & {
  user: User;
};
