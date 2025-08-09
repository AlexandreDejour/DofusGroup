export interface Event {
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
  // TODO Define types
  tag: Tag;
  server: Server;
  characters: Character[];
}

export interface PaginatedEvents {
  events: Event[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
