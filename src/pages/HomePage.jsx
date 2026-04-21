import React from 'react'; // React is needed for JSX
import useTheme from '../hooks/useTheme'; // Path assuming HomePage is in src/pages and useTheme in src/hooks
import ModeToggle from '../components/ModeToggle'; // Path assuming HomePage is in src/pages and ModeToggle in src/components
const HomePage = ({ setCurrentPage }) => {
    const { theme } = useTheme(); // Now useTheme is called within a component rendered inside ThemeProvider
    // Placeholder for userId since Firebase is removed. In a real app, you'd manage user state differently.
    const userId = "anonymous-user-id";

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-4 transition-colors duration-300">
            <h1 className="text-4xl font-bold mb-6">Vite + React + Tailwind + Shadcn UI</h1>
            <p className="text-lg mb-8 text-center max-w-lg">
                This is a starter template with dark/light mode enabled.
                Current User ID: <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm break-all">{userId}</span>
            </p>

            <div className="flex gap-4 mb-8">
                <ModeToggle />
                <button
                    onClick={() => setCurrentPage('dashboard')}
                    className="px-6 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200"
                >
                    Go to Admin Dashboard
                </button>
            </div>

            {/* Example of a div that changes background based on theme */}
            <div className="mt-8 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-2xl font-semibold mb-3">Theme Demonstration</h2>
                <p>
                    This box changes its background and text color based on the current theme.
                    You can see how Tailwind's `dark:` utility classes are applied.
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Current theme: <span className="font-bold">{theme}</span>
                </p>
            </div>

            {/* Placeholder for Shadcn UI Component */}
            <div className="mt-8 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <h2 className="text-2xl font-semibold mb-3">Shadcn UI Placeholder</h2>
                <p>
                    Once you have Shadcn UI installed in your actual project, you can add components here.
                    For example, you would run `npx shadcn@latest add button` and then import `Button` and use it.
                </p>
                {/* A simple mock button to represent a Shadcn component */}
                <button className="mt-4 px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-300">
                    Mock Shadcn Button
                </button>
            </div>
        </div>
    );
};

export default HomePage
