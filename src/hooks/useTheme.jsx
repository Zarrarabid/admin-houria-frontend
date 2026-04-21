// src/hooks/useTheme.jsx
import { createContext, useContext } from 'react'; // You need createContext here to define the context.
import { ThemeContext } from '../components/ThemeProvider'; // <--- Corrected path based on your image

const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default useTheme;