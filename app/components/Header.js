import ThemeToggle from './ThemeToggle';
import ConnectBtn from './ConnectBtn';
import Link from 'next/link';

export default function Header({ isDarkTheme, toggleTheme }) {
  const handleHomeClick = (e) => {
    e.preventDefault();
    window.location.hash = 'home';
  };

  return (
    <header className="bg-background shadow-md z-50 h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <ThemeToggle isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
        <Link href="#home" passHref>
          <h1
            onClick={handleHomeClick}
            className="text-xl font-bold text-center text-primary absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
          >
            Paint for Fun
          </h1>
        </Link>
        <ConnectBtn />
      </div>
    </header>
  );
}
