import { useState } from 'react';
import { MUSIC_STYLES, MusicStyleKey, musicEngine } from '../utils/musicEngine';
import { Volume2, VolumeX, Sparkles, Check } from 'lucide-react';

interface MusicStyleSelectorProps {
  selectedStyle: MusicStyleKey;
  onSelectStyle: (style: MusicStyleKey) => void;
  isHi: boolean;
}

export function MusicStyleSelector({
  selectedStyle,
  onSelectStyle,
  isHi,
}: MusicStyleSelectorProps) {
  const [auditioningStyle, setAuditioningStyle] = useState<MusicStyleKey | null>(null);

  const toggleAudition = (styleKey: MusicStyleKey, e: React.MouseEvent) => {
    e.stopPropagation();
    if (auditioningStyle === styleKey) {
      musicEngine.stopMusic();
      setAuditioningStyle(null);
    } else {
      musicEngine.startMusic(styleKey);
      setAuditioningStyle(styleKey);
    }
  };

  const styleKeys = Object.keys(MUSIC_STYLES) as MusicStyleKey[];

  return (
    <div id="music-styles" className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isHi ? '3. मनपसंद म्यूजिक स्टाइल चुनें' : '3. Select Music Style'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isHi
              ? 'AI इस शैली के अनुसार वाद्य यंत्र, ताल और बैकग्राउंड म्यूजिक तैयार करेगा'
              : 'AI orchestrates backing instruments, tempo, and rhythm patterns'}
          </p>
        </div>
      </div>

      {/* Grid of styles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {styleKeys.map((key) => {
          const config = MUSIC_STYLES[key];
          const isSelected = selectedStyle === key;
          const isAuditioning = auditioningStyle === key;

          return (
            <div
              key={key}
              onClick={() => {
                onSelectStyle(key);
                if (auditioningStyle && auditioningStyle !== key) {
                  musicEngine.startMusic(key);
                  setAuditioningStyle(key);
                }
              }}
              className={`group relative p-3 rounded-xl border transition-all cursor-pointer text-left overflow-hidden ${
                isSelected
                  ? 'bg-slate-900 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {/* Subtle accent corner glow */}
              <div
                className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-10 transition-opacity group-hover:opacity-20 ${
                  isSelected ? 'opacity-25' : ''
                }`}
                style={{ backgroundColor: config.color }}
              />

              <div className="flex items-start justify-between gap-1 mb-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5"
                  style={{ backgroundColor: config.color }}
                />
                <button
                  type="button"
                  onClick={(e) => toggleAudition(key, e)}
                  title={isAuditioning ? 'Stop Preview' : 'Preview Beat & Melody'}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    isAuditioning
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {isAuditioning ? (
                    <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="font-semibold text-sm text-slate-100 flex items-center justify-between">
                <span>{isHi ? config.hindiName : config.name}</span>
                {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
              </div>

              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {config.description}
              </p>

              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/50 text-[10px] text-slate-500 font-mono">
                <span>{config.bpm} BPM</span>
                <span className="capitalize">{config.rhythmPattern}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
