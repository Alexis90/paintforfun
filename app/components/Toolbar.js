import {
  Grid,
  CloudOffIcon as GridOff,
  Palette,
  Eraser,
  Trash2,
  Share,
  Send,
} from 'lucide-react';

export default function Toolbar({
  showGrid,
  toggleGrid,
  toggleColorPalette,
  selectedColor,
  isRubberActive,
  toggleRubber,
  clearCanvas,
  onShare,
  onSend,
}) {
  return (
    <div className="inline-flex items-center justify-center space-x-2 p-2 bg-background backdrop-blur-sm rounded-full shadow-xl">
      <button
        onClick={toggleGrid}
        className={`p-2 rounded-full transition-colors duration-200 ${
          showGrid
            ? 'bg-primary text-foreground hover:bg-accent'
            : 'bg-secondary text-foreground hover:bg-accent'
        }`}
        aria-label={showGrid ? 'Hide grid' : 'Show grid'}
      >
        {showGrid ? (
          <GridOff size={24} className="text-foreground" />
        ) : (
          <Grid size={24} className="text-foreground" />
        )}
      </button>
      <button
        onClick={toggleColorPalette}
        className="p-2 rounded-full transition-colors duration-200 bg-secondary hover:bg-accent"
        aria-label="Toggle color palette"
      >
        <Palette size={24} className="text-foreground" />
      </button>
      <div
        className="w-8 h-8 rounded-full border-2 border-gray-600"
        style={{ backgroundColor: selectedColor }}
      ></div>
      <button
        onClick={toggleRubber}
        className={`p-2 rounded-full transition-colors duration-200 ${
          isRubberActive
            ? 'bg-primary text-foreground hover:bg-accent'
            : 'bg-secondary hover:bg-accent'
        }`}
        aria-label={isRubberActive ? 'Deactivate rubber' : 'Activate rubber'}
      >
        <Eraser size={24} className="text-foreground" />
      </button>
      <button
        onClick={clearCanvas}
        className="p-2 rounded-full transition-colors duration-200 bg-secondary hover:bg-accent"
        aria-label="Clear canvas"
      >
        <Trash2 size={24} className="text-foreground" />
      </button>
      <div className="w-px h-8 bg-gray-600 mx-2"></div>
      <button
        onClick={onShare}
        className="p-2 rounded-full transition-colors duration-200 bg-secondary hover:bg-accent "
        aria-label="Clear canvas"
      >
        <Share size={24} className="text-foreground" />
      </button>
      <button
        onClick={onSend}
        className="p-2 rounded-full transition-colors duration-200 bg-secondary hover:bg-accent"
        aria-label="Clear canvas"
      >
        <Send size={24} className="text-foreground" />
      </button>
    </div>
  );
}
