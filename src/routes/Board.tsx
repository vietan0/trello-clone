import { Board as TBoard } from '@/supabase/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getBoardById } from '@/supabase/boards';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';

export default function Board() {
  const params = useParams();
  const boardId = params.boardId as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['getBoardById', boardId],
    queryFn: () => getBoardById(boardId),
  });
  const board = data && data[0];

  return isLoading ? (
    'Getting board data...'
  ) : error ? (
    <>
      <h1>There's been an error while fetching this board</h1>
      <Button>Retry</Button>
    </>
  ) : (
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
  );
}
