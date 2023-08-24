import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, Router, Route, RootRoute, redirect } from '@tanstack/router';
import './index.css';
import LandingPage from './routes/LandingPage.tsx';
import App from './App.tsx';
import Auth from './routes/Auth.tsx';
import User from './routes/User.tsx';
import NotFound from './routes/NotFound.tsx';
import Boards from './routes/Boards.tsx';
import Board from './routes/Board.tsx';
import ThemeProvider from './context/ThemeProvider.tsx';
import CurrentUserProvider from './context/CurrentUserProvider.tsx';
import supabase from './supabase/index.ts';

// Create a root route
const rootRoute = new RootRoute({
  component: () => (
    <ThemeProvider>
      <CurrentUserProvider>
        <App />
      </CurrentUserProvider>
    </ThemeProvider>
  ),
});

// Create an index route
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const authRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: Auth,
});

const userRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/u/$userId',
  beforeLoad: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      // /u/$userId and all child routes will redirect if not logged in
      throw redirect({
        to: '/auth',
        search: {
          redirect: router.state.location.href,
        },
      });
    }
  },
});

const userIndexRoute = new Route({
  getParentRoute: () => userRoute,
  path: '/',
  component: User,
});

const boardsRoute = new Route({
  getParentRoute: () => userRoute,
  path: '/boards',
});

const boardsIndexRoute = new Route({
  getParentRoute: () => boardsRoute,
  path: '/',
  component: Boards,
});

const boardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/b/$boardId',
  component: Board,
  beforeLoad: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      // /b/$boardId and all child routes will redirect if not logged in
      throw redirect({
        to: '/auth',
        search: {
          redirect: router.state.location.href,
        },
      });
    }
  },
});

const notFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFound,
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute,
  userRoute.addChildren([userIndexRoute, boardsRoute.addChildren([boardsIndexRoute, boardRoute])]),
  notFoundRoute,
]);
// Create the router using your route tree
const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module '@tanstack/router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
