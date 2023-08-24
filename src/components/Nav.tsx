import { useContext } from 'react';
import { Link, useNavigate } from '@tanstack/router';
import logoSmall from '../assets/Logo-small.svg';
import { CurrentUserContext } from '../context/CurrentUserProvider';
import supabase from '../supabase';

export default function Nav() {
  const currentUser = useContext(CurrentUserContext);
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between">
      <img src={logoSmall} />
      Nav
      {currentUser ? (
        <div>
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
