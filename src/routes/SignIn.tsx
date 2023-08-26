import { useEffect } from 'react';
import Auth from '@/components/Auth';

export default function SignIn() {
  useEffect(() => {
    // This will run when the page first loads and whenever the title changes
    document.title = 'Sign In - Thullo';
  }, []);

  return <Auth type="signin" />;
}
