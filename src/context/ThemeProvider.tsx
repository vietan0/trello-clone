import { createContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type Option = 'light' | 'dark' | 'os';
type SetOption = React.Dispatch<React.SetStateAction<Option>>;
type ThemeContext = {
  theme: Theme;
  option: Option;
  setOption: SetOption;
};

export const ThemeContext = createContext<ThemeContext>({
  theme: 'light',
  option: 'os',
  setOption: null as unknown as SetOption,
});

export default function ThemeProvider({ children }: { children: JSX.Element }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [option, setOption] = useState<Option>(() => {
    // must check localStorage before init theme
    if (localStorage.getItem('theme') === 'light') return 'light';
    if (localStorage.getItem('theme') === 'dark') return 'dark';
    else return 'os';
  });

  // state to localStorage
  useEffect(() => {
    if (option === 'light') localStorage.setItem('theme', 'light');
    if (option === 'dark') localStorage.setItem('theme', 'dark');
    if (option === 'os') localStorage.removeItem('theme');
    window.dispatchEvent(new Event('storage'));
  }, [option]);

  // localStorage to <html>
  useEffect(() => {
    function localStorageChange() {
      const themeInLocal = localStorage.getItem('theme');
      if (themeInLocal) {
        if (themeInLocal === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      } else {
        // no localStorage settings -> use system's settings
        if (window.matchMedia('(prefers-color-scheme: dark)').matches)
          document.documentElement.classList.add('dark');
      }
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
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