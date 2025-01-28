import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ isDarkTheme, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-colors duration-200 ${
        isDarkTheme
          ? 'bg-gray-200 hover:bg-accent'
          : 'bg-gray-800 hover:bg-accent'
      }`}
      aria-label={
        isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'
      }
    >
      {isDarkTheme ? (
        <Sun size={24} className="text-gray-800" />
      ) : (
        <Moon size={24} className="text-gray-200" />
      )}
    </button>
  );
}
