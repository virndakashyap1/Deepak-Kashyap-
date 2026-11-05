import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
// AI Studio dev server must run on port 3000
const PORT = process.env.NODE_ENV === 'production' && process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json({ limit: '50mb' }));

// Shared server-side Gemini client
const getAiClient = () => {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. Generate Song Lyrics Endpoint
app.post('/api/gemini/generate-lyrics', async (req, res) => {
  try {
    const { prompt, language = 'Hindi', musicStyle = 'Romantic', mood = 'Melodious', voiceType = 'Sweet Male' } = req.body;

    if (!prompt && !musicStyle) {
      return res.status(400).json({ error: 'Song prompt or music style is required.' });
    }

    const ai = getAiClient();

    const systemInstruction = `You are a legendary Indian music lyricist and composer for "AI MADHUR SANGEET".
Your task is to write heart-touching, poetic, rhyming, and perfectly metered song lyrics in the requested language and musical style.
The lyrics must be formatted into clear song sections:
- [Title]: Catchy, poetic title
- [Mukhda / Chorus]: The main melodic hook (2-4 lines, deeply catchy and rhyming)
- [Antara 1 / Verse 1]: Story progression, emotional depth (4 lines)
- [Antara 2 / Verse 2]: Climax, resolution, poetic resonance (4 lines)
- [Bridge]: Musical variation or transition (2 lines)
- [Outro]: Sweet fading concluding line

Also provide:
- suggestedRaagOrScale (e.g. Raag Yaman, Raag Bhairavi, C Major, A Minor)
- recommendedBpm (number, e.g. 75, 84, 108, 128)
- rhythmPattern (e.g. Keherwa 8-beat, Dadra 6-beat, TeenTaal, Bhangra Dhol, Lo-fi Chill, DJ Party)
- musicalCues (description of background instruments, e.g. "Tanpura, Sitar glide, Bansuri fill, warm acoustic guitar")

Ensure the output is valid JSON matching this schema.`;

    const contents = `Write a complete song in ${language} language.
Musical Style: ${musicStyle}
Mood / Emotion: ${mood}
Singer Voice: ${voiceType}
User Prompt / Theme: "${prompt || `${musicStyle} melodious song`}"
Please compose authentic, soulful lyrics that sound like a timeless hit. If the language is Hindi, Bhojpuri, Punjabi, Haryanvi, Gujarati, Marathi, or Bengali, provide the primary lyrics in the native script (or clean Devanagari/Gurmukhi) alongside Romanized English pronunciation for each line so all users can sing along.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
    } catch {
      // Clean possible markdown code fences
      const clean = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      parsedData = JSON.parse(clean);
    }

    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error generating lyrics:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate song lyrics. Please try again.',
    });
  }
});

// 2. Generate Vocal Singing Voice Endpoint using Gemini TTS
app.post('/api/gemini/generate-vocals', async (req, res) => {
  try {
    const {
      lyricsText,
      voiceType = 'Sweet Female',
      style = 'Romantic, soft melodious singing with natural vocal cadences',
      tempo = 'medium',
    } = req.body;

    if (!lyricsText) {
      return res.status(400).json({ error: 'Lyrics text is required to generate vocal audio.' });
    }

    const ai = getAiClient();

    // Map voice choices to prebuilt Gemini TTS voices and styles
    // Supported voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
    let voiceName = 'Kore'; // default sweet female
    let vocalDirection = 'Melodious, expressive singing voice with sweet musical inflection and clear articulation';

    switch (voiceType) {
      case 'Sweet Female':
      case 'Sweet Female Singing Voice':
        voiceName = 'Kore';
        vocalDirection = 'Singing with a sweet, clear, melodious high-register female tone, soulful Indian melody';
        break;
      case 'Sweet Male':
        voiceName = 'Puck';
        vocalDirection = 'Singing with a sweet, warm, soothing male tenor voice, gentle acoustic timbre';
        break;
      case 'Romantic Male':
        voiceName = 'Fenrir';
        vocalDirection = 'Romantic male singing, passionate, soft breathy undertones, smooth and heartfelt';
        break;
      case 'Romantic Female':
        voiceName = 'Kore';
        vocalDirection = 'Romantic female singing, deeply emotional, tender, sweet lyrical vibrato';
        break;
      case 'Soft Melodious':
        voiceName = 'Zephyr';
        vocalDirection = 'Soft, soothing, lullaby-like singing voice, tranquil and peaceful';
        break;
      case 'Deep Male':
        voiceName = 'Charon';
        vocalDirection = 'Deep resonant baritone male singing, rich chest voice, ghazal and sufi depth';
        break;
      case 'Male + Female Duet':
        // We handle duet below using multi-speaker or dual generation
        voiceName = 'Kore';
        break;
      default:
        voiceName = 'Kore';
    }

    // Prepare singing lyrics representation: clean up markers so TTS sings cleanly
    const singingLyrics = lyricsText
      .replace(/\[Title:.*?\]/gi, '')
      .replace(/\[Mukhda.*?\]/gi, '♪ ')
      .replace(/\[Antara.*?\]/gi, '♪ ')
      .replace(/\[Bridge.*?\]/gi, '♪ ')
      .replace(/\[Outro.*?\]/gi, '♪ ')
      .replace(/[\[\]]/g, '')
      .trim();

    // Limit text length for prompt if too long to prevent timeout (first 400 words)
    const truncatedLyrics = singingLyrics.slice(0, 800);

    let base64Audio: string | undefined;

    if (voiceType === 'Male + Female Duet') {
      // Use multi-speaker voice config with gemini-3.8-flash-tts
      try {
        const duetResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Aman: ${truncatedLyrics.split('\n').filter(Boolean).slice(0, 4).join(' ')}`,
                  speechMetadata: {
                    speaker: 'Aman',
                    style: 'Sweet melodious male singing voice, romantic Bollywood style',
                  },
                },
                {
                  text: `Priya: ${truncatedLyrics.split('\n').filter(Boolean).slice(4, 8).join(' ') || 'संग तेरे हर पल बहे, ये मधुर संगीत रहे'}`,
                  speechMetadata: {
                    speaker: 'Priya',
                    style: 'Sweet melodious female singing voice, soft and romantic',
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                  {
                    speaker: 'Aman',
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Puck' },
                    },
                  },
                  {
                    speaker: 'Priya',
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                  },
                ],
              },
            },
          },
        });
        base64Audio = duetResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      } catch (duetErr) {
        console.warn('Duet TTS fallback to single speaker:', duetErr);
      }
    }

    if (!base64Audio) {
      // Standard single speaker TTS
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: truncatedLyrics,
                speechMetadata: {
                  style: `${vocalDirection}. ${style}`,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    }

    if (!base64Audio) {
      throw new Error('No audio returned from speech synthesis model');
    }

    res.json({
      success: true,
      audioMimeType: 'audio/wav',
      audioBase64: base64Audio,
      voiceName,
      voiceType,
    });
  } catch (error: any) {
    console.error('Error generating vocals:', error);
    res.status(500).json({
      error: error?.message || 'Failed to synthesize singing voice.',
    });
  }
});

// 3. Quick Song Inspiration Prompts Endpoint
app.get('/api/prompts/suggestions', (req, res) => {
  const suggestions = [
    {
      category: 'Romantic',
      hindi: 'पहली बारिश में भीगती शाम और चाय के साथ पुराने प्यार का एक सुरीला रोमांटिक गाना',
      english: 'A melodious romantic song about first monsoon rain and sweet nostalgic memories',
      style: 'Romantic Music',
      mood: 'Tender & Soulful',
      language: 'Hindi',
      voice: 'Romantic Male',
    },
    {
      category: 'Devotional',
      hindi: 'काशी के घाट पर गंगा आरती और महादेव का एक ध्यानमयी भक्ति भजन',
      english: 'A divine devotional Shiva bhajan with temple bells and sacred chants',
      style: 'Devotional Music',
      mood: 'Peaceful & Devout',
      language: 'Hindi',
      voice: 'Deep Male',
    },
    {
      category: 'Bollywood Dance',
      hindi: 'खुशियों से भरा जश्न, दोस्तों की महफ़िल और ढोलक की थाप पर बॉलीवुड पार्टी गीत',
      english: 'An upbeat, energetic Bollywood celebration dance song with dholak beats',
      style: 'Bollywood-inspired',
      mood: 'Festive & Joyful',
      language: 'Hindi',
      voice: 'Male + Female Duet',
    },
    {
      category: 'Sad & Emotional',
      hindi: 'टूटे दिल की दास्तान और तन्हाई की रात, बांसुरी की दर्द भरी धुन के साथ',
      english: 'A deep emotional heartbreak song with melancholic flute and soft acoustic strings',
      style: 'Sad Music',
      mood: 'Melancholic',
      language: 'Hindi',
      voice: 'Romantic Female',
    },
    {
      category: 'Lo-fi Relax',
      hindi: 'रात के 2 बजे खिड़की पर बैठी यादें, धीमी धुन और लो-फाई सुकून',
      english: 'Midnight chill Indian lo-fi with vintage vinyl crackle and soothing harmonium',
      style: 'Lo-fi Music',
      mood: 'Dreamy & Calm',
      language: 'Hindi',
      voice: 'Soft Melodious',
    },
    {
      category: 'Punjabi Folk',
      hindi: 'पंजाब के खेतों की खुशबू, गिद्दा और भांगड़ा की मस्ती भरा लोकगीत',
      english: 'Authentic Punjabi folk song with energetic dhol and joyous celebratory vibe',
      style: 'Folk Music',
      mood: 'Celebratory',
      language: 'Punjabi',
      voice: 'Sweet Male',
    },
    {
      category: 'Bhojpuri Lokgeet',
      hindi: 'मिट्टी की सौंधी खुशबू, पूरबिया मिठास और गंगा किनारे का प्यारा भोजपुरी लोकगीत',
      english: 'Sweet rural Bhojpuri folk melody with dholak and flute',
      style: 'Folk Music',
      mood: 'Cheerful & Earthy',
      language: 'Bhojpuri',
      voice: 'Sweet Female',
    },
    {
      category: 'Sufi / Classical',
      hindi: 'इश्क़-ए-हक़ीक़ी, रूहानी सूफी क़व्वाली और तानपूरे की अमर गूंज',
      english: 'Spiritual Sufi ghazal and classical raag fusion with tanpura and sitar',
      style: 'Classical Music',
      mood: 'Spiritual & Ecstatic',
      language: 'Hindi',
      voice: 'Deep Male',
    },
  ];

  res.json({ suggestions });
});

// Mounting Vite or Static
const setupServer = async () => {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🎶 AI MADHUR SANGEET server running at http://0.0.0.0:${PORT}`);
  });
};

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
