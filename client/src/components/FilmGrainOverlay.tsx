import React, { useEffect, useRef } from 'react';

interface FilmGrainOverlayProps {
  enabled: boolean;
}

export const FilmGrainOverlay: React.FC<FilmGrainOverlayProps> = ({ enabled }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      // Render noise grain every 2 frames for retro 12-18 fps projector flicker
      if (frame % 2 === 0) {
        const w = (canvas.width = window.innerWidth / 4);
        const h = (canvas.height = window.innerHeight / 4);
        const imgData = ctx.createImageData(w, h);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const val = Math.random() * 255;
          data[i] = val; // R
          data[i + 1] = val; // G
          data[i + 2] = val; // B
          data[i + 3] = Math.random() < 0.08 ? 35 : 12; // Grain alpha
        }
        ctx.putImageData(imgData, 0, 0);

        // Occasional film scratch line
        if (Math.random() < 0.15) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          const scratchX = Math.random() * w;
          ctx.moveTo(scratchX, 0);
          ctx.lineTo(scratchX + (Math.random() - 0.5) * 10, h);
          ctx.stroke();
        }
      }
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {/* Canvas for animated film dust and grain */}
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-60 mix-blend-overlay image-rendering-pixelated"
      />

      {/* Sepia tone color grading tint */}
      <div className="absolute inset-0 bg-[#7a532d]/15 mix-blend-color pointer-events-none" />

      {/* Vignette border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 120px rgba(10, 5, 2, 0.85), inset 0 0 40px rgba(0, 0, 0, 0.95)',
        }}
      />
    </div>
  );
};
