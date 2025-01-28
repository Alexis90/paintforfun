'use client';

import { useState, useMemo } from 'react';
import { Pipette, Plus, X, Palette, RefreshCw } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import PropTypes from 'prop-types';

const MAX_COLORS = 25;

const INITIAL_COLORS = [
  // Row 1
  { color: '#000000' }, // Black (q)
  { color: '#FFFFFF' }, // White (w)
  { color: '#E0E0E0' }, // Light gray (e)
  { color: '#9E9E9E' }, // Gray (r)
  { color: '#8D6E63' }, // Brown (t)
  // Row 2
  { color: '#00A4B4' }, // Teal (a)
  { color: '#2196F3' }, // Blue (s)
  { color: '#9C27B0' }, // Purple (d)
  { color: '#FF69B4' }, // Hot pink (g)
  { color: '#FF0000' }, // Red (b)
  // Row 3
  { color: '#4CAF50' }, // Green (z)
  { color: '#8BC34A' }, // Light green (x)
  { color: '#FFEB3B' }, // Yellow (c)
  { color: '#FF9800' }, // Orange (v)
  { color: '#FF6600' }, // Bright Orange (f)
];

function hexToHSL(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function HSLToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  const toHex = (n) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function generateShades(color) {
  const hsl = hexToHSL(color);
  return [20, 35, 50, 65, 80].map((l) => HSLToHex(hsl.h, hsl.s, l));
}

export default function ColorPalette({ color, onColorChange, isVisible }) {
  const [colors, setColors] = useState(INITIAL_COLORS);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const shades = useMemo(() => generateShades(color), [color]);

  const handleAddColor = (colorToAdd) => {
    if (colors.length >= MAX_COLORS) {
      alert(`You can only have up to ${MAX_COLORS} colors.`);
      return;
    }
    if (colorToAdd === 'transparent') {
      if (!colors.some((c) => c.color === 'transparent')) {
        setColors((prev) => [{ color: 'transparent' }, ...prev]);
      }
      return;
    }
    const normalizedColorToAdd = colorToAdd.toUpperCase();
    if (colors.some((c) => c.color.toUpperCase() === normalizedColorToAdd)) {
      return;
    }
    setColors((prev) => [...prev, { color: normalizedColorToAdd }]);
  };

  const handleRemoveColor = (colorToRemove) => {
    setColors((prev) => prev.filter((c) => c.color !== colorToRemove));
  };

  const handleResetColors = () => {
    setColors(INITIAL_COLORS);
  };

  if (!isVisible) return null;

  const isModified = JSON.stringify(colors) !== JSON.stringify(INITIAL_COLORS);

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 w-60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-2xl border-border/50 z-50 p-2 space-y-2 rounded-lg">
      <div className="p-2 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Colors</h2>
          <div className="flex gap-0.5">
            {isModified && (
              <button
                className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={handleResetColors}
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
            <button
              className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <Palette className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-0.5 w-48">
          {colors.map(({ color: colorHex }) => (
            <div key={colorHex} className="relative group">
              <button
                className={`w-7 h-7 rounded-md border border-gray-300 dark:border-gray-600 transition-transform hover:scale-110 relative ${
                  color === colorHex
                    ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-background'
                    : ''
                }`}
                style={{ backgroundColor: colorHex }}
                onClick={() => onColorChange(colorHex)}
              ></button>
              <button
                onClick={() => handleRemoveColor(colorHex)}
                className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 text-white rounded-full hidden group-hover:flex items-center justify-center"
              >
                <X className="w-2 h-2" />
              </button>
            </div>
          ))}
        </div>

        {showColorPicker && (
          <>
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Color Picker</h3>
              <HexColorPicker
                color={color}
                onChange={onColorChange}
                style={{ width: '100%', height: '140px' }}
              />
            </div>
          </>
        )}

        <hr className="my-2 border-gray-200 dark:border-gray-700" />

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Shades</h3>
          <div className="flex flex-wrap gap-0.5">
            {shades.map((shade, i) => (
              <button
                key={shade}
                className={`w-8 h-8 rounded-md border border-gray-300 dark:border-gray-600 transition-transform hover:scale-110 ${
                  color === shade
                    ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-800'
                    : ''
                }`}
                style={{ backgroundColor: shade }}
                onClick={() => onColorChange(shade)}
              >
                <span className="sr-only">Shade {i + 1}</span>
              </button>
            ))}
          </div>
        </div>

        <hr className="my-2 border-gray-200 dark:border-gray-700" />

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Hex code</h3>
          <div className="flex items-center space-x-0.5">
            <div className="flex items-center flex-1 h-7 rounded-md border border-gray-600 bg-secondary">
              {color === 'transparent' ? (
                <div
                  className="w-full h-full rounded-md"
                  style={{
                    backgroundImage:
                      'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                    backgroundSize: '8px 8px',
                    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                  }}
                />
              ) : (
                <>
                  <span className="px-2 text-foreground">#</span>
                  <input
                    type="text"
                    value={color.replace('#', '').toUpperCase()}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      if (/^[0-9A-F]{0,6}$/i.test(newColor)) {
                        onColorChange(`#${newColor}`);
                      }
                    }}
                    className="flex-1 h-7 border-0 bg-transparent text-xs font-mono focus:outline-none focus:ring-0 px-0"
                  />
                </>
              )}
            </div>
            <button
              onClick={() => {
                if (/^#?[0-9A-F]{6}$/i.test(color)) {
                  handleAddColor(color);
                }
              }}
              className="p-1 rounded-md hover:bg-accent"
            >
              <Plus className="w-4 h-4" />
              <span className="sr-only">Add to custom colors</span>
            </button>
            <button
              onClick={async () => {
                try {
                  // @ts-ignore - EyeDropper API is not yet in TypeScript
                  const eyeDropper = new EyeDropper();
                  const result = await eyeDropper.open();
                  handleAddColor(result.sRGBHex);
                  onColorChange(result.sRGBHex);
                } catch (e) {
                  console.log(
                    'Your browser does not support the EyeDropper API'
                  );
                }
              }}
              className="p-1 rounded-md hover:bg-accen"
            >
              <Pipette className="w-4 h-4" />
              <span className="sr-only">Pick Color</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ColorPalette.propTypes = {
  color: PropTypes.string.isRequired,
  onColorChange: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
};
