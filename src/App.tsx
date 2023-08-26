import { Link, Outlet } from '@tanstack/router';

export default function App() {
  return (
    <>
      <div id="App">
        <Outlet />
      </div>
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
