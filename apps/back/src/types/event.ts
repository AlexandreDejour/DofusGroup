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
};
