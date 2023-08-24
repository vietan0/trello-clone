import { useContext } from 'react';
import { MantineProvider } from '@mantine/core';
import { ThemeContext } from './context/ThemeProvider';
import { Link, Outlet } from '@tanstack/router';

export default function App() {
  const { theme } = useContext(ThemeContext);

  return (
    // theme object only applies to Mantine components
    <MantineProvider
      theme={{
        fontFamily: 'Inter, sans-serif',
        fontFamilyMonospace: 'Roboto Mono, IBM Plex Mono, JetBrains Mono, monospace',
        colorScheme: theme,
      }}
    >
      <div id="App">
        <Link to="/">
          <h1 className="text-xl">App (Root)</h1>
        </Link>
        <Outlet />
      </div>
      {/* <TanStackRouterDevtools /> */}
    </MantineProvider>
  );
}
