import supabase from '.';
import { Card, CardPayload } from './types';

async function createCard(payload: CardPayload) {
  const { data, error } = await supabase.from('cards').insert([payload]).select();
  // if (error) throw error;
  return data as Card[];
}

async function getAllCardsOfList(list_id: string) {
  const { data, error } = await supabase.from('cards').select('*').eq('list_id', list_id);
  // if (error) throw error;
  return data as Card[];
}

async function getAllCardsOfBoard(board_id: string) {

}

async function getCardById(card_id: string) {
  const { data, error } = await supabase.from('cards').select('*').eq('card_id', card_id);
  // if (error) throw error;
  return data as Card[];
}

async function updateRank({ newRank, card_id }: { newRank: string; card_id: string }) {
  const { data, error } = await supabase
    .from('cards')
    .update({ rank: newRank })
    .eq('card_id', card_id)
    .select();
  return data as Card[];
}

async function deleteCard(card_id: string) {
  const { data, error } = await supabase.from('cards').delete().eq('card_id', card_id).select();
  // if (error) throw error;
  return data as Card[];
}

export { createCard, getAllCardsOfList, getCardById, updateRank, deleteCard };
