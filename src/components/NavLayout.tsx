import { Outlet } from 'react-router-dom';
import Nav from './Nav';

export default function Layout() {
  // everything in this component will be shared
  return (
    <>
      <Nav />
      <div className="px-12 py-4">
        <Outlet />
      </div>
    </>
  );
}
