import { useEffect, useRef } from 'react';
import { musicEngine } from '../utils/musicEngine';

interface AudioVisualizerProps {
  isPlaying: boolean;
  accentColor?: string;
  musicStyle?: string;
  height?: number;
}

export function AudioVisualizer({
  isPlaying,
  accentColor = '#f59e0b',
  height = 140,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let analyser = musicEngine.getAnalyser();

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const bufferLength = analyser ? analyser.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);
    let idlePhase = 0;

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      const width = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, h);

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Subtle ambient breathing wave when paused
        idlePhase += 0.03;
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.max(8, Math.sin(idlePhase + i * 0.2) * 18 + 14);
        }
      }

      // Draw mirrored frequency bars with vibrant gradient
      const barCount = 42;
      const barSpacing = 4;
      const totalBarWidth = width / barCount;
      const barWidth = Math.max(2, totalBarWidth - barSpacing);

      // Gradient for bars: Saffron -> Rose -> Amber -> Cyan
      const grad = ctx.createLinearGradient(0, h, width, 0);
      grad.addColorStop(0, '#f97316'); // Saffron orange
      grad.addColorStop(0.3, '#ec4899'); // Rose
      grad.addColorStop(0.65, '#f59e0b'); // Amber gold
      grad.addColorStop(1, '#06b6d4'); // Cyan

      ctx.fillStyle = grad;

      for (let i = 0; i < barCount; i++) {
        const dataIdx = Math.floor((i / barCount) * (bufferLength / 2));
        const val = dataArray[dataIdx] || 10;
        const normalized = val / 255;
        const barHeight = Math.max(4, normalized * (h * 0.85));

        const x = i * totalBarWidth + barSpacing / 2;
        const y = h - barHeight;

        // Rounded pill top
        ctx.beginPath();
        const r = Math.min(barWidth / 2, barHeight / 2);
        ctx.roundRect(x, y, barWidth, barHeight, [r, r, 0, 0]);
        ctx.fill();
      }

      // Draw glowing sine wave line overlay
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = accentColor;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = isPlaying ? 14 : 4;

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = (dataArray[i] / 255.0) * 0.9;
        const y = h * 0.5 - (v * h * 0.35) * Math.sin((i / bufferLength) * Math.PI);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isPlaying, accentColor]);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950/80 to-slate-900/90 border border-slate-800/80 shadow-2xl backdrop-blur-md"
      style={{ height: `${height}px` }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Decorative ambient subtle glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${accentColor} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
