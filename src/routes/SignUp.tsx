import { useEffect } from 'react';
import Auth from '@/components/Auth';

export default function SignUp() {
  useEffect(() => {
    // This will run when the page first loads and whenever the title changes
    document.title = 'Sign Up - Thullo';
  }, []);

  return <Auth type="signup" />;
}
