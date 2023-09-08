import Auth from '@/components/Auth';
import { Helmet } from 'react-helmet-async';

export default function SignUp() {
  return (
    <>
      <Helmet>
        <title>Sign Up - Thullo</title>
      </Helmet>
      <Auth type="signup" />;
    </>
  );
}
