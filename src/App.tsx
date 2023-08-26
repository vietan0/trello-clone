import { Link, Outlet } from '@tanstack/router';

export default function App() {
  return (
    <>
      <div
        id="App"
        className="min-h-screen bg-white text-neutral-900 dark:text-white dark:bg-neutral-900"
      >
        <Link to="/">
          <h1 className="text-xl">App (Root)</h1>
        </Link>
        <Outlet />
      </div>
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
