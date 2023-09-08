import { Session } from '@supabase/supabase-js';
import supabase from '.';

async function getUser() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const session = data.session as Session;
  return session.user;
}

export { getUser };
