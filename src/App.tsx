import { Outlet } from '@tanstack/router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function App() {
  return (
    <>
      <div id="App">
        <Outlet />
      </div>
      {/* <TanStackRouterDevtools /> */}
      <ReactQueryDevtools />
    </>
  );
}
