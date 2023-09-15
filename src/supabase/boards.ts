import supabase from '.';
import { Board, BoardPayload } from './types';

async function createBoard(payload: BoardPayload) {
  const { data, error } = await supabase.from('boards').insert([payload]).select();
  // if (error) throw error;
  return data as Board[];
}

async function getAllBoards(user_id: string) {
  const { data, error } = await supabase.rpc('get_all_boards', { user_id });
  // if (error) throw error;
  return data as Board[];
}

async function getBoardById(board_id: string) {
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('board_id', board_id);
  // if (error) throw error;
  return data as Board[];
}

async function deleteBoard(board_id: string) {
  const { data, error } = await supabase.from('boards').delete().eq('board_id', board_id).select();
  // if (error) throw error;
  return data as Board[];
}

export { createBoard, getAllBoards, getBoardById, deleteBoard };
