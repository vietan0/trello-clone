import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 Not Found - Thullo</title>
      </Helmet>
      <h1 className="text-2xl font-semibold">Sorry, the page you were looking for was not found.</h1>
      <Link to="/">Return to Home</Link>
    </>
  );
}
