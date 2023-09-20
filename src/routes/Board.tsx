import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LexoRank } from 'lexorank';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
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
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { getBoardById } from '@/supabase/boards';
import { Button } from '@/components/ui/button';
import { createList, getAllLists, updateRank } from '@/supabase/lists';
import { ListPayload, List } from '@/supabase/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ListCard from '@/components/ListCard';

export default function Board() {
  const queryClient = useQueryClient();
  const params = useParams();
  const boardId = params.boardId as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['getBoardById', boardId],
    queryFn: () => getBoardById(boardId),
  });

  const {
    data: unsortedLists,
    isLoading: listsIsLoading,
    error: listsError,
  } = useQuery({
    queryKey: ['getAllLists', boardId],
    queryFn: () => getAllLists(boardId),
  });
  const [random, setRandom] = useState(0);

  const sortedLists = unsortedLists?.sort((a, b) => a.rank.localeCompare(b.rank)) as List[]; // questionable
  const highestRank =
    sortedLists && sortedLists.length > 0 ? sortedLists[sortedLists.length - 1].rank : undefined;

  const createListMutation = useMutation({
    mutationFn: (payload: ListPayload) => createList(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllLists', boardId] });
    },
  });

  const updateRankMutation = useMutation({
    mutationFn: ({ newRank, list_id }: { newRank: string; list_id: string }) =>
      updateRank({ newRank, list_id }),
    onMutate: async ({ newRank, list_id }) => {
      // Optimistic Update logic is in onMutate - run before mutation function
      // 1. Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['getAllLists', boardId] });

      // 2. Get data before update (to rollback/revert if fail)
      const prevLists = queryClient.getQueryData<List[]>(['getAllLists', boardId]);

      // 3. Update query's local, cached data
      queryClient.setQueryData(['getAllLists', boardId], (oldQueryData: List[] | undefined) => {
        // find target list and change it
        if (!oldQueryData) return;
        else {
          const targetIndex = oldQueryData.findIndex((list) => list.list_id === list_id);
          const targetList = oldQueryData[targetIndex];
          const updatedList = { ...targetList, rank: newRank };
          oldQueryData.splice(targetIndex, 1, updatedList);
          setRandom(Math.random());
          return oldQueryData;
        }
      });

      return { prevLists };
    },
    // If the mutation fails, use the context we returned above
    onError: (_err, _variables, context) => {
      if (context?.prevLists) {
        queryClient.setQueryData(['getAllLists', boardId], context.prevLists);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllLists', boardId] });
    },
  });

  const form = useForm<ListPayload>({
    defaultValues: {
      name: '',
      board_id: '',
      rank: '',
    },
  });

  const onSubmit: SubmitHandler<ListPayload> = (values: ListPayload) => {
    console.log('values', values);
    createListMutation.mutate({
      name: values.name || 'Untitled List',
      board_id: boardId,
      rank: highestRank
        ? LexoRank.parse(highestRank).genNext().toString()
        : LexoRank.middle().toString(),
    });
  };

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

        const activeIndex = sortedLists.findIndex((list) => list.rank === activeId);
        const activeList = sortedLists[activeIndex];

        const overIndex = sortedLists.findIndex((list) => list.rank === overId);
        const overRank = LexoRank.parse(overId);
        let newRank;
        if (dragDirection === 'back') {
          const overPrev = sortedLists[overIndex - 1];
          if (!overPrev) {
            // over is beginning of array
            newRank = overRank.genPrev().toString();
          } else {
            const overPrevRank = LexoRank.parse(overPrev.rank);
            newRank = overPrevRank.between(overRank).toString();
          }
        } else {
          const overNext = sortedLists[overIndex + 1];
          if (!overNext) {
            // over is end of array
            newRank = overRank.genNext().toString();
          } else {
            const overNextRank = LexoRank.parse(overNext.rank);
            newRank = overRank.between(overNextRank).toString();
          }
        }

        updateRankMutation.mutate({ newRank, list_id: activeList.list_id });
      }
    }
    setActiveId('');
  }

  return isLoading ? (
    'Getting board data...'
  ) : data ? (
    <>
      <Helmet>
        <title>{data[0].name} - Thullo</title>
      </Helmet>
      <h1 className="text-2xl font-bold">{data[0].name}</h1>
      <Form {...form}>
        <h1>Create List Form</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 max-w-xs mb-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>List Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="List name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="secondary">
            Submit
          </Button>
        </form>
      </Form>
      {listsIsLoading ? (
        'Fetching lists...'
      ) : unsortedLists ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedLists!.map((list) => list.rank)} // declare identifier as `rank` instead of default `id`
            strategy={horizontalListSortingStrategy}
          >
            <div className="lists flex gap-4">
              {listsIsLoading ? (
                'Fetching lists...'
              ) : sortedLists ? (
                sortedLists.map((list: List) => (
                  <ListCard key={list.rank} list={list} active={activeId === list.rank} />
                ))
              ) : (
                <>
                  <h1>There's been an error while fetching boards</h1>
                  <Button>Retry</Button>
                </>
              )}
              <DragOverlay dropAnimation={null}>
                {activeId && (
                  <ListCard
                    list={sortedLists.find((list) => list.rank === activeId) as List}
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
    </>
  ) : (
    <>
      <h1>There's been an error while fetching this board</h1>
      <Button>Retry</Button>
    </>
  );
}
