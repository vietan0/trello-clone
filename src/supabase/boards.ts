import supabase from '.';
import { BoardPayload } from './types';

async function createBoard(payload: BoardPayload) {
  const { data, error } = await supabase.from('boards').insert([payload]).select();
}

export { createBoard };
