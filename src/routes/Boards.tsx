import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import BoardCard from '@/components/BoardCard';
import { createBoard, getAllBoards } from '@/supabase/boards';
import { Board, BoardPayload } from '@/supabase/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import useCurrentUser from '@/hooks/useCurrentUser';

export default function Boards() {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const userId = currentUser?.id as string;

  const {
    data: boards,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['getAllBoards', userId],
    queryFn: () => getAllBoards(userId),
    enabled: !!userId, // query won't execute until userId exists
  });

  const createBoardMutation = useMutation({
    mutationFn: (payload: BoardPayload) => createBoard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllBoards'] });
    },
  });

  const form = useForm<BoardPayload>({
    defaultValues: {
      name: '',
      private: false,
      background: '',
    },
  });

  const onSubmit: SubmitHandler<BoardPayload> = (values: BoardPayload) => {
    createBoardMutation.mutate(values.name ? values : { ...values, name: 'Untitled Board' });
  };

  return (
    <>
      <Helmet>
        <title>Boards - Thullo</title>
      </Helmet>
      <h1 className="text-2xl tracking-tight">All Boards</h1>
      <Form {...form}>
        <h1>Create Board Form</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 max-w-xs mb-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Board name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="private"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Private</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="block"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="background"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background</FormLabel>
                <Select onValueChange={field.onChange} defaultValue="">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a background" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="secondary">
            Submit
          </Button>
        </form>
      </Form>
      {createBoardMutation.isLoading ? 'Creating board...' : null}
      {createBoardMutation.isError ? (
        <p>
          An error occurred:{' '}
          {createBoardMutation.error instanceof Error && createBoardMutation.error.message}
        </p>
      ) : null}
      <div className="boards">
        {isLoading ? (
          'Fetching boards...'
        ) : error ? (
          <>
            <h1>There's been an error while fetching boards</h1>
            <Button>Retry</Button>
          </>
        ) : (
          boards?.map((board: Board) => <BoardCard key={board.board_id} board={board} />)
        )}
      </div>
    </>
  );
}
