import { createContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
type Option = 'light' | 'dark' | 'system';
type SetOption = React.Dispatch<React.SetStateAction<Option>>;
type ThemeContext = {
  theme: Theme;
  option: Option;
  setOption: SetOption;
};

export const ThemeContext = createContext<ThemeContext>({
  theme: 'light',
  option: 'system',
  setOption: null as unknown as SetOption,
});

export default function ThemeProvider({ children }: { children: JSX.Element }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [option, setOption] = useState<Option>(() => {
    // must check localStorage before init theme
    if (localStorage.getItem('theme') === 'light') return 'light';
    if (localStorage.getItem('theme') === 'dark') return 'dark';
    else return 'system';
  });

  // state to localStorage
  useEffect(() => {
    if (option === 'light') localStorage.setItem('theme', 'light');
    if (option === 'dark') localStorage.setItem('theme', 'dark');
    if (option === 'system') localStorage.removeItem('theme');
    window.dispatchEvent(new Event('storage'));
  }, [option]);

  // localStorage to <html>
  useEffect(() => {
    function localStorageChange() {
      const themeInLocal = localStorage.getItem('theme');
      const rootClasses = document.documentElement.classList;
      if (themeInLocal) {
        if (themeInLocal === 'dark') rootClasses.add('dark');
        else rootClasses.remove('dark');
      } else {
        // no localStorage settings -> use system's settings
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) rootClasses.add('dark');
      }
      setTheme(rootClasses.contains('dark') ? 'dark' : 'light');
    }

    // manually call once because listener hasn't been added yet
    localStorageChange();

    // listening after
    window.addEventListener('storage', localStorageChange);
    return () => {
      window.removeEventListener('storage', localStorageChange);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, option, setOption }}>{children}</ThemeContext.Provider>
  );
}
