import { useState } from 'react';
import { SongMetadata } from '../types/song';
import { X, Copy, Check, MessageCircle, Twitter, Music, Sparkles } from 'lucide-react';

interface ShareModalProps {
  song: SongMetadata | null;
  isOpen: boolean;
  onClose: () => void;
  isHi: boolean;
}

export function ShareModal({ song, isOpen, onClose, isHi }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !song) return null;

  const shareText = `🎵 मैंने AI MADHUR SANGEET से एक खूबसूरत गाना बनाया है: "${song.title}" (${song.musicStyle} - ${song.voiceType})! 
आप भी अपना मनपसंद AI गाना अभी तैयार करें!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n${window.location.origin}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${shareText}\n${window.location.origin}`
    )}`;
    window.open(url, '_blank');
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(window.location.origin)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isHi ? 'गाना शेयर करें (Share Song)' : 'Share This Song'}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Song preview card */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">{song.title}</h4>
              <p className="text-xs text-slate-400">
                {song.musicStyle} • {song.voiceType}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-300 italic line-clamp-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
            "{song.lyrics.mukhda.split('\n')[0]}"
          </p>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleTwitter}
            className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Twitter className="w-4 h-4" />
            <span>X / Twitter</span>
          </button>
        </div>

        {/* Copy link */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5">
          <input
            type="text"
            readOnly
            value={`${window.location.origin}?song=${song.id}`}
            className="bg-transparent text-xs text-slate-400 px-2 flex-1 outline-none truncate"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{isHi ? 'कॉपी हो गया' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{isHi ? 'लिंक कॉपी' : 'Copy'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
