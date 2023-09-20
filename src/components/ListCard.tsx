import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CSS } from '@dnd-kit/utilities';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card as TCard, CardPayload, List } from '@/supabase/types';
import { deleteList } from '@/supabase/lists';
import { createCard, getAllCardsOfList, updateRank } from '@/supabase/cards';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LexoRank } from 'lexorank';
import { Button } from './ui/button';
import CardCard from './CardCard';

export default function ListCard({
  list,
  active,
  overlay,
}: {
  list: List;
  active: boolean;
  overlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: list.rank,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const params = useParams();
  const boardId = params.boardId as string;

  const queryClient = useQueryClient();

  const deleteListMutation = useMutation({
    mutationFn: (list_id: string) => deleteList(list_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllCardsOfList', list.list_id] });
    },
  });

  const [addingCard, setAddingCard] = useState(false);
  const {
    data: unsortedCards,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['getAllCardsOfList', list.list_id],
    queryFn: () => getAllCardsOfList(list.list_id),
  });
  const [random, setRandom] = useState(0);

  const sortedCards = unsortedCards?.sort((a, b) => a.rank.localeCompare(b.rank)) as TCard[]; // questionable
  const highestRank =
    sortedCards && sortedCards.length > 0 ? sortedCards[sortedCards.length - 1].rank : undefined;

  const createCardMutation = useMutation({
    mutationFn: (payload: CardPayload) => createCard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllCardsOfList', list.list_id] });
    },
  });

  const form = useForm<CardPayload>({
    defaultValues: {
      list_id: '',
      title: '',
      content: '',
      rank: '',
    },
  });

  const onSubmit: SubmitHandler<CardPayload> = (values: CardPayload) => {
    createCardMutation.mutate({
      list_id: list.list_id,
      title: values.title || 'Untitled Card',
      content: '',
      rank: highestRank
        ? LexoRank.parse(highestRank).genNext().toString()
        : LexoRank.middle().toString(),
    });

    setAddingCard(false);
  };

  const updateRankMutation = useMutation({
    mutationFn: ({ newRank, card_id }: { newRank: string; card_id: string }) =>
      updateRank({ newRank, card_id }),
    onMutate: async ({ newRank, card_id }) => {
      // Optimistic Update logic is in onMutate - run before mutation function
      // 1. Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['getAllCardsOfList', list.list_id] });

      // 2. Get data before update (to rollback/revert if fail)
      const prevCards = queryClient.getQueryData<TCard[]>(['getAllCardsOfList', list.list_id]);

      // 3. Update query's local, cached data
      queryClient.setQueryData(
        ['getAllCardsOfList', list.list_id],
        (oldQueryData: TCard[] | undefined) => {
          // find target card and change it
          if (!oldQueryData) return;
          else {
            const targetIndex = oldQueryData.findIndex((card) => card.card_id === card_id);
            const targetCard = oldQueryData[targetIndex];
            const updatedCard = { ...targetCard, rank: newRank };
            oldQueryData.splice(targetIndex, 1, updatedCard);
            setRandom(Math.random());
            return oldQueryData;
          }
        },
      );

      return { prevCards };
    },
    // If the mutation fails, use the context we returned above
    onError: (_err, _variables, context) => {
      if (context?.prevCards) {
        queryClient.setQueryData(['getAllCardsOfList', list.list_id], context.prevCards);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllCardsOfList', list.list_id] });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        // drag event only fired if mouse is dragging 8px away from initial position
        // --> allow room for click events
      },
    }),
  );

  const [activeId, setActiveId] = useState('');
  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over) {
      const activeId = active.id as string;
      const overId = over!.id as string;
      // console.log('active', active);
      // console.log('over', over);

      if (activeId !== overId) {
        // this block determines newRank
        const dragDirection = activeId.localeCompare(overId) > 0 ? 'back' : 'away';

        const activeIndex = sortedCards.findIndex((card) => card.rank === activeId);
        const activeCard = sortedCards[activeIndex];

        const overIndex = sortedCards.findIndex((card) => card.rank === overId);
        const overRank = LexoRank.parse(overId);
        let newRank;
        if (dragDirection === 'back') {
          const overPrev = sortedCards[overIndex - 1];
          if (!overPrev) {
            // over is beginning of array
            newRank = overRank.genPrev().toString();
          } else {
            const overPrevRank = LexoRank.parse(overPrev.rank);
            newRank = overPrevRank.between(overRank).toString();
          }
        } else {
          const overNext = sortedCards[overIndex + 1];
          if (!overNext) {
            // over is end of array
            newRank = overRank.genNext().toString();
          } else {
            const overNextRank = LexoRank.parse(overNext.rank);
            newRank = overRank.between(overNextRank).toString();
          }
        }

        updateRankMutation.mutate({ newRank, card_id: activeCard.card_id });
      }
    }
    setActiveId('');
  }

  return (
    <Card
      className="w-72"
      ref={setNodeRef}
      style={{ ...style, rotate: active && overlay ? '4deg' : '0deg' }}
      {...attributes}
      {...listeners}
    >
      {active && !overlay ? (
        <div className="ghost bg-neutral-900 w-full h-full" />
      ) : (
        <>
          <CardHeader>
            <CardTitle>{list.name}</CardTitle>
            <CardDescription>{list.rank}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              'Fetching cards...'
            ) : unsortedCards ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sortedCards!.map((list) => list.rank)} // declare identifier as `rank` instead of default `id`
                  strategy={verticalListSortingStrategy}
                >
                  <div className="lists flex flex-col gap-4">
                    {isLoading ? (
                      'Fetching cards...'
                    ) : sortedCards ? (
                      sortedCards.map((card: TCard) => (
                        <CardCard key={card.rank} card={card} active={activeId === card.rank} />
                      ))
                    ) : (
                      <>
                        <h1>There's been an error while fetching cards</h1>
                        <Button>Retry</Button>
                      </>
                    )}
                    <DragOverlay dropAnimation={null}>
                      {activeId && (
                        <CardCard
                          card={sortedCards.find((card) => card.rank === activeId) as TCard}
                          active={true}
                          overlay={true}
                        />
                      )}
                    </DragOverlay>
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <>
                <h1>There's been an error while fetching lists</h1>
                <Button>Retry</Button>
              </>
            )}
            {addingCard ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-2 max-w-xs mb-6"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel></FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter a title for this card" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" variant="secondary">
                    Add card
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setAddingCard(false)}>
                    Cancel
                  </Button>
                </form>
              </Form>
            ) : (
              <Button variant="secondary" onClick={() => setAddingCard(true)}>
                Add card
              </Button>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2 items-start">
            {deleteListMutation.isError ? (
              <p className="text-red-500 text-sm">
                An error occurred:{' '}
                {deleteListMutation.error instanceof Error && deleteListMutation.error.message}
              </p>
            ) : null}
          </CardFooter>
        </>
      )}
    </Card>
  );
}
