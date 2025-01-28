'use client';

import { useRef, useEffect } from 'react';

const GRID_SIZE = 16; // 16x16 tiles
const TILE_SIZE = 16; // 16x16 pixels per tile
const CANVAS_SIZE = GRID_SIZE * TILE_SIZE;
const PIXEL_SCALE = 20; // Scale factor for pixels

export default function Canvas({
  zoom,
  showGrid,
  grid,
  updateGrid,
  selectedColor,
  isRubberActive,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw tiles with interval colors
    for (let tileY = 0; tileY < GRID_SIZE; tileY++) {
      for (let tileX = 0; tileX < GRID_SIZE; tileX++) {
        const isEvenTile = (tileX + tileY) % 2 === 0;
        ctx.fillStyle = isEvenTile ? '#ffffff' : '#f0f0f0';
        ctx.fillRect(
          tileX * TILE_SIZE * PIXEL_SCALE,
          tileY * TILE_SIZE * PIXEL_SCALE,
          TILE_SIZE * PIXEL_SCALE,
          TILE_SIZE * PIXEL_SCALE
        );
      }
    }

    // Draw pixels and their outlines
    for (let y = 0; y < CANVAS_SIZE; y++) {
      for (let x = 0; x < CANVAS_SIZE; x++) {
        const pixelX = x * PIXEL_SCALE;
        const pixelY = y * PIXEL_SCALE;

        if (grid[y][x]) {
          ctx.fillStyle = grid[y][x];
          ctx.fillRect(pixelX, pixelY, PIXEL_SCALE, PIXEL_SCALE);
        }

        // Draw pixel outline only if showGrid is true
        if (showGrid) {
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.strokeRect(pixelX, pixelY, PIXEL_SCALE, PIXEL_SCALE);
        }
      }
    }

    // Draw tile grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 2;

      for (let i = 0; i <= GRID_SIZE; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * TILE_SIZE * PIXEL_SCALE, 0);
        ctx.lineTo(i * TILE_SIZE * PIXEL_SCALE, CANVAS_SIZE * PIXEL_SCALE);
        ctx.stroke();

        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * TILE_SIZE * PIXEL_SCALE);
        ctx.lineTo(CANVAS_SIZE * PIXEL_SCALE, i * TILE_SIZE * PIXEL_SCALE);
        ctx.stroke();
      }
    }
  }, [grid, showGrid]);

  const handleMouseDown = (e) => {
    isDrawingRef.current = true;
    draw(e);
  };

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current) return;
    draw(e);
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const draw = (e) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = (CANVAS_SIZE * PIXEL_SCALE) / rect.width;
    const scaleY = (CANVAS_SIZE * PIXEL_SCALE) / rect.height;

    const x = Math.floor(((e.clientX - rect.left) * scaleX) / PIXEL_SCALE);
    const y = Math.floor(((e.clientY - rect.top) * scaleY) / PIXEL_SCALE);

    if (x >= 0 && x < CANVAS_SIZE && y >= 0 && y < CANVAS_SIZE) {
      updateGrid(x, y, isRubberActive ? null : selectedColor);
    }
  };

  const handleTouchStart = (e) => {
    isDrawingRef.current = true;
    drawTouch(e.touches[0]);
  };

  const handleTouchMove = (e) => {
    if (!isDrawingRef.current) return;
    drawTouch(e.touches[0]);
  };

  const handleTouchEnd = () => {
    isDrawingRef.current = false;
  };

  const drawTouch = (touch) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = (CANVAS_SIZE * PIXEL_SCALE) / rect.width;
    const scaleY = (CANVAS_SIZE * PIXEL_SCALE) / rect.height;

    const x = Math.floor(((touch.clientX - rect.left) * scaleX) / PIXEL_SCALE);
    const y = Math.floor(((touch.clientY - rect.top) * scaleY) / PIXEL_SCALE);

    if (x >= 0 && x < CANVAS_SIZE && y >= 0 && y < CANVAS_SIZE) {
      updateGrid(x, y, isRubberActive ? null : selectedColor);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full overflow-auto touch-none">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE * PIXEL_SCALE}
        height={CANVAS_SIZE * PIXEL_SCALE}
        style={{
          width: `${CANVAS_SIZE * PIXEL_SCALE * zoom}px`,
          height: `${CANVAS_SIZE * PIXEL_SCALE * zoom}px`,
          imageRendering: 'pixelated',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
}
