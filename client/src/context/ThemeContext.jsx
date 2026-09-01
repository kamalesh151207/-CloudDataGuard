import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('cloud_dataguard_theme');
    return saved || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-cyber', 'theme-navy', 'theme-light', 'dark', 'light');

    if (theme === 'cyber') {
      root.classList.add('theme-cyber', 'dark');
    } else if (theme === 'navy') {
      root.classList.add('theme-navy', 'dark');
    } else {
      root.classList.add('theme-light', 'light');
    }

    localStorage.setItem('cloud_dataguard_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'cyber') return 'navy';
      if (prev === 'navy') return 'light';
      return 'cyber';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
