import { Minus, Plus } from 'lucide-react';

export default function ZoomControls({ zoom, setZoom, defaultZoom }) {
  const changeZoom = (delta) => {
    setZoom(Math.max(0.05, Math.min(2, zoom + delta)));
  };

  return (
    <div className="flex items-center justify-center space-x-4 p-2 rounded-full bg-background backdrop-blur-sm shadow-xl">
      <button
        onClick={() => changeZoom(-0.05)}
        className="p-2 bg-primary text-white rounded-full hover:bg-accent transition-colors duration-200"
        aria-label="Zoom out"
      >
        <Minus size={20} className="text-white" />
      </button>
      <span className="text-lg font-bold text-foreground">
        {zoom.toFixed(2)}x
      </span>
      <button
        onClick={() => changeZoom(0.05)}
        className="p-2 bg-primary text-white rounded-full hover:bg-accent transition-colors duration-200"
        aria-label="Zoom in"
      >
        <Plus size={20} className="text-white" />
      </button>
      <button
        onClick={() => setZoom(defaultZoom)}
        className="p-2 bg-primary text-white rounded-full hover:bg-accent transition-colors duration-200"
        aria-label="Reset zoom"
      >
        Reset
      </button>
    </div>
  );
}
