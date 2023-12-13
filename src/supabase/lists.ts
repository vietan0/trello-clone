import supabase from '.';
import { List, ListPayload } from './types';

async function createList(payload: ListPayload) {
  const { data, error } = await supabase.from('lists').insert([payload]).select();
  // if (error) throw error;
  return data as List[];
}

async function getAllListsOfBoard(board_id: string) {
  const { data, error } = await supabase.from('lists').select('*').eq('board_id', board_id);
  // if (error) throw error;
  return data as List[];
}

async function getListById(list_id: string) {
  const { data, error } = await supabase.from('lists').select('*').eq('list_id', list_id);
  // if (error) throw error;
  return data as List[];
}

async function updateRank({ newRank, list_id }: { newRank: string; list_id: string }) {
  const { data, error } = await supabase
    .from('lists')
    .update({ rank: newRank })
    .eq('list_id', list_id)
    .select();
  return data as List[];
}

async function deleteList(list_id: string) {
  const { data, error } = await supabase.from('lists').delete().eq('list_id', list_id).select();
  // if (error) throw error;
  return data as List[];
}

export { createList, getAllListsOfBoard, getListById, updateRank, deleteList };
