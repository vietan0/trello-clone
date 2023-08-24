import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/router';
import { User } from '@supabase/supabase-js';
import supabase from '../supabase';

export const CurrentUserContext = createContext(null as User | null);

export default function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState(null as User | null);
  const navigate = useNavigate();
  useEffect(() => {
    (async function retrieve() {
      const { data, error } = await supabase.auth.getSession();
      setCurrentUser(data.session ? data.session.user : null);
    })();

    supabase.auth.onAuthStateChange((event, session) => {
      if (event == 'SIGNED_IN') {
        console.log('SIGNED_IN', session);
        const { user } = session!;
        setCurrentUser(user);
        navigate({ to: `/u/${user.id}/boards` });
      }
      if (event == 'SIGNED_OUT') {
        console.log('SIGNED_OUT', session);
        setCurrentUser(null);
        navigate({ to: '/' });
      }
    });
  }, [navigate]);

  return <CurrentUserContext.Provider value={currentUser}>{children}</CurrentUserContext.Provider>;
}
