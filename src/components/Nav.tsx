import { useContext } from 'react';
import Avatar, { genConfig } from 'react-nice-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Brightness6Icon from '@mui/icons-material/Brightness6';
import LightModeIcon from '@mui/icons-material/LightMode';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import { ThemeContext } from '../context/ThemeProvider';
import useCurrentUser from '@/hooks/useCurrentUser';
import supabase from '../supabase';
import Logo from './Logo';
import { Link, useNavigate } from 'react-router-dom';
import { QueryClient, useQueryClient } from '@tanstack/react-query';

export default function Nav({ boardName }: { boardName?: string }) {
  const currentUser = useCurrentUser();
  const queryClient = useQueryClient();
  const { option, setOption } = useContext(ThemeContext);
  const navigate = useNavigate();
  const config = genConfig(currentUser?.id);

  return (
    <nav className="flex justify-between items-center px-4 py-3">
      <div id="left" className="flex gap-8 items-center">
        <Link to="/">
          <Logo />
        </Link>
        {currentUser && <Link to={`/u/${currentUser?.id}/boards`}>All Boards</Link>}
        <p>{boardName}</p>
        <Link to="/about">About</Link>
      </div>
      <div id="right" className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-2">
              {option === 'light' && <LightModeIcon fontSize="small" />}
              {option === 'dark' && <ModeNightIcon fontSize="small" />}
              {option === 'system' && <Brightness6Icon fontSize="small" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={option}
              onValueChange={setOption as (value: string) => void}
            >
              <DropdownMenuRadioItem className="cursor-pointer" value="light">
                Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem className="cursor-pointer" value="dark">
                Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem className="cursor-pointer" value="system">
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* asChild mean Trigger don't create its own button, but manually use what we put inside it */}
              <Button variant="ghost" className="p-2">
                <Avatar className="w-7 h-7" {...config} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigate(`/u/${currentUser?.id}/boards`)}
              >
                Boards
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigate(`/u/${currentUser?.id}`)}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Billing</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Team</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Subscription</DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={async () => {
                  const { error } = await supabase.auth.signOut();
                  if (error === null) {
                    queryClient.invalidateQueries({ queryKey: ['getUser'] });
                    navigate('/');
                  }
                }}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button>
            <Link to="/signin">Sign In</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
