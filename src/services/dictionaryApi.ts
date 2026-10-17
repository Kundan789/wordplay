import { WordCard } from '../types';

interface DictionaryApiPhonetic {
  text?: string;
  audio?: string;
}

interface DictionaryApiDefinition {
  definition: string;
  synonyms?: string[];
  antonyms?: string[];
  example?: string;
}

interface DictionaryApiMeaning {
  partOfSpeech: string;
  definitions: DictionaryApiDefinition[];
  synonyms?: string[];
  antonyms?: string[];
}

interface DictionaryApiEntry {
  word: string;
  phonetic?: string;
  phonetics?: DictionaryApiPhonetic[];
  meanings: DictionaryApiMeaning[];
  origin?: string;
}

export async function fetchFromDictionaryApi(word: string): Promise<WordCard | null> {
  try {
    const cleanWord = word.trim().toLowerCase();
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      return null;
    }

    const data: DictionaryApiEntry[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const entry = data[0];

    // Extract phonetic text
    let phonetic = entry.phonetic;
    if (!phonetic && entry.phonetics && entry.phonetics.length > 0) {
      const pWithText = entry.phonetics.find((p) => p.text && p.text.trim().length > 0);
      if (pWithText) phonetic = pWithText.text;
    }

    // Extract audio URL
    let audioUrl = '';
    if (entry.phonetics && entry.phonetics.length > 0) {
      // Prefer audio with -us or -uk or any valid audio
      const audioWithUs = entry.phonetics.find((p) => p.audio && p.audio.includes('-us.mp3'));
      const audioWithUk = entry.phonetics.find((p) => p.audio && p.audio.includes('-uk.mp3'));
      const anyAudio = entry.phonetics.find((p) => p.audio && p.audio.trim().length > 0);
      audioUrl = audioWithUs?.audio || audioWithUk?.audio || anyAudio?.audio || '';
    }

    // Extract meanings & examples
    const primaryMeaning = entry.meanings?.[0];
    const partOfSpeech = primaryMeaning?.partOfSpeech || 'noun';

    const definitions: string[] = [];
    const examples: string[] = [];
    const synonymsSet = new Set<string>();
    const antonymsSet = new Set<string>();

    entry.meanings.forEach((m) => {
      if (m.synonyms) m.synonyms.forEach((s) => synonymsSet.add(s));
      if (m.antonyms) m.antonyms.forEach((a) => antonymsSet.add(a));

      m.definitions?.forEach((def) => {
        if (def.definition && definitions.length < 4) {
          definitions.push(def.definition);
        }
        if (def.example && examples.length < 3) {
          examples.push(def.example);
        }
        if (def.synonyms) def.synonyms.forEach((s) => synonymsSet.add(s));
        if (def.antonyms) def.antonyms.forEach((a) => antonymsSet.add(a));
      });
    });

    if (definitions.length === 0) return null;

    return {
      id: cleanWord,
      word: entry.word || cleanWord,
      phonetic: phonetic || undefined,
      audioUrl: audioUrl || undefined,
      partOfSpeech,
      definition: definitions[0],
      secondaryDefinitions: definitions.slice(1),
      examples: examples.length > 0 ? examples : [
        `Understanding the nuance of "${entry.word}" deepens your mastery of expressive communication.`
      ],
      synonyms: Array.from(synonymsSet).slice(0, 5),
      antonyms: Array.from(antonymsSet).slice(0, 4),
      etymology: entry.origin,
      source: 'dictionaryapi'
    };
  } catch (error) {
    console.warn(`Dictionary API fetch failed for "${word}":`, error);
    return null;
  }
}

/**
 * Wiktionary API Fallback
 */
export async function fetchFromWiktionary(word: string): Promise<WordCard | null> {
  try {
    const cleanWord = word.trim().toLowerCase();
    const url = `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(cleanWord)}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.en || !Array.isArray(data.en) || data.en.length === 0) return null;

    const enEntry = data.en[0];
    const partOfSpeech = enEntry.partOfSpeech?.toLowerCase() || 'noun';
    const defObjs = enEntry.definitions || [];
    if (defObjs.length === 0) return null;

    // Clean HTML tags from definitions and examples
    const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '').trim();

    const definition = stripHtml(defObjs[0].definition || '');
    const secondary = defObjs.slice(1, 3).map((d: any) => stripHtml(d.definition || '')).filter(Boolean);
    const examples: string[] = [];

    defObjs.forEach((d: any) => {
      if (d.examples && Array.isArray(d.examples)) {
        d.examples.forEach((ex: string) => {
          const cleaned = stripHtml(ex);
          if (cleaned && examples.length < 3) examples.push(cleaned);
        });
      }
    });

    return {
      id: cleanWord,
      word: cleanWord,
      partOfSpeech,
      definition: definition || 'Definition available on Wiktionary.',
      secondaryDefinitions: secondary,
      examples: examples.length > 0 ? examples : [
        `The word "${cleanWord}" is often encountered in literary contexts.`
      ],
      synonyms: [],
      antonyms: [],
      source: 'wiktionary'
    };
  } catch (error) {
    console.warn(`Wiktionary fetch failed for "${word}":`, error);
    return null;
  }
}
