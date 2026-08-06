import React, { useEffect, useRef } from 'react';

interface AnimatedECGProps {
  bpm?: number;
  color?: string;
  height?: number;
  showParticles?: boolean;
}

export const AnimatedECG: React.FC<AnimatedECGProps> = ({
  bpm = 75,
  color = '#38BDF8',
  height = 80,
  showParticles = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let x = 0;
    const points: { x: number; y: number }[] = [];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    const getECGY = (time: number) => {
      const midY = canvas.height / 2;
      const cycle = (time % (60000 / bpm)) / (60000 / bpm); // 0 to 1

      // Simulated PQRST wave
      if (cycle > 0.15 && cycle < 0.22) {
        // P Wave
        return midY - Math.sin((cycle - 0.15) / 0.07 * Math.PI) * 8;
      } else if (cycle >= 0.30 && cycle < 0.33) {
        // Q Wave
        return midY + 6;
      } else if (cycle >= 0.33 && cycle < 0.38) {
        // R Spike
        return midY - (canvas.height * 0.42);
      } else if (cycle >= 0.38 && cycle < 0.42) {
        // S Dip
        return midY + (canvas.height * 0.25);
      } else if (cycle >= 0.50 && cycle < 0.65) {
        // T Wave
        return midY - Math.sin((cycle - 0.50) / 0.15 * Math.PI) * 14;
      }
      return midY + (Math.random() - 0.5) * 1.5; // subtle background noise
    };

    let startTime = Date.now();

    const render = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      x = (x + 2.5) % canvas.width;

      const y = getECGY(elapsed);
      points.push({ x, y });

      if (points.length > canvas.width / 2.5) {
        points.shift();
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.lineWidth = 1;
      for (let gridX = 0; gridX < canvas.width; gridX += 20) {
        ctx.beginPath();
        ctx.moveTo(gridX, 0);
        ctx.lineTo(gridX, canvas.height);
        ctx.stroke();
      }
      for (let gridY = 0; gridY < canvas.height; gridY += 20) {
        ctx.beginPath();
        ctx.moveTo(0, gridY);
        ctx.lineTo(canvas.width, gridY);
        ctx.stroke();
      }

      // Draw Waveform Line
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;

      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        if (i === 0) {
          ctx.moveTo(pt.x, pt.y);
        } else {
          // Reset line path if wrapping around screen width
          if (Math.abs(pt.x - points[i - 1].x) > 10) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
      }
      ctx.stroke();

      // Lead glowing tip particle
      if (showParticles && points.length > 0) {
        const lastPt = points[points.length - 1];
        ctx.beginPath();
        ctx.fillStyle = '#FFFFFF';
        ctx.arc(lastPt.x, lastPt.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(lastPt.x, lastPt.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [bpm, color, height, showParticles]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-slate-950/80 border border-slate-800 p-2">
      <div className="absolute top-2 left-3 flex items-center gap-2 text-xs font-mono text-cyan-400">
        <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        LEAD II | {bpm} BPM TELEMETRY
      </div>
      <canvas ref={canvasRef} style={{ height: `${height}px`, width: '100%' }} />
    </div>
  );
};
