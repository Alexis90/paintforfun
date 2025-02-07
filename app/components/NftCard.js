import { useEffect, useRef } from 'react';

const NftCard = ({ nft }) => {
  const canvasRef = useRef(null);
  const previewSize = 256;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, previewSize, previewSize);

    const artworkData = JSON.parse(nft.artworkData);

    artworkData.forEach((pixel) => {
      ctx.fillStyle = pixel.color;
      const drawX = Math.floor(pixel.x);
      const drawY = Math.floor(pixel.y);
      ctx.fillRect(drawX, drawY, 4, 4);
    });
  }, [nft]);

  return (
    <div className="bg-secondary rounded-lg p-4 shadow-lg flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        width={previewSize}
        height={previewSize}
        className="border border-primary rounded-md mb-2"
      />
      <h2 className="text-xl font-bold text-foreground mb-2">{nft.title}</h2>
      <p className="text-sm text-foreground mb-2">{nft.description}</p>
    </div>
  );
};

export default NftCard;
