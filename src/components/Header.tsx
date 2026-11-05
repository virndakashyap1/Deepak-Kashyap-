import { Music, Sparkles, Disc3, Library } from 'lucide-react';

interface HeaderProps {
  currentLanguage: 'hi' | 'en';
  onToggleLanguage: () => void;
  onOpenLibrary: () => void;
  savedSongsCount: number;
}

export function Header({
  currentLanguage,
  onToggleLanguage,
  onOpenLibrary,
  savedSongsCount,
}: HeaderProps) {
  const isHi = currentLanguage === 'hi';

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a href="/" className="flex items-center gap-2.5 text-white whitespace-nowrap shrink-0 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-violet-600 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Disc3 className="w-6 h-6 text-white animate-spin-slow" />
            <Music className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-amber-400 via-rose-300 to-amber-200 bg-clip-text text-transparent font-brand">
                AI MADHUR SANGEET
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sangeet tracking-wide hidden sm:block">
              {isHi ? 'आधुनिक AI संगीत व गीत रचनाकार' : 'Autonomous Melodious Song Generator'}
            </p>
          </div>
        </a>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#create-studio"
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isHi ? 'गाना बनाएं' : 'Create Song'}</span>
          </a>
          <a
            href="#music-styles"
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            {isHi ? 'म्यूजिक शैलियां' : 'Music Styles'}
          </a>
          <a
            href="#voices-section"
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            {isHi ? 'गायक आवाजें' : 'Singer Voices'}
          </a>
          <button
            onClick={onOpenLibrary}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-slate-300"
          >
            <Library className="w-4 h-4 text-rose-400" />
            <span>{isHi ? 'मेरी लाइब्रेरी' : 'My Library'}</span>
            {savedSongsCount > 0 && (
              <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-800 text-amber-400 font-mono">
                {savedSongsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action area */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 text-slate-200 transition-colors whitespace-nowrap flex items-center gap-1.5"
            title="Toggle Language / भाषा बदलें"
          >
            <span className="text-amber-400">{isHi ? 'अ/A' : 'A/अ'}</span>
            <span>{isHi ? 'English' : 'हिन्दी'}</span>
          </button>

          {/* Quick Library Button on mobile / Primary CTA */}
          <button
            onClick={onOpenLibrary}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white shadow-md hover:shadow-amber-500/25 hover:opacity-95 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Library className="w-3.5 h-3.5" />
            <span>{isHi ? 'लाइब्रेरी' : 'My Songs'}</span>
            {savedSongsCount > 0 && (
              <span className="bg-black/30 px-1.5 py-0.2 rounded text-[10px]">
                {savedSongsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
