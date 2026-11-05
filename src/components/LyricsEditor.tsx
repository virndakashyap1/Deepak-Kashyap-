import { useState } from 'react';
import { SUPPORTED_LANGUAGES } from '../types/song';
import { MusicStyleKey } from '../utils/musicEngine';
import { Sparkles, FileText, Wand2, RefreshCw, Languages, Lightbulb } from 'lucide-react';

interface LyricsEditorProps {
  prompt: string;
  onChangePrompt: (val: string) => void;
  language: string;
  onChangeLanguage: (val: string) => void;
  lyricsText: string;
  onChangeLyricsText: (val: string) => void;
  isGeneratingLyrics: boolean;
  onGenerateLyrics: () => void;
  musicStyle: MusicStyleKey;
  isHi: boolean;
}

export function LyricsEditor({
  prompt,
  onChangePrompt,
  language,
  onChangeLanguage,
  lyricsText,
  onChangeLyricsText,
  isGeneratingLyrics,
  onGenerateLyrics,
  musicStyle,
  isHi,
}: LyricsEditorProps) {
  const [activeTab, setActiveTab] = useState<'prompt' | 'lyrics'>('prompt');

  // Quick Inspiration chips
  const quickPrompts = [
    {
      label: isHi ? '🌧️ बारिश और चाय' : '🌧️ Monsoon & Chai',
      text: isHi
        ? 'पहली बारिश में भीगती शाम और चाय के साथ पुराने प्यार का एक सुरीला रोमांटिक गाना'
        : 'A melodious romantic song about first monsoon rain and sweet nostalgic memories',
    },
    {
      label: isHi ? '🛕 शिव तांडव / महादेव' : '🛕 Mahadev Bhajan',
      text: isHi
        ? 'काशी के पावन तट पर गंगा आरती और डमरू की गूंज के साथ महादेव का दिव्य भजन'
        : 'A divine devotional Shiva bhajan with temple bells and sacred chants',
    },
    {
      label: isHi ? '🎉 बॉलीवुड शादी डांस' : '🎉 Bollywood Party',
      text: isHi
        ? 'खुशियों से भरा जश्न, दोस्तों की महफ़िल और ढोलक की थाप पर बॉलीवुड पार्टी गीत'
        : 'An upbeat, energetic Bollywood celebration dance song with dholak beats',
    },
    {
      label: isHi ? '💔 दर्द भरी ग़ज़ल' : '💔 Emotional Sad',
      text: isHi
        ? 'टूटे दिल की दास्तान और तन्हाई की रात, बांसुरी की दर्द भरी धुन के साथ'
        : 'A deep emotional heartbreak song with melancholic flute and soft acoustic strings',
    },
    {
      label: isHi ? '☕ सुकून लो-फाई' : '☕ Midnight Lo-Fi',
      text: isHi
        ? 'रात के 2 बजे खिड़की पर बैठी यादें, धीमी धुन और लो-फाई सुकून'
        : 'Midnight chill Indian lo-fi with vintage vinyl crackle and soothing harmonium',
    },
    {
      label: isHi ? '🌾 पंजाबी भांगड़ा' : '🌾 Punjabi Folk',
      text: isHi
        ? 'पंजाब के खेतों की खुशबू, गिद्दा और भांगड़ा की मस्ती भरा लोकगीत'
        : 'Authentic Punjabi folk song with energetic dhol and joyous celebratory vibe',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>{isHi ? '1. गाने का विचार व बोल (Prompt & Lyrics)' : '1. Song Prompt & Lyrics'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isHi
              ? 'अपना Song Prompt लिखें या AI से नए सुरमयी गाने के बोल तैयार कराएं'
              : 'Write your song concept or let AI compose soulful rhyming lyrics'}
          </p>
        </div>

        {/* Language selector & Tab Switch */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Language dropdown */}
          <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs">
            <Languages className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" />
            <select
              value={language}
              onChange={(e) => onChangeLanguage(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer pr-2 font-medium"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.name} className="bg-slate-900 text-white">
                  {lang.flag} {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Toggle View: Prompt or Lyrics editor */}
          <div className="flex p-0.5 bg-slate-900 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('prompt')}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer ${
                activeTab === 'prompt'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isHi ? 'प्रॉम्प्ट' : 'Prompt'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lyrics')}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer flex items-center gap-1 ${
                activeTab === 'lyrics'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{isHi ? 'गाने के बोल' : 'Lyrics'}</span>
              {lyricsText.length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'prompt' ? (
        <div className="space-y-3">
          {/* Prompt Text Input */}
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => onChangePrompt(e.target.value)}
              rows={3}
              placeholder={
                isHi
                  ? 'जैसे: पहली बारिश में भीगी शाम का रोमांटिक गाना, या काशी विश्वनाथ की आरती, या कॉलेज फेयरवेल का भावुक गीत...'
                  : 'E.g., A soulful romantic monsoon melody about love and chai, or an energetic Punjabi wedding dance track...'
              }
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/40 resize-none transition-all leading-relaxed"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                type="button"
                onClick={onGenerateLyrics}
                disabled={isGeneratingLyrics}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/10 cursor-pointer"
              >
                {isGeneratingLyrics ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{isHi ? 'लिख रहे हैं...' : 'Composing...'}</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>{isHi ? 'AI से बोल लिखवाएं' : 'Auto-Generate Lyrics'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick inspiration ideas */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{isHi ? 'त्वरित विचार (Quick Inspirations):' : 'Quick Prompt Ideas:'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChangePrompt(p.text);
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {isHi
                ? 'अपने खुद के बोल लिखें या नीचे AI द्वारा रचित बोल को एडिट करें:'
                : 'Write your own lyrics or edit AI-generated verses below:'}
            </span>
            <button
              type="button"
              onClick={onGenerateLyrics}
              disabled={isGeneratingLyrics}
              className="text-amber-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isGeneratingLyrics ? 'animate-spin' : ''}`} />
              <span>{isHi ? 'नए बोल तैयार करें' : 'Regenerate Lyrics'}</span>
            </button>
          </div>
          <textarea
            value={lyricsText}
            onChange={(e) => onChangeLyricsText(e.target.value)}
            rows={7}
            placeholder={
              isHi
                ? '[मुखड़ा / Chorus]\nतेरी यादों की भीगी खुशबू...\n\n[अंतरा 1 / Verse 1]\nशाम ढले जब खिड़की पर...'
                : '[Chorus]\nUnderneath the monsoon sky...\n\n[Verse 1]\nRaindrops tapping on the window sill...'
            }
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/40 font-mono text-xs leading-relaxed transition-all"
          />
        </div>
      )}
    </div>
  );
}
