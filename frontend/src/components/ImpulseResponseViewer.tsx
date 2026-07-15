import React, { useRef, useEffect } from 'react';

interface ImpulseResponseViewerProps {
  data: number[];
}

export const ImpulseResponseViewer: React.FC<ImpulseResponseViewerProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    // Background
    ctx.fillStyle = '#0c0e14';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(42, 45, 56, 0.6)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let x = 0; x < w; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = 0; y < h; y += 20) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();

    if (!data || data.length === 0) {
      ctx.fillStyle = 'rgba(86, 90, 110, 0.4)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('NO SIGNAL DATA', w / 2, h / 2 + 4);
      return;
    }

    const maxVal = Math.max(...data, 0.0001);
    const sliceWidth = w / data.length;

    // Gradient fill under the curve
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, 'rgba(74, 222, 128, 0.35)');
    gradient.addColorStop(0.6, 'rgba(74, 222, 128, 0.08)');
    gradient.addColorStop(1, 'rgba(74, 222, 128, 0.0)');

    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let i = 0; i < data.length; i++) {
      const x = i * sliceWidth;
      const normalized = data[i] / maxVal;
      ctx.lineTo(x, h - (normalized * h));
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Stroke line on top with glow
    ctx.shadowColor = 'rgba(74, 222, 128, 0.4)';
    ctx.shadowBlur = 5;
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = i * sliceWidth;
      const normalized = data[i] / maxVal;
      const y = h - (normalized * h);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

  }, [data]);

  return (
    <div className="w-full h-32 relative rounded overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
