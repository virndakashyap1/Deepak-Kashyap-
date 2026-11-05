import { SongMetadata } from '../types/song';
import { MUSIC_STYLES, musicEngine } from '../utils/musicEngine';
import {
  X,
  Play,
  Heart,
  Trash2,
  Download,
  Share2,
  Music,
  Disc3,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: SongMetadata[];
  currentSongId?: string;
  isPlaying: boolean;
  onSelectSong: (song: SongMetadata) => void;
  onToggleFavorite: (songId: string) => void;
  onDeleteSong: (songId: string) => void;
  onShareSong: (song: SongMetadata) => void;
  isHi: boolean;
}

export function LibraryModal({
  isOpen,
  onClose,
  songs,
  currentSongId,
  isPlaying,
  onSelectSong,
  onToggleFavorite,
  onDeleteSong,
  onShareSong,
  isHi,
}: LibraryModalProps) {
  if (!isOpen) return null;

  const handleDownload = async (song: SongMetadata, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const blob = await musicEngine.exportMasterSongBlob(
        song.audioWavBase64 || null,
        song.musicStyle,
        song.durationSec || 40
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanTitle = (song.title || 'Madhur_Sangeet').replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_');
      a.download = `${cleanTitle}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow">
              <Disc3 className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-brand">
                {isHi ? 'मेरी लाइब्रेरी (My Songs)' : 'My Song Library'}
              </h3>
              <p className="text-xs text-slate-400">
                {songs.length} {isHi ? 'तैयार गाने सेव हैं' : 'songs stored locally'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Song List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {songs.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Music className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-slate-400 text-sm">
                {isHi ? 'अभी तक कोई गाना सेव नहीं है।' : 'No songs saved yet.'}
              </p>
              <p className="text-xs text-slate-500">
                {isHi
                  ? 'अपना पहला मधुर गाना बनाएं और यहां सुरक्षित करें!'
                  : 'Compose your first AI song and save it here!'}
              </p>
            </div>
          ) : (
            songs.map((song) => {
              const style = MUSIC_STYLES[song.musicStyle] || MUSIC_STYLES['Romantic Music'];
              const isCurrent = currentSongId === song.id;

              return (
                <div
                  key={song.id}
                  onClick={() => onSelectSong(song)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                    isCurrent
                      ? 'bg-slate-900 border-amber-500/80 ring-1 ring-amber-500/30'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors shadow ${
                        isCurrent && isPlaying
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-200 group-hover:bg-amber-500 group-hover:text-slate-950'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>

                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-100 truncate group-hover:text-amber-300 transition-colors">
                        {song.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="text-slate-300">
                          {isHi ? style.hindiName : song.musicStyle}
                        </span>
                        <span>•</span>
                        <span className="text-rose-400">{song.voiceType}</span>
                        <span>•</span>
                        <span>{song.language}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(song.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        song.isFavorite
                          ? 'text-rose-400 hover:text-rose-300'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title="Favorite"
                    >
                      <Heart className={`w-4 h-4 ${song.isFavorite ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShareSong(song);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-white transition-colors cursor-pointer"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDownload(song, e)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                      title="Download Audio"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSong(song.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete from Library"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
