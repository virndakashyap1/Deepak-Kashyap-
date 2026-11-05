import { useEffect, useRef, useState } from 'react';
import { musicEngine } from '../utils/musicEngine';
import { Activity } from 'lucide-react';

interface DynamicEqualizerProps {
  isPlaying: boolean;
  accentColor?: string;
  bandsCount?: number;
  compact?: boolean;
}

export function DynamicEqualizer({
  isPlaying,
  accentColor = '#df70bd',
  bandsCount = 20,
  compact = false,
}: DynamicEqualizerProps) {
  const [barHeights, setBarHeights] = useState<number[]>(() =>
    Array.from({ length: bandsCount }, () => 15)
  );
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const analyser = musicEngine.getAnalyser();
    const bufferLength = analyser ? analyser.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);
    let idleCounter = 0;

    const updateBars = () => {
      animFrameRef.current = requestAnimationFrame(updateBars);

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
        const newHeights: number[] = [];

        // Sample evenly across the audible spectrum (focusing on low-mid-high distribution)
        for (let i = 0; i < bandsCount; i++) {
          // Logarithmic/exponential index distribution for musical frequency representation
          const index = Math.min(
            bufferLength - 1,
            Math.floor(Math.pow(i / bandsCount, 1.35) * (bufferLength * 0.75))
          );
          const rawVal = dataArray[index] || 0;
          // Scale to percentage (15% min height to 100% max height)
          const percentage = Math.max(12, Math.min(100, (rawVal / 255) * 100));
          newHeights.push(percentage);
        }
        setBarHeights(newHeights);
      } else {
        // Ambient rhythm breathing pattern when paused
        idleCounter += 0.05;
        const idleHeights = Array.from({ length: bandsCount }, (_, i) => {
          const sine = Math.sin(idleCounter + i * 0.35);
          return Math.max(10, (sine + 1) * 14 + 10);
        });
        setBarHeights(idleHeights);
      }
    };

    updateBars();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, bandsCount]);

  return (
    <div className="flex items-center gap-2 py-1 select-none">
      <div className="flex items-center gap-1 text-[10px] text-[#e4a5ff] font-mono tracking-wider shrink-0 font-semibold opacity-90">
        <Activity className={`w-3 h-3 text-[#df70bd] ${isPlaying ? 'animate-pulse' : ''}`} />
        <span className="hidden sm:inline">LIVE EQ</span>
      </div>

      {/* Dynamic Animated Bars */}
      <div
        className="flex items-end gap-[3px] h-7 px-2 py-1 rounded-lg bg-[#171329]/90 border border-[#a477c2]/30 shadow-inner"
        style={{ minWidth: compact ? '140px' : '220px' }}
      >
        {barHeights.map((height, idx) => {
          // Color progression from warm violet to hot pink to bright amber
          const isHigh = height > 65;
          const isMid = height > 35;

          return (
            <div
              key={idx}
              className="relative flex-1 rounded-full transition-all duration-75 origin-bottom"
              style={{
                height: `${height}%`,
                background: isHigh
                  ? 'linear-gradient(to top, #a64de0, #df70bd, #ffd166)'
                  : isMid
                  ? 'linear-gradient(to top, #7b2cbf, #df70bd)'
                  : 'linear-gradient(to top, #5a189a, #a64de0)',
                boxShadow: isPlaying && isHigh ? `0 0 6px ${accentColor}` : 'none',
              }}
            >
              {/* Peak cap dot on high frequencies */}
              {isHigh && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
              )}
            </div>
          );
        })}
      </div>

      {/* Real-time kHz indicators */}
      <div className="hidden md:flex items-center gap-2 text-[9px] font-mono text-[#a477c2] shrink-0">
        <span>60Hz</span>
        <span>•</span>
        <span>1kHz</span>
        <span>•</span>
        <span>16kHz</span>
      </div>
    </div>
  );
}
