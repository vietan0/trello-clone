export type Background = 'red' | 'yellow' | 'green' | 'blue' | null;

export interface BoardPayload {
  name: string;
  private?: boolean;
  background?: Background;
}

export interface Board extends BoardPayload {
  board_id: string;
  created_at: string;
}

export interface BoardMember {
  board_id: string;
  user_id: string;
  admin: boolean;
}
