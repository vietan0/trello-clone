import { Helmet } from 'react-helmet-async';
import Nav from '../components/Nav';

export default function LandingPage() {
  return (
    <>
      <Helmet>
        <title>Thullo - Landing Page</title>
      </Helmet>
      <h1 className="text-xl">Landing Page</h1>
    </>
  );
}
