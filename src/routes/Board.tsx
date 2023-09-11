import { Board as TBoard } from '@/supabase/types';
import Nav from '../components/Nav';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getBoardById } from '@/supabase/boards';
import { Helmet } from 'react-helmet-async';

export default function Board() {
  const params = useParams();
  const boardId = params.boardId as string;

  const boardQuery = useQuery({
    queryKey: ['getBoardById', boardId],
    queryFn: () => getBoardById(boardId),
  });
  const data = boardQuery.data as TBoard[];
  const board = data && data[0];

  return (
    data && (
      <>
        <Helmet>
          <title>{board.name} - Thullo</title>
        </Helmet>
        <p>name: {board.name}</p>
        <p>private: {board.private.toString()}</p>
        <p>board_id: {board.board_id}</p>
        <p>background: {board.background}</p>
        <p>created_at: {board.created_at}</p>
      </>
    )
  );
}
