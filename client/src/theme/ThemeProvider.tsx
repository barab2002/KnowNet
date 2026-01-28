import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem('theme') as Theme | null;
      if (stored) return stored;
    } catch (e) {}
    return 'system';
  });

  useEffect(() => {
    const root = document.documentElement;

    const apply = (t: Theme) => {
      if (t === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', prefersDark);
      } else {
        root.classList.toggle('dark', t === 'dark');
      }
    };

    apply(theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {}

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') apply('system');
    };
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export default ThemeProvider;
