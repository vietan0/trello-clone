import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Card as TCard } from '@/supabase/types';
import { deleteCard } from '@/supabase/cards';

export default function CardCard({
  card,
  active,
  overlay,
}: {
  card: TCard;
  active: boolean;
  overlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: card.rank,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const queryClient = useQueryClient();
  const deleteCardMutation = useMutation({
    mutationFn: (card_id: string) => deleteCard(card_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllCardsOfList', card.list_id] });
    },
  });

  return (
    <Card
      className="h-20"
      ref={setNodeRef}
      style={{ ...style, rotate: active && overlay ? '4deg' : '0deg' }}
      {...attributes}
      {...listeners}
    >
      {active && !overlay ? (
        <div className="ghost bg-neutral-900 w-full h-full" />
      ) : (
        <>
          <CardHeader className='py-2 px-4'>
            <CardTitle className='text-base'>{card.title}</CardTitle>
            <CardDescription>{card.rank}</CardDescription>
          </CardHeader>
          <CardContent className='py-2 px-4'>{card.content}</CardContent>
          <CardFooter className="py-2 px-4 flex flex-col gap-2 items-start">
            {deleteCardMutation.isError ? (
              <p className="text-red-500 text-sm">
                An error occurred:{' '}
                {deleteCardMutation.error instanceof Error && deleteCardMutation.error.message}
              </p>
            ) : null}
          </CardFooter>
        </>
      )}
    </Card>
  );
}
