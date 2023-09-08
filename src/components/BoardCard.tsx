import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Board } from '@/supabase/types';
import { Button } from './ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBoard } from '@/supabase/boards';

export default function BoardCard({ board }: { board: Board }) {
  const queryClient = useQueryClient();
  const deleteBoardMutation = useMutation({
    mutationFn: (board_id: string) => deleteBoard(board_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllBoards'] });
    },
  });

  function onClick() {
    console.log('board.board_id', board.board_id);
    deleteBoardMutation.mutate(board.board_id);
  }

  return (
    <Card className="max-w-xs" style={{ backgroundColor: board.background || 'inherit' }}>
      <CardHeader>
        <CardTitle>{board.name}</CardTitle>
        <CardDescription>{board.created_at}</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex flex-col gap-2 items-start">
        <p>Private: {board.private.toString()}</p>
        <Button variant="destructive" onClick={onClick}>
          Delete Board
        </Button>
        {deleteBoardMutation.isError ? (
          <p className="text-red-500 text-sm">
            An error occurred:{' '}
            {deleteBoardMutation.error instanceof Error && deleteBoardMutation.error.message}
          </p>
        ) : null}
      </CardFooter>
    </Card>
  );
}
