import { SongMetadata } from '../types/song';

const STORAGE_KEY = 'ai_madhur_sangeet_library_v1';

export const INITIAL_SHOWCASE_SONGS: SongMetadata[] = [
  {
    id: 'song-showcase-1',
    title: 'तेरे संग बहती हवा (Tere Sang Behti Hawa)',
    prompt: 'एक रोमांटिक बॉलीवुड गाना जिसमें पहली मोहब्बत और शाम की ठंडी हवाओं का जिक्र हो',
    musicStyle: 'Romantic Music',
    voiceType: 'Male + Female Duet',
    language: 'Hindi',
    createdAt: Date.now() - 3600000 * 2,
    lyrics: {
      title: 'तेरे संग बहती हवा',
      mukhda:
        'तेरे संग बहती हवा मद्धम मद्धम गुनगुनाए,\nदिल की सूनी राहों में कोई नया रंग बिखराए।\nतू जो हँस दे इक दफ़ा, बहारें भी शर्माएँ,\nतेरा नाम ले-लेकर ये धड़कन गीत सुनाए।',
      antara1:
        'शाम ढले जब तेरी यादों के बादल छाएँ,\nनैनों के झरोखों से मीठी खुशबू आए।\nहाथों में तेरा हाथ हो, ख़ामोश रात हो,\nसारे जहाँ से बेपरवाह हमारी बात हो।',
      antara2:
        'चाँद भी देखे चुपके से तेरी मासूमियत का नूर,\nतू पास है तो लगता है हर ग़म हमसे दूर।\nसाँसों की लय पे अब बस तेरा ही तराना,\nतू ही तो है मेरी मंज़िल, तू ही मेरा आशियाना।',
      bridge: 'ना चाहूँ कोई दुआ, ना माँगूँ कोई जहाँ,\nबस तू रहे सदा, मेरे दिल का रहनुमा।',
      outro: 'मधुर सुरों में बहती रहे ये प्रेम की दास्ताँ... हाँ... हाँ...',
      suggestedRaagOrScale: 'Raag Yaman / D Major',
      recommendedBpm: 82,
      rhythmPattern: 'Keherwa (8 beats)',
      musicalCues: 'Acoustic guitar strumming, bansuri flute fill, soft tabla bayan drop',
    },
    durationSec: 45,
    isFavorite: true,
  },
  {
    id: 'song-showcase-2',
    title: 'मन मंदिर में बाजे मुरली (Man Mandir Mein Baaje Murli)',
    prompt: 'वृंदावन की पावन भूमि पर श्रीकृष्ण की बांसुरी और मन को शांति देने वाला भक्ति भजन',
    musicStyle: 'Devotional Music',
    voiceType: 'Deep Male',
    language: 'Hindi',
    createdAt: Date.now() - 3600000 * 5,
    lyrics: {
      title: 'मन मंदिर में बाजे मुरली',
      mukhda:
        'मन मंदिर में बाजे मुरली, गूंजे अमृत वाणी,\nराधे-राधे नाम सुहावन, भवसागर की तारणी।\nचरण कमल में शीश झुकाऊँ, हे नंदनंदन श्याम,\nतेरी कृपा से महक उठे ये जीवन का हर गाम।',
      antara1:
        'यमुना तट पर मंद पवन जब कदम चूमे तेरा,\nमिट जाए इस जग का कान्हा सारा ही अँधेरा।\nमोर मुकुट पीतांबर धारी, नटवर नागर रूप,\nतेरी छटा अनूप मनोहर, मनभावन ये धूप।',
      antara2:
        'लोभ मोह सब छूट गए जब तेरी लगन लगाई,\nहृदय कमल खिल उठा हमारा, भक्ति सुधा बरसाई।\nदीनबंधु करुणामय मोहन, राखो अपनी छाँव,\nनाम तिहारो जपूँ निरंतर, जब लग चलें ये पाँव।',
      bridge: 'गोविंदा गोपाल हरे, प्रभु दीन दयाल हरे,\nमन के सारे संतापों को क्षण भर में हर ले।',
      outro: 'जय श्री कृष्णा... राधे राधे... मन मंदिर में आनंद अपार...',
      suggestedRaagOrScale: 'Raag Bhupali / Pentatonic',
      recommendedBpm: 78,
      rhythmPattern: 'Bhajan Theka (Dadra 6-beat)',
      musicalCues: 'Temple ghanti chimes, harmonium drone, bansuri alap, soothing dholak',
    },
    durationSec: 50,
    isFavorite: true,
  },
  {
    id: 'song-showcase-3',
    title: 'रात के साए और लो-फाई सुकून (Midnight Lo-fi Melodies)',
    prompt: 'बारिश की बूंदों और खिड़की पर ठंडी हवाओं के साथ एक रिलैक्सिंग लो-फाई गाना',
    musicStyle: 'Lo-fi Music',
    voiceType: 'Soft Melodious',
    language: 'Hindi',
    createdAt: Date.now() - 3600000 * 12,
    lyrics: {
      title: 'रात के साए और लो-फाई सुकून',
      mukhda:
        'काँच पे गिरती बूँदें, धीमी-धीमी रात,\nचाय की प्याली हाथ में, खुद से कुछ बात।\nशहर सो गया धीरे-धीरे, जागी है यादें,\nसपनों के धागों में उलझी कल की बातें।',
      antara1:
        'कमरे में हल्की रोशनी, सुरमई सा समाँ,\nवक़्त ठहर सा गया यहाँ, जा रहे हो कहाँ? \nपुरानी डायरी के पन्ने महके आज फिर,\nसुकून के दो पल मिले, ठहर गया ये दिल।',
      bridge: 'ना कोई जल्दी, ना कोई शोर,\nमन ढूँढे बस एक शांत छोर।',
      outro: 'लो-फाई धुन में खो जाने दो... चुपके से सो जाने दो...',
      suggestedRaagOrScale: 'Lush F# Minor 9th',
      recommendedBpm: 72,
      rhythmPattern: 'Lo-fi Chill Boom-Bap',
      musicalCues: 'Vinyl surface crackle, mellow electric piano, soft muted kick, sub bass',
    },
    durationSec: 40,
    isFavorite: false,
  },
];

export const getSavedSongs = (): SongMetadata[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveSongs(INITIAL_SHOWCASE_SONGS);
      return INITIAL_SHOWCASE_SONGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SHOWCASE_SONGS;
  } catch (err) {
    console.error('Failed to read saved songs from localStorage:', err);
    return INITIAL_SHOWCASE_SONGS;
  }
};

export const saveSongs = (songs: SongMetadata[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
  } catch (err) {
    console.error('Failed to save songs to localStorage:', err);
  }
};

export const addSongToLibrary = (song: SongMetadata) => {
  const current = getSavedSongs();
  const updated = [song, ...current.filter((s) => s.id !== song.id)];
  saveSongs(updated);
  return updated;
};

export const toggleFavoriteSong = (songId: string): SongMetadata[] => {
  const current = getSavedSongs();
  const updated = current.map((s) => (s.id === songId ? { ...s, isFavorite: !s.isFavorite } : s));
  saveSongs(updated);
  return updated;
};

export const deleteSongFromLibrary = (songId: string): SongMetadata[] => {
  const current = getSavedSongs();
  const updated = current.filter((s) => s.id !== songId);
  saveSongs(updated);
  return updated;
};
