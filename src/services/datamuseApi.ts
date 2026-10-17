import { WordCategory } from '../types';

interface DatamuseWord {
  word: string;
  score: number;
  tags?: string[];
  defs?: string[];
}

const CATEGORY_TOPIC_MAP: Record<WordCategory, { ml: string[]; topics: string[] }> = {
  mixed: {
    ml: ['splendid', 'profound', 'mysterious', 'courageous', 'astute', 'radiant', 'eloquent', 'harmonious'],
    topics: ['vocabulary', 'intellect', 'expression']
  },
  advanced: {
    ml: ['sagacious', 'ephemeral', 'magnanimous', 'perspicacious', 'tenacious', 'fastidious', 'equivocal'],
    topics: ['philosophy', 'academia', 'logic']
  },
  evocative: {
    ml: ['petrichor', 'mellifluous', 'ethereal', 'luminescence', 'halcyon', 'solitude', 'melancholy'],
    topics: ['poetry', 'nature', 'emotion']
  },
  daily: {
    ml: ['resilient', 'practical', 'versatile', 'innovative', 'efficient', 'genuine', 'lucid'],
    topics: ['daily', 'conversation', 'action']
  },
  literature: {
    ml: ['labyrinthine', 'gregarious', 'catharsis', 'quixotic', 'sonder', 'hubris', 'cacophony'],
    topics: ['literature', 'arts', 'classics']
  }
};

export async function fetchWordListFromDatamuse(category: WordCategory = 'mixed', count: number = 30): Promise<string[]> {
  try {
    const config = CATEGORY_TOPIC_MAP[category] || CATEGORY_TOPIC_MAP.mixed;
    // Pick random seed word and topic from the category
    const seedMl = config.ml[Math.floor(Math.random() * config.ml.length)];
    const seedTopic = config.topics[Math.floor(Math.random() * config.topics.length)];

    const url = `https://api.datamuse.com/words?ml=${encodeURIComponent(seedMl)}&topics=${encodeURIComponent(seedTopic)}&md=dp&max=${count}`;

    const res = await fetch(url);
    if (!res.ok) return [];

    const data: DatamuseWord[] = await res.json();
    if (!Array.isArray(data)) return [];

    // Filter words: only single words (no spaces/hyphens), 4 to 16 characters, alphabetical only
    const validWords = data
      .map((item) => item.word.toLowerCase())
      .filter((w) => /^[a-z]{4,16}$/.test(w));

    return validWords;
  } catch (error) {
    console.warn('Datamuse API error:', error);
    return [];
  }
}

/**
 * Fetch related words / synonyms / associations for a specific word
 */
export async function fetchRelatedWords(word: string): Promise<{ synonyms: string[]; rhymes: string[] }> {
  try {
    const [synRes, rhymeRes] = await Promise.all([
      fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}&max=6`),
      fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(word)}&max=4`)
    ]);

    const synonymsData = synRes.ok ? await synRes.json() : [];
    const rhymesData = rhymeRes.ok ? await rhymeRes.json() : [];

    return {
      synonyms: Array.isArray(synonymsData) ? synonymsData.map((d: any) => d.word) : [],
      rhymes: Array.isArray(rhymesData) ? rhymesData.map((d: any) => d.word) : []
    };
  } catch (e) {
    return { synonyms: [], rhymes: [] };
  }
}
