'use client';

import { useState, useEffect } from 'react';
import Canvas from './Canvas';
import ZoomControls from './ZoomControls';
import Toolbar from './Toolbar';
import ColorPalette from './ColorPalette';
import ShareModal from './ShareModal';
import SendModal from './SendModal';
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

import submitArtwork from '../services/artworks';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const DEFAULT_ZOOM = 0.5;
const GRID_SIZE = 16;
const CANVAS_SIZE = GRID_SIZE * GRID_SIZE;

export default function PixelArtEditor({ dataJsonString }) {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [showGrid, setShowGrid] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [grid, setGrid] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedGrid = localStorage.getItem('pixelArtGrid');
      return savedGrid
        ? JSON.parse(savedGrid)
        : Array(CANVAS_SIZE)
            .fill()
            .map(() => Array(CANVAS_SIZE).fill(null));
    }
    return Array(CANVAS_SIZE)
      .fill()
      .map(() => Array(CANVAS_SIZE).fill(null));
  });
  const [isRubberActive, setIsRubberActive] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  const [isReadOnly, setIsReadOnly] = useState(false);

  const walletAddress = useSelector((state) => state.wallet.address);
  const canSumbitArt = useSelector((state) => state.wallet.canSumbitArt);

  useEffect(() => {
    if (!dataJsonString) return;

    setIsReadOnly(true);

    const parsedData = decompressFromEncodedURIComponent(dataJsonString);
    const pixels = JSON.parse(parsedData);

    pixels.forEach((pixel) => updateGrid(pixel.x, pixel.y, pixel.color));
  }, [dataJsonString]);

  useEffect(() => {
    localStorage.setItem('pixelArtGrid', JSON.stringify(grid));
  }, [grid]);

  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  const toggleColorPalette = () => {
    setShowColorPalette(!showColorPalette);
  };

  const toggleRubber = () => {
    setIsRubberActive(!isRubberActive);
  };

  const clearCanvas = () => {
    const clearedGrid = Array(CANVAS_SIZE)
      .fill()
      .map(() => Array(CANVAS_SIZE).fill(null));
    setGrid(clearedGrid);
    localStorage.removeItem('pixelArtGrid');
  };

  const updateGrid = (x, y, color) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[y][x] = color;
      return newGrid;
    });
  };

  const exportPixelArt = (grid) => {
    const exportedData = [];

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] !== null) {
          exportedData.push({ x, y, color: grid[y][x] });
        }
      }
    }

    return exportedData;
  };

  const handlePaste = (imageData) => {
    const newGrid = [...grid];
    for (let y = 0; y < CANVAS_SIZE; y++) {
      for (let x = 0; x < CANVAS_SIZE; x++) {
        const index = (y * CANVAS_SIZE + x) * 4;
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
        const a = imageData.data[index + 3];
        if (a > 0) {
          newGrid[y][x] = `rgba(${r},${g},${b},${a / 255})`;
        }
      }
    }
    setGrid(newGrid);
  };

  const shareArt = () => {
    const pixelArtGrid = localStorage.getItem('pixelArtGrid');
    const formattedData = exportPixelArt(JSON.parse(pixelArtGrid));
    if (!formattedData.length) {
      return toast.error("Let's draw something first");
    }

    const compressedData = compressToEncodedURIComponent(
      JSON.stringify(formattedData)
    );

    setShareLink(`${window.location.origin}/#paint?data=${compressedData}`);
    setIsShareModalOpen(true);
  };

  const handleSend = async ({ title, description, xAccount }) => {
    if (!walletAddress || !canSumbitArt) {
      return toast.error('You have to be a token holder to send art');
    }
    const pixelArtGrid = localStorage.getItem('pixelArtGrid');
    const formattedData = exportPixelArt(JSON.parse(pixelArtGrid));
    const data = {
      title,
      description,
      artwork: JSON.stringify(formattedData),
      walletAddress,
      xAccount,
    };
    try {
      await submitArtwork(data);
    } catch (error) {
      toast.log(error.message || 'Failed to submit art');
    }
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="container mx-auto p-4">
          {!isReadOnly && (
            <div className="flex justify-center mb-4">
              <Toolbar
                showGrid={showGrid}
                toggleGrid={toggleGrid}
                toggleColorPalette={toggleColorPalette}
                selectedColor={selectedColor}
                isRubberActive={isRubberActive}
                toggleRubber={toggleRubber}
                clearCanvas={clearCanvas}
                onShare={shareArt}
                onSend={() => {
                  setIsSendModalOpen(true);
                }}
              />
            </div>
          )}

          <main className="flex flex-col items-center">
            <div className="relative w-full max-w-[min(512px,90vw)] mx-auto">
              <div
                className="p-4 rounded-lg bg-secondary backdrop-blur-md shadow-lg overflow-hidden"
                style={{ aspectRatio: '1 / 1' }}
              >
                <Canvas
                  zoom={zoom}
                  showGrid={showGrid}
                  grid={grid}
                  updateGrid={updateGrid}
                  selectedColor={selectedColor}
                  isRubberActive={isRubberActive}
                  onPaste={handlePaste}
                />
              </div>
            </div>
            <div className="mt-4">
              <ZoomControls
                zoom={zoom}
                setZoom={setZoom}
                defaultZoom={DEFAULT_ZOOM}
              />
            </div>
          </main>
        </div>
        <ColorPalette
          color={selectedColor}
          onColorChange={setSelectedColor}
          isVisible={showColorPalette}
        />
      </div>
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareLink={shareLink}
      />
      <SendModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        onSend={handleSend}
      />
    </>
  );
}
