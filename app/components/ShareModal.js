import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, shareLink }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background bg-opacity-80 backdrop-blur-md p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Share Your Pixel Art
        </h2>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={shareLink}
            readOnly
            className="flex-grow p-2 border rounded bg-secondary text-foreground"
          />
          <button
            onClick={copyToClipboard}
            className="p-2 bg-primary text-white rounded hover:bg-accent transition-colors duration-200"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full p-2 bg-secondary text-foreground rounded hover:bg-gray-500 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}
