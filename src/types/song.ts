import { MusicStyleKey } from '../utils/musicEngine';

export type VoicePersonaKey =
  | 'Sweet Male'
  | 'Sweet Female'
  | 'Romantic Male'
  | 'Romantic Female'
  | 'Soft Melodious'
  | 'Deep Male'
  | 'Sweet Female Singing Voice'
  | 'Male + Female Duet';

export interface VoiceOption {
  key: VoicePersonaKey;
  labelHindi: string;
  labelEnglish: string;
  gender: 'male' | 'female' | 'duet';
  tagline: string;
  avatarColor: string;
  timbreDescription: string;
}

export const VOICE_OPTIONS: VoiceOption[] = [
  {
    key: 'Sweet Male',
    labelHindi: 'मधुर पुरुष स्वर (Sweet Male)',
    labelEnglish: 'Sweet Male Voice',
    gender: 'male',
    tagline: 'मीठा, कोमल और सुरीला आवाज़ (Arijit/Atif style)',
    avatarColor: 'from-blue-500 to-indigo-600',
    timbreDescription: 'Acoustic warm tenor with gentle vibrato and soft highs',
  },
  {
    key: 'Sweet Female',
    labelHindi: 'मधुर नारी स्वर (Sweet Female)',
    labelEnglish: 'Sweet Female Voice',
    gender: 'female',
    tagline: 'कोमल, शहद सी मिठास भरी आवाज़ (Shreya style)',
    avatarColor: 'from-pink-500 to-rose-600',
    timbreDescription: 'Sweet, bright soprano with effortless melodic ornamentations',
  },
  {
    key: 'Romantic Male',
    labelHindi: 'रोमांटिक पुरुष स्वर (Romantic Male)',
    labelEnglish: 'Romantic Male Voice',
    gender: 'male',
    tagline: 'दिलों को छू लेने वाला नशीला अहसास',
    avatarColor: 'from-purple-500 to-indigo-700',
    timbreDescription: 'Intimate, breathy romantic tone with velvety lower mids',
  },
  {
    key: 'Romantic Female',
    labelHindi: 'रोमांटिक नारी स्वर (Romantic Female)',
    labelEnglish: 'Romantic Female Voice',
    gender: 'female',
    tagline: 'जज़्बातों और मोहब्बत से भरा सुरीला अंदाज़',
    avatarColor: 'from-rose-500 to-amber-500',
    timbreDescription: 'Sensual, tender romantic phrasing with soulful pitch dynamics',
  },
  {
    key: 'Soft Melodious',
    labelHindi: 'शांत व मधुर स्वर (Soft Melodious)',
    labelEnglish: 'Soft Melodious Voice',
    gender: 'female',
    tagline: 'सुकून और लोरी जैसा ध्यानमयी असर',
    avatarColor: 'from-teal-500 to-emerald-600',
    timbreDescription: 'Subtle whisper-soft resonance, tranquil meditative aura',
  },
  {
    key: 'Deep Male',
    labelHindi: 'गहरा व रौबदार स्वर (Deep Male)',
    labelEnglish: 'Deep Male Voice',
    gender: 'male',
    tagline: 'ग़ज़ल और सूफी अंदाज़ का भारी बेस स्वर (Jagjit style)',
    avatarColor: 'from-amber-600 to-orange-800',
    timbreDescription: 'Rich baritone with deep chest resonance and royal gravitas',
  },
  {
    key: 'Sweet Female Singing Voice',
    labelHindi: 'शास्त्रीय सुरीली गायिका (Singing Voice)',
    labelEnglish: 'Sweet Female Singing Voice',
    gender: 'female',
    tagline: 'शास्त्रीय आलाप और लोक धुनों में माहिर',
    avatarColor: 'from-fuchsia-500 to-pink-600',
    timbreDescription: 'Crystal clear singing timbre with Indian classical harkat and taans',
  },
  {
    key: 'Male + Female Duet',
    labelHindi: 'युगल गीत स्वर (Male + Female Duet)',
    labelEnglish: 'Male + Female Duet Voice',
    gender: 'duet',
    tagline: 'नायक और नायिका का एक साथ सुरीला मिलन',
    avatarColor: 'from-violet-600 via-pink-500 to-amber-500',
    timbreDescription: 'Harmonious multi-speaker duet pairing with alternating dialogue lines',
  },
];

export interface SongLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: SongLanguage[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🌐' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🌾' },
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी', flag: '🪕' },
  { code: 'hr', name: 'Haryanvi', nativeName: 'हरियाणवी', flag: '🥁' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🪘' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🚩' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🪈' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🪕' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🎻' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🌙' },
];

export interface SongMetadata {
  id: string;
  title: string;
  prompt: string;
  musicStyle: MusicStyleKey;
  voiceType: VoicePersonaKey;
  language: string;
  createdAt: number;
  lyrics: {
    title?: string;
    mukhda: string;
    antara1: string;
    antara2?: string;
    bridge?: string;
    outro?: string;
    suggestedRaagOrScale?: string;
    recommendedBpm?: number;
    rhythmPattern?: string;
    musicalCues?: string;
  };
  audioWavBase64?: string;
  durationSec: number;
  isFavorite?: boolean;
}
