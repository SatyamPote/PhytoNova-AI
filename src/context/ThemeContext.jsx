import { createContext, useContext, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const ThemeContext = createContext({
  theme: 'dark',
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function tw(...inputs) {
  return twMerge(clsx(inputs));
}

export { tw };

export function ThemeProvider({ children }) {
  const [theme] = useState('dark');

  const toggle = useCallback(() => {
    // No-op for now - dark mode only
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}