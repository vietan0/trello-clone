import supabase from '@/supabase';
import { useQuery } from '@tanstack/react-query';

export default function useCurrentUser() {
  // find a way to invalidate after logged out or something
  const { data: user } = useQuery({
    queryKey: ['getUser'],
    queryFn: async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      // if error
      if (error) console.log(error);
      return user;
    },
  });

  return user;
}
