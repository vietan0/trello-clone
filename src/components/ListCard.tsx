import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { List } from '@/supabase/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteList } from '@/supabase/lists';
import { useParams } from 'react-router-dom';

export default function ListCard({ list }: { list: List }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: list.rank,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const params = useParams();
  const boardId = params.boardId as string;

  const queryClient = useQueryClient();
  const deleteListMutation = useMutation({
    mutationFn: (list_id: string) => deleteList(list_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllLists', boardId] });
    },
  });

  return (
    <Card className="w-72" ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardHeader>
        <CardTitle>{list.name}</CardTitle>
        <CardDescription>{list.rank}</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex flex-col gap-2 items-start">
        {deleteListMutation.isError ? (
          <p className="text-red-500 text-sm">
            An error occurred:{' '}
            {deleteListMutation.error instanceof Error && deleteListMutation.error.message}
          </p>
        ) : null}
      </CardFooter>
    </Card>
  );
}
