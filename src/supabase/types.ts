export type Background = 'red' | 'yellow' | 'green' | 'blue' | '';

export interface BoardPayload {
  name: string;
  private: boolean;
  background: Background;
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

export interface ListPayload {
  name: string;
  board_id: string;
  rank: string;
}

export interface List extends ListPayload {
  list_id: string;
  created_at: string;
}
