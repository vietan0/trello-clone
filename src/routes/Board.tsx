import { Board as TBoard } from '@/supabase/types';
import Nav from '../components/Nav';
import { useQueryClient } from '@tanstack/react-query';

export default function Board({ useLoader }) {
  // data passing is set up in main.tsx
  const data = useLoader();
  const board = data[0] as TBoard;

  return (
    <>
      <Nav boardName={board.name} />
      <div className="px-12 py-4">
        <p>name: {board.name}</p>
        <p>private: {board.private}</p>
        <p>board_id: {board.board_id}</p>
        <p>background: {board.background}</p>
        <p>created_at: {board.created_at}</p>
      </div>
    </>
  );
}
