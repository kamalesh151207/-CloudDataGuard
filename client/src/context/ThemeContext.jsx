import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('cloud_dataguard_theme');
    return saved || 'whiteblue';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-whiteblue', 'theme-aquasmart', 'theme-cyberpunk', 'theme-builtin', 'theme-cyber', 'theme-navy', 'theme-light', 'dark', 'light');

    if (theme === 'cyberpunk') {
      root.classList.add('theme-cyberpunk', 'dark');
    } else if (theme === 'aquasmart') {
      root.classList.add('theme-aquasmart', 'light');
    } else if (theme === 'builtin') {
      root.classList.add('theme-builtin', 'light');
    } else {
      root.classList.add('theme-whiteblue', 'light');
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
