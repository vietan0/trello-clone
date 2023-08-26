import { useContext } from 'react';
import { Link, useNavigate } from '@tanstack/router';
import Avatar, { genConfig } from 'react-nice-avatar';
import { CurrentUserContext } from '../context/CurrentUserProvider';
import supabase from '../supabase';
import Logo from './Logo';

export default function Nav() {
  const currentUser = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const config = genConfig(currentUser?.id); 

  return (
    <nav className="flex justify-between">
      <Logo />
      {currentUser ? (
        <div>
          <Avatar className="w-9 h-9" {...config} />
          <p>{currentUser.email}</p>
          <button
            onClick={async () => {
              const { error } = await supabase.auth.signOut();
              if (error === null) navigate({ to: '/' });
            }}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <Link to="/auth">Sign In</Link>
      )}
    </nav>
  );
}
