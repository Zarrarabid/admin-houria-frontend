import useTheme from '../hooks/useTheme';
import React from 'react';
import { Moon, Sun } from 'lucide-react';

const ModeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center justify-center">
            <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200
                           hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200
                           focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500
                           flex items-center justify-center"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
                {theme === 'light' ? (
                    <Moon
                        size={18}
                        className="text-yellow-500"
                    />
                ) : (
                    <Sun
                        size={18}
                        className="text-orange-400"
                    />
                )}
            </button>
        </div>
    );
};
export default ModeToggle;