import { useState, useEffect } from 'react';
import { SongMetadata } from '../types/song';
import { musicEngine, MUSIC_STYLES } from '../utils/musicEngine';
import { AudioVisualizer } from './AudioVisualizer';
import { DynamicEqualizer } from './DynamicEqualizer';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
  Heart,
  Volume2,
  Sliders,
  Sparkles,
  Disc3,
  Music,
  Check,
  Radio,
} from 'lucide-react';

interface MasterPlayerProps {
  currentSong: SongMetadata | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSaveSong: (song: SongMetadata) => void;
  onShareSong: (song: SongMetadata) => void;
  onRegenerate: () => void;
  isSaved: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isHi: boolean;
}

export function MasterPlayer({
  currentSong,
  isPlaying,
  onTogglePlay,
  onSaveSong,
  onShareSong,
  onRegenerate,
  isSaved,
  isFavorite,
  onToggleFavorite,
  isHi,
}: MasterPlayerProps) {
  // Mixer channels
  const [playbackMode, setPlaybackMode] = useState<'full' | 'vocals' | 'music'>('full');
  const [vocalVolume, setVocalVolume] = useState(0.9);
  const [musicVolume, setMusicVolume] = useState(0.75);
  const [showMixer, setShowMixer] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Time ticker when playing
  useEffect(() => {
    let timer: number;
    if (isPlaying && currentSong) {
      timer = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= (currentSong.durationSec || 40)) {
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentSong]);

  // Handle channel volume changes
  useEffect(() => {
    if (playbackMode === 'vocals') {
      musicEngine.setVolumes(0.85, 0, vocalVolume);
    } else if (playbackMode === 'music') {
      musicEngine.setVolumes(0.85, musicVolume, 0);
    } else {
      musicEngine.setVolumes(0.85, musicVolume, vocalVolume);
    }
  }, [playbackMode, vocalVolume, musicVolume]);

  if (!currentSong) return null;

  const styleConfig = MUSIC_STYLES[currentSong.musicStyle] || MUSIC_STYLES['Romantic Music'];
  const totalDuration = currentSong.durationSec || 40;

  // Format seconds mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Download 1-Click Master Audio File
  const handleDownloadMaster = async () => {
    try {
      setIsExporting(true);
      const wavBlob = await musicEngine.exportMasterSongBlob(
        currentSong.audioWavBase64 || null,
        currentSong.musicStyle,
        totalDuration
      );

      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      const cleanTitle = (currentSong.title || 'Madhur_Sangeet_Song')
        .replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_')
        .slice(0, 30);
      a.download = `${cleanTitle}_AI_Madhur_Sangeet.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Formatted Lyrics for Karaoke viewer
  const lyricsText =
    currentSong.lyrics.mukhda +
    '\n\n' +
    (currentSong.lyrics.antara1 || '') +
    (currentSong.lyrics.antara2 ? '\n\n' + currentSong.lyrics.antara2 : '') +
    (currentSong.lyrics.bridge ? '\n\n' + currentSong.lyrics.bridge : '') +
    (currentSong.lyrics.outro ? '\n\n' + currentSong.lyrics.outro : '');

  const lyricLines = lyricsText.split('\n').filter((l) => l.trim().length > 0);
  const activeLineIndex = Math.min(
    lyricLines.length - 1,
    Math.floor((currentTime / totalDuration) * lyricLines.length)
  );

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Decorative ambient background blur */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ backgroundColor: styleConfig.color }}
      />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none bg-rose-600" />

      {/* Top Bar: Song Title & Quick Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          {/* Spinning Vinyl Record Badge */}
          <div className="relative w-14 h-14 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-lg">
            <Disc3
              className={`w-12 h-12 text-slate-400 ${isPlaying ? 'animate-spin-slow text-amber-400' : ''}`}
            />
            <div
              className="absolute w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow"
              style={{ backgroundColor: styleConfig.color }}
            >
              ♫
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg md:text-xl font-bold text-white font-brand tracking-tight truncate">
                {currentSong.title}
              </h2>
              {currentSong.lyrics.suggestedRaagOrScale && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                  {currentSong.lyrics.suggestedRaagOrScale}
                </span>
              )}
            </div>

            {/* Dynamic Visual Equalizer below the song title */}
            <div className="mt-1">
              <DynamicEqualizer
                isPlaying={isPlaying}
                accentColor={styleConfig.color}
                bandsCount={24}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
              <span className="text-slate-300 font-medium">
                {isHi ? styleConfig.hindiName : currentSong.musicStyle}
              </span>
              <span>•</span>
              <span className="text-rose-400">{currentSong.voiceType}</span>
              <span>•</span>
              <span className="text-slate-400">{currentSong.language}</span>
              <span>•</span>
              <span className="font-mono text-slate-400">{styleConfig.bpm} BPM</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* Favorite Toggle */}
          <button
            type="button"
            onClick={() => onToggleFavorite(currentSong.id)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Favorite Song"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Share Song */}
          <button
            type="button"
            onClick={() => onShareSong(currentSong)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Share Song"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Save to library */}
          <button
            type="button"
            onClick={() => onSaveSong(currentSong)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isSaved
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isSaved ? (isHi ? 'सेव्ड' : 'Saved') : isHi ? 'सेव करें' : 'Save'}</span>
          </button>

          {/* Download Audio Button */}
          <button
            type="button"
            onClick={handleDownloadMaster}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-slate-950 font-bold text-xs shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>
              {isExporting
                ? isHi
                  ? 'मास्टरिंग...'
                  : 'Mastering...'
                : downloadSuccess
                  ? isHi
                    ? 'डाउनलोड हो गया!'
                    : 'Downloaded!'
                  : isHi
                    ? 'डाउनलोड MP3 / Audio'
                    : 'Download Audio'}
            </span>
          </button>
        </div>
      </div>

      {/* Centerpiece: Real-time Audio Visualizer */}
      <div className="my-4">
        <AudioVisualizer isPlaying={isPlaying} accentColor={styleConfig.color} height={120} />
      </div>

      {/* Progress Seek bar & Time Display */}
      <div className="space-y-1 mb-4">
        <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden relative cursor-pointer">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-400 transition-all duration-300 rounded-full"
            style={{ width: `${(currentTime / totalDuration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span className="flex items-center gap-1">
            {isPlaying && <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />}
            <span>{formatTime(totalDuration)}</span>
          </span>
        </div>
      </div>

      {/* Player Primary Controls & Mixer Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Playback Mode (Vocals + Music / Vocals Only / Music Only) */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-center">
          <button
            type="button"
            onClick={() => setPlaybackMode('full')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              playbackMode === 'full'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isHi ? 'पूरा गाना' : 'Full Song'}
          </button>
          <button
            type="button"
            onClick={() => setPlaybackMode('vocals')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              playbackMode === 'vocals'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isHi ? 'केवल आवाज़' : 'Vocals'}
          </button>
          <button
            type="button"
            onClick={() => setPlaybackMode('music')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              playbackMode === 'music'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isHi ? 'म्यूजिक / कराओके' : 'Music Only'}
          </button>
        </div>

        {/* Center Main Play / Pause Circle */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setCurrentTime(0)}
            className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Restart Track"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current text-slate-950" />
            ) : (
              <Play className="w-6 h-6 fill-current text-slate-950 ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={onRegenerate}
            className="p-2.5 rounded-full text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
            title={isHi ? 'गाना दोबारा बनाएं' : 'Regenerate Track'}
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        {/* Mixer Toggle & Volume */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowMixer(!showMixer)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showMixer
                ? 'bg-slate-800 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isHi ? 'मिक्सर व वॉल्यूम' : 'Studio Mixer'}</span>
          </button>
        </div>
      </div>

      {/* Expanded Mixer Tray */}
      {showMixer && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/50 p-3 rounded-xl">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-amber-400" />
                <span>{isHi ? 'बैकग्राउंड म्यूजिक स्तर' : 'Backing Music Track'}</span>
              </span>
              <span className="font-mono text-slate-400">{Math.round(musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                <span>{isHi ? 'गायक वोकल स्तर' : 'Singer Vocal Track'}</span>
              </span>
              <span className="font-mono text-slate-400">{Math.round(vocalVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={vocalVolume}
              onChange={(e) => setVocalVolume(parseFloat(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Karaoke Scrolling Lyrics Highlight */}
      <div className="mt-4 pt-4 border-t border-slate-800/80">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>{isHi ? 'लाइव कराओके बोल (Live Lyrics):' : 'Synchronized Lyrics:'}</span>
          <span className="text-[11px] text-amber-400/80">
            {isHi ? 'सुर के साथ गाएं' : 'Sing Along'}
          </span>
        </div>

        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-2 scrollbar-thin">
          {lyricLines.map((line, idx) => {
            const isCurrent = idx === activeLineIndex;
            return (
              <p
                key={idx}
                className={`text-sm md:text-base transition-all duration-300 rounded px-2 py-0.5 ${
                  isCurrent
                    ? 'text-amber-300 font-bold bg-amber-500/10 scale-[1.01]'
                    : 'text-slate-400'
                }`}
              >
                {line}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
