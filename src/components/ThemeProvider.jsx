import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the ThemeContext
// This context is defined at the top level of this file.
// If you were to split this into separate files, ThemeContext would typically be in src/contexts/ThemeContext.jsx
// and then imported into ThemeProvider.jsx and useTheme.jsx.
export const ThemeContext = createContext(null);

// ThemeProvider component to manage and provide the theme
// src/components/ThemeProvider.jsx or src/components/ThemeProvider.tsx
export const ThemeProvider = ({ children, defaultTheme = 'system', storageKey = 'vite-ui-theme' }) => {
    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem(storageKey);
        if (storedTheme) {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            if (theme === 'system') {
                const root = window.document.documentElement;
                root.classList.remove('light', 'dark');
                root.classList.add(e.matches ? 'dark' : 'light');
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const value = {
        theme,
        setTheme: (newTheme) => {
            localStorage.setItem(storageKey, newTheme);
            setTheme(newTheme);
        },
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};