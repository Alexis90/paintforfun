import Image from 'next/image';

export default function HomePage() {
  const handleHash = (e, hash) => {
    e.preventDefault();
    switch (hash) {
      case 'paint':
        window.location.hash = 'paint';
        break;
      case 'council':
        window.location.hash = 'council';
        break;
      case 'collections':
        window.location.hash = 'collections';
        break;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-background text-foreground">
      <main className="flex flex-col items-center justify-center w-full max-w-4xl px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-primary">
          Welcome to Paint for Fun
        </h1>

        <p className="text-lg md:text-xl mb-8">
          Unleash your creativity with our pixel art editor!
        </p>

        <div className="relative w-64 h-64 mb-8">
          <Image
            src="/single-mode.webp"
            alt="Pixel Art"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={(e) => {
              handleHash(e, 'paint');
            }}
            className="bg-primary hover:bg-accent text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            Start Painting
          </button>
          <button
            onClick={(e) => {
              handleHash(e, 'council');
            }}
            className="bg-secondary hover:bg-accent text-foreground font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            View Council
          </button>
          <button
            onClick={(e) => {
              handleHash(e, 'collections');
            }}
            className="bg-secondary hover:bg-accent text-foreground font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            NFT Collections
          </button>
        </div>
      </main>
    </div>
  );
}
