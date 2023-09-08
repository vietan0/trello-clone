import Auth from '@/components/Auth';
import { Helmet } from 'react-helmet-async';

export default function SignIn() {
  return (
    <>
      <Helmet>
        <title>Sign In - Thullo</title>
      </Helmet>
      <Auth type="signin" />
    </>
  );
}
