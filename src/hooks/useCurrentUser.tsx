import supabase from '@/supabase';
import { useQuery } from '@tanstack/react-query';

export default function useCurrentUser() {
  const { data: user, error } = useQuery({
    queryKey: ['getUser'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      return data.session ? data.session.user : null;
    },
  });

  // if (error) console.log(error);
  return user;
}
