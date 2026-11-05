import { useState, useEffect } from 'react';
import { MasterPlayer } from './components/MasterPlayer';
import { LibraryModal } from './components/LibraryModal';
import { ShareModal } from './components/ShareModal';
import { MusicStyleKey, musicEngine, MUSIC_STYLES } from './utils/musicEngine';
import { VoicePersonaKey, SongMetadata, VOICE_OPTIONS, SUPPORTED_LANGUAGES } from './types/song';
import {
  getSavedSongs,
  addSongToLibrary,
  toggleFavoriteSong,
  deleteSongFromLibrary,
} from './utils/songStorage';
import {
  Sparkles,
  Music,
  Disc3,
  Wand2,
  RefreshCw,
  Library,
  Play,
  Download,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

export default function App() {
  // Input states matching user specifications
  const [prompt, setPrompt] = useState<string>('');
  const [language, setLanguage] = useState<string>('Hindi');
  const [voice, setVoice] = useState<VoicePersonaKey>('Male + Female Duet');
  const [style, setStyle] = useState<MusicStyleKey>('Romantic Music');

  // Status and loading states
  const [statusText, setStatusText] = useState<string>('आपका AI Song Studio तैयार है।');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Playback & Library
  const [currentSong, setCurrentSong] = useState<SongMetadata | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [savedSongs, setSavedSongs] = useState<SongMetadata[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [shareSongTarget, setShareSongTarget] = useState<SongMetadata | null>(null);

  // Load showcase songs from storage on mount
  useEffect(() => {
    const songs = getSavedSongs();
    setSavedSongs(songs);
    if (songs.length > 0 && !currentSong) {
      setCurrentSong(songs[0]);
    }
  }, []);

  // Quick suggestions for fast testing on mobile & desktop
  const quickIdeas = [
    'पहली बारिश में भीगती शाम और चाय के साथ सुरीला रोमांटिक गाना',
    'काशी के पावन तट पर गंगा आरती और महादेव का दिव्य भजन',
    'खुशियों से भरा जश्न और ढोलक की थाप पर बॉलीवुड पार्टी गीत',
    'रात के 2 बजे खिड़की पर बैठी यादें और लो-फाई सुकून',
    'पंजाब के खेतों की खुशबू और भांगड़ा की मस्ती भरा लोकगीत',
  ];

  // Core Song Generation Handler
  const generateSong = async () => {
    if (!prompt.trim()) {
      alert('पहले गाने का आइडिया या नाम लिखें!');
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMessage(null);
      setStatusText('१/३: AI सुरमयी बोल (Lyrics) लिख रहा है...');

      // 1. Generate poetic lyrics
      const lyricsRes = await fetch('/api/gemini/generate-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          language,
          musicStyle: style,
          voiceType: voice,
        }),
      });

      const lyricsJson = await lyricsRes.json();
      if (!lyricsRes.ok) {
        throw new Error(lyricsJson.error || 'Failed to compose lyrics');
      }

      const songData = lyricsJson.data || {};
      const songTitle = songData.title || prompt.slice(0, 30);
      const mukhda = songData.mukhda || songData.lyrics?.mukhda || prompt;
      const antara1 = songData.antara1 || songData.lyrics?.antara1 || '';
      const antara2 = songData.antara2 || songData.lyrics?.antara2 || '';
      const bridge = songData.bridge || songData.lyrics?.bridge || '';
      const outro = songData.outro || songData.lyrics?.outro || '';

      const fullLyricsText = `[Title: ${songTitle}]\n\n[Mukhda / Chorus]\n${mukhda}\n\n[Antara 1]\n${antara1}\n\n[Antara 2]\n${antara2}\n\n[Bridge]\n${bridge}\n\n[Outro]\n${outro}`;

      // 2. Synthesize AI Vocal Audio (TTS)
      setStatusText(`२/३: ${voice} में मधुर आवाज़ तैयार की जा रही है...`);

      let vocalBase64: string | undefined;
      try {
        const vocalRes = await fetch('/api/gemini/generate-vocals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lyricsText: fullLyricsText,
            voiceType: voice,
            style: `${style} singing with natural melody and emotion`,
          }),
        });

        const vJson = await vocalRes.json();
        if (vocalRes.ok && vJson.audioBase64) {
          vocalBase64 = vJson.audioBase64;
        }
      } catch (vocalErr) {
        console.warn('Vocal generation note:', vocalErr);
      }

      // 3. Orchestrate Background Music & Master Mix
      setStatusText('३/३: बैकग्राउंड म्यूजिक और वाद्य यंत्रों का मास्टर मिक्स...');

      const newSong: SongMetadata = {
        id: `song-${Date.now()}`,
        title: songTitle,
        prompt,
        musicStyle: style,
        voiceType: voice,
        language,
        createdAt: Date.now(),
        lyrics: {
          title: songTitle,
          mukhda,
          antara1,
          antara2: antara2 || undefined,
          bridge: bridge || undefined,
          outro: outro || undefined,
          suggestedRaagOrScale: songData.suggestedRaagOrScale || 'Raag Yaman / Melodic Scale',
          recommendedBpm: songData.recommendedBpm || 84,
          rhythmPattern: songData.rhythmPattern || 'Keherwa 8-beat',
          musicalCues: songData.musicalCues || 'Tanpura, Sitar, Bansuri and Rhythm percussion',
        },
        audioWavBase64: vocalBase64,
        durationSec: 42,
        isFavorite: false,
      };

      const updated = addSongToLibrary(newSong);
      setSavedSongs(updated);
      setCurrentSong(newSong);

      // Start playing newly generated song
      startSongPlayback(newSong);

      setStatusText(`🎉 आपका गाना "${songTitle}" सफलतापूर्वक तैयार हो गया है! नीचे सुनें और डाउनलोड करें।`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'गाना तैयार करने में समस्या आई। कृपया पुनः प्रयास करें।');
      setStatusText('गाना बनाने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsGenerating(false);
    }
  };

  // Playback control
  const startSongPlayback = (song: SongMetadata) => {
    musicEngine.stopAll();
    musicEngine.startMusic(song.musicStyle);

    if (song.audioWavBase64) {
      musicEngine.playVocals(song.audioWavBase64, () => {
        setIsPlaying(false);
      });
    }

    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (!currentSong) return;
    if (isPlaying) {
      musicEngine.stopMusic();
      musicEngine.pauseVocals();
      setIsPlaying(false);
    } else {
      musicEngine.startMusic(currentSong.musicStyle);
      musicEngine.resumeVocals();
      setIsPlaying(true);
    }
  };

  // Library actions
  const handleToggleFavorite = (id: string) => {
    const updated = toggleFavoriteSong(id);
    setSavedSongs(updated);
    if (currentSong?.id === id) {
      setCurrentSong({ ...currentSong, isFavorite: !currentSong.isFavorite });
    }
  };

  const handleDeleteSong = (id: string) => {
    const updated = deleteSongFromLibrary(id);
    setSavedSongs(updated);
    if (currentSong?.id === id && updated.length > 0) {
      setCurrentSong(updated[0]);
    }
  };

  return (
    <div className="min-h-screen text-white p-3 sm:p-5 flex flex-col items-center">
      <div className="w-full max-w-[680px] mx-auto">
        {/* Header matching exact user specifications */}
        <header className="text-center py-6 px-2">
          <div className="text-[55px] text-[#e4a5ff] leading-none mb-1 select-none animate-pulse-glow">
            ♫
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-bold text-[#e8b4ff] tracking-tight">
            AI MADHUR SANGEET
          </h1>
          <p className="text-[#d8b4e2] text-sm sm:text-base mt-1 font-sangeet">
            अपना खुद का मधुर गाना बनाएं
          </p>

          {/* Quick status badges */}
          <div className="flex items-center justify-center gap-3 mt-3 text-xs text-[#c8a5db]">
            <button
              onClick={() => setIsLibraryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#28213e] hover:bg-[#392d59] border border-[#a477c2]/50 text-white transition-colors cursor-pointer"
            >
              <Library className="w-3.5 h-3.5 text-[#e4a5ff]" />
              <span>मेरी लाइब्रेरी ({savedSongs.length})</span>
            </button>
            <span className="flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Android & Web Friendly</span>
            </span>
          </div>
        </header>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="font-bold cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* Main Creation Card matching exact user specifications */}
        <div className="bg-[#28213e] p-5 sm:p-6 rounded-[18px] mb-5 shadow-2xl border border-[#a477c2]/30">
          <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
            <span>🎵 अपना गाना लिखें</span>
          </h3>

          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="यहाँ गाने का नाम या आइडिया लिखें..."
            rows={3}
            className="w-full p-3.5 mt-2 mb-3 rounded-[10px] border border-[#a477c2] bg-[#171329] text-white text-base focus:outline-none focus:ring-2 focus:ring-[#df70bd] transition-all resize-none"
          />

          {/* Quick idea chips */}
          <div className="mb-4 space-y-1.5">
            <div className="flex items-center gap-1 text-xs text-[#d1aae6]">
              <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
              <span>त्वरित सुझाव (Idea click करें):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickIdeas.map((idea, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(idea)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-[#171329] hover:bg-[#34244b] border border-[#a477c2]/40 text-[#eedaff] transition-colors cursor-pointer text-left"
                >
                  {idea.slice(0, 32)}...
                </button>
              ))}
            </div>
          </div>

          <h3 className="text-base font-semibold text-white mb-1">🌐 भाषा चुनें</h3>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-3.5 mt-1.5 mb-4 rounded-[10px] border border-[#a477c2] bg-[#171329] text-white text-base focus:outline-none cursor-pointer"
          >
            <option value="Hindi">Hindi (हिन्दी)</option>
            <option value="English">English</option>
            <option value="Bhojpuri">Bhojpuri (भोजपुरी)</option>
            <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
            <option value="Haryanvi">Haryanvi (हरियाणवी)</option>
            <option value="Gujarati">Gujarati (ગુજરાતી)</option>
            <option value="Marathi">Marathi (मराठी)</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
            <option value="Bengali">Bengali (বাংলা)</option>
            <option value="Urdu">Urdu (اردو)</option>
          </select>

          <h3 className="text-base font-semibold text-white mb-1">🎙️ Voice Selection</h3>
          <select
            id="voice"
            value={voice}
            onChange={(e) => setVoice(e.target.value as VoicePersonaKey)}
            className="w-full p-3.5 mt-1.5 mb-4 rounded-[10px] border border-[#a477c2] bg-[#171329] text-white text-base focus:outline-none cursor-pointer"
          >
            <option value="Male + Female Duet">Male + Female Duet (युगल गीत)</option>
            <option value="Sweet Male">Sweet Male Voice (मधुर पुरुष स्वर)</option>
            <option value="Sweet Female">Sweet Female Voice (मधुर नारी स्वर)</option>
            <option value="Romantic Male">Romantic Male Voice (रोमांटिक पुरुष)</option>
            <option value="Romantic Female">Romantic Female Voice (रोमांटिक नारी)</option>
            <option value="Soft Melodious">Soft Melodious Voice (शांत सुरीला स्वर)</option>
            <option value="Deep Male">Deep Male Voice (गहरा रौबदार स्वर)</option>
            <option value="Sweet Female Singing Voice">Sweet Female Singing Voice (गायिका आलाप)</option>
          </select>

          <h3 className="text-base font-semibold text-white mb-1">🎹 Music Style</h3>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value as MusicStyleKey)}
            className="w-full p-3.5 mt-1.5 mb-5 rounded-[10px] border border-[#a477c2] bg-[#171329] text-white text-base focus:outline-none cursor-pointer"
          >
            <option value="Romantic Music">Romantic (रोमांटिक - बांसुरी व पियानो)</option>
            <option value="Sad Music">Sad (दर्द भरा / विरह)</option>
            <option value="Devotional Music">Devotional (भक्ति भाव / मंदिर घंटियां)</option>
            <option value="Bhajan Music">Bhajan (पारंपरिक भजन - ढोलक व हारमोनियम)</option>
            <option value="Bollywood-inspired Music">Bollywood-inspired (बॉलीवुड तड़का)</option>
            <option value="Classical Music">Classical (शास्त्रीय राग - तानपूरा व सितार)</option>
            <option value="Folk Music">Folk (देसी लोकगीत / भांगड़ा ढोल)</option>
            <option value="DJ Music">DJ (डीजे पार्टी बीट्स)</option>
            <option value="Instrumental Music">Instrumental (मधुर वाद्य संगीत)</option>
            <option value="Lo-fi Music">Lo-fi (लो-फाई चिल सुकून)</option>
          </select>

          {/* Master Big Generate Button matching user specs */}
          <button
            type="button"
            onClick={generateSong}
            disabled={isGenerating}
            className="w-full p-4 border-0 rounded-[12px] bg-gradient-to-r from-[#a64de0] to-[#df70bd] hover:opacity-95 text-white text-[17px] font-bold shadow-lg shadow-[#a64de0]/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>तैयार किया जा रहा है...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>✨ GENERATE MY SONG</span>
              </>
            )}
          </button>

          {/* Dynamic Status Text */}
          <p id="status" className="text-[#e5c9f7] text-center text-sm mt-4 font-medium leading-relaxed">
            {statusText}
          </p>
        </div>

        {/* Master Player Component: High Quality Audio, Waveform, Live Karaoke & MP3 Download */}
        {currentSong && (
          <div className="mb-5 space-y-2 animate-in fade-in">
            <MasterPlayer
              currentSong={currentSong}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onSaveSong={(song) => {
                const updated = addSongToLibrary(song);
                setSavedSongs(updated);
              }}
              onShareSong={(song) => setShareSongTarget(song)}
              onRegenerate={generateSong}
              isSaved={savedSongs.some((s) => s.id === currentSong.id)}
              isFavorite={Boolean(currentSong.isFavorite)}
              onToggleFavorite={handleToggleFavorite}
              isHi={true}
            />
          </div>
        )}

        {/* Saved Songs Quick Showcase List */}
        <div className="bg-[#28213e]/80 p-4 rounded-[18px] border border-[#a477c2]/20 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Disc3 className="w-4 h-4 text-[#e4a5ff]" />
              <span>तैयार गानों की लाइब्रेरी ({savedSongs.length})</span>
            </h4>
            <button
              onClick={() => setIsLibraryOpen(true)}
              className="text-xs text-[#e4a5ff] hover:underline font-semibold cursor-pointer"
            >
              सभी देखें →
            </button>
          </div>

          <div className="space-y-2">
            {savedSongs.slice(0, 3).map((song) => {
              const isCurrent = currentSong?.id === song.id;
              return (
                <div
                  key={song.id}
                  onClick={() => {
                    setCurrentSong(song);
                    startSongPlayback(song);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-[#3b2b5a] border-[#df70bd]'
                      : 'bg-[#171329] border-[#a477c2]/30 hover:bg-[#251d3b]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isCurrent && isPlaying
                          ? 'bg-[#df70bd] text-white'
                          : 'bg-[#2b2046] text-[#e4a5ff]'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{song.title}</p>
                      <p className="text-xs text-[#c8a5db] truncate">
                        {song.musicStyle} • {song.voiceType}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#a477c2] shrink-0 font-mono">
                    {song.durationSec || 42}s
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-[#a477c2] py-4 space-y-1">
          <p>© AI MADHUR SANGEET – Complete AI Song Generator</p>
          <p className="text-[11px] text-[#865d9f]">
            मोबाइल और कंप्यूटर दोनों पर आसानी से उपयोग करने योग्य।
          </p>
        </footer>
      </div>

      {/* Modals */}
      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        songs={savedSongs}
        currentSongId={currentSong?.id}
        isPlaying={isPlaying}
        onSelectSong={(song) => {
          setCurrentSong(song);
          startSongPlayback(song);
          setIsLibraryOpen(false);
        }}
        onToggleFavorite={handleToggleFavorite}
        onDeleteSong={handleDeleteSong}
        onShareSong={(song) => setShareSongTarget(song)}
        isHi={true}
      />

      <ShareModal
        song={shareSongTarget}
        isOpen={Boolean(shareSongTarget)}
        onClose={() => setShareSongTarget(null)}
        isHi={true}
      />
    </div>
  );
}
