import useCurrentUser from '@/hooks/useCurrentUser';
import { Outlet, useNavigate } from 'react-router-dom';

export default function AuthLayout() {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  if (!currentUser) {
    navigate('/signin', { replace: true });
  }
  return <Outlet />;
}
