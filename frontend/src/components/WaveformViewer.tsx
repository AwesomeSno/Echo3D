import React, { useRef, useEffect } from 'react';

interface WaveformViewerProps {
  data: number[];
}

export const WaveformViewer: React.FC<WaveformViewerProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Draw background
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, 0, width, height);

    // Draw center line
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.strokeStyle = '#333';
    ctx.stroke();

    // Draw waveform
    ctx.beginPath();
    ctx.strokeStyle = '#00ffcc'; // Cyberpunk green/cyan
    ctx.lineWidth = 1;

    const sliceWidth = width * 1.0 / data.length;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      // Audio data is typically -1.0 to 1.0
      const v = (data[i] + 1) / 2.0; // Normalize to 0.0 - 1.0
      const y = v * height;

      if (i === 0) {
        ctx.moveTo(x, height - y);
      } else {
        ctx.lineTo(x, height - y);
      }
      x += sliceWidth;
    }

    ctx.stroke();
  }, [data]);

  return (
    <div className="w-full rounded bg-gray-900 border border-gray-700 overflow-hidden shadow-inner p-2">
      <h3 className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">Raw Echo Waveform</h3>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={200} 
        className="w-full h-48 block"
      />
    </div>
  );
};
