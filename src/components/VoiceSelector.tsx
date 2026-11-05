import { useState } from 'react';
import { VOICE_OPTIONS, VoicePersonaKey, VoiceOption } from '../types/song';
import { Mic, Check, Play, Square, Sparkles } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoice: VoicePersonaKey;
  onSelectVoice: (voice: VoicePersonaKey) => void;
  isHi: boolean;
}

export function VoiceSelector({
  selectedVoice,
  onSelectVoice,
  isHi,
}: VoiceSelectorProps) {
  const [testingVoice, setTestingVoice] = useState<VoicePersonaKey | null>(null);

  // Quick test voice audio using browser synth or server audio
  const handleTestVoice = async (voice: VoiceOption, e: React.MouseEvent) => {
    e.stopPropagation();

    if (testingVoice === voice.key) {
      window.speechSynthesis?.cancel();
      setTestingVoice(null);
      return;
    }

    setTestingVoice(voice.key);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const sampleText = isHi
        ? 'मधुर सुरों में बहे ये तराना, एआई मधुर संगीत का सुरीला अफसाना'
        : 'Melodious tunes flowing with heart, creating eternal music with AI Madhur Sangeet';

      const utterance = new SpeechSynthesisUtterance(sampleText);
      utterance.rate = 0.95;

      // Adjust pitch/rate to match voice timbre
      if (voice.gender === 'female') {
        utterance.pitch = 1.35;
      } else if (voice.key === 'Deep Male') {
        utterance.pitch = 0.7;
        utterance.rate = 0.9;
      } else {
        utterance.pitch = 0.95;
      }

      utterance.onend = () => setTestingVoice(null);
      utterance.onerror = () => setTestingVoice(null);

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setTestingVoice(null), 2500);
    }
  };

  return (
    <div id="voices-section" className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Mic className="w-4 h-4 text-rose-400" />
            <span>{isHi ? '2. AI गायक आवाज़ चुनें' : '2. Select AI Vocal Voice'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isHi
              ? 'प्राकृतिक, मधुर और सुरमयी पुरुष, महिला एवं युगल गायन की आवाज़'
              : 'Natural, crystal-clear male, female and duet singing voices'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {VOICE_OPTIONS.map((voice) => {
          const isSelected = selectedVoice === voice.key;
          const isTesting = testingVoice === voice.key;

          return (
            <div
              key={voice.key}
              onClick={() => onSelectVoice(voice.key)}
              className={`group relative p-3 rounded-xl border transition-all cursor-pointer text-left ${
                isSelected
                  ? 'bg-slate-900 border-rose-500/80 shadow-lg shadow-rose-500/10 ring-1 ring-rose-500/40'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${voice.avatarColor} flex items-center justify-center text-white shadow-md text-xs font-bold shrink-0`}
                  >
                    {voice.gender === 'male' ? '♂' : voice.gender === 'female' ? '♀' : '♫'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
                      <span>{isHi ? voice.labelHindi.split('(')[0] : voice.labelEnglish}</span>
                    </h4>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {voice.gender === 'duet' ? 'Dual Singers (Duet)' : `${voice.gender} Voice`}
                    </span>
                  </div>
                </div>

                {/* Test Voice Sample Button */}
                <button
                  type="button"
                  onClick={(e) => handleTestVoice(voice, e)}
                  title={isTesting ? 'Stop Voice Test' : 'Test Vocal Tone'}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer shrink-0 ${
                    isTesting
                      ? 'bg-rose-500 text-white font-bold'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {isTesting ? (
                    <Square className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                {voice.tagline}
              </p>

              <div className="mt-2.5 pt-2 border-t border-slate-800/50 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 truncate max-w-[170px]">
                  {voice.timbreDescription}
                </span>
                {isSelected && (
                  <span className="flex items-center gap-1 text-rose-400 font-semibold shrink-0">
                    <Check className="w-3.5 h-3.5" />
                    {isHi ? 'चयनित' : 'Selected'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
