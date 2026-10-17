import { WordCard, WordCategory } from '../types';
import { CURATED_FALLBACK_WORDS, CuratedWord } from '../data/curatedFallbackWords';
import { fetchFromDictionaryApi, fetchFromWiktionary } from './dictionaryApi';
import { fetchWordListFromDatamuse } from './datamuseApi';
import { hindiTranslationService } from './hindiTranslationService';

const STORAGE_CACHE_KEY = 'wordplay_enriched_cache';

class WordService {
  private cache: Map<string, WordCard> = new Map();
  private seenWords: Set<string> = new Set();
  private candidateQueue: string[] = [];
  private isRefilling: boolean = false;

  constructor() {
    // 1. Seed memory cache with curated baseline words + Hindi definitions
    CURATED_FALLBACK_WORDS.forEach((card) => {
      if (!card.hindiMeaning) {
        card.hindiMeaning = hindiTranslationService.getInstantHindi(card.word);
      }
      this.cache.set(card.word.toLowerCase(), card);
    });

    // 2. Load persistent cached words from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_CACHE_KEY);
      if (stored) {
        const parsed: WordCard[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          parsed.forEach((c) => {
            if (!c.hindiMeaning) {
              c.hindiMeaning = hindiTranslationService.getInstantHindi(c.word);
            }
            this.cache.set(c.word.toLowerCase(), c);
          });
        }
      }
    } catch (e) {}

    // 3. Load seen words
    try {
      const storedSeen = localStorage.getItem('wordplay_seen_words');
      if (storedSeen) {
        const arr = JSON.parse(storedSeen);
        if (Array.isArray(arr)) {
          arr.forEach((w) => this.seenWords.add(w.toLowerCase()));
        }
      }
    } catch (e) {}
  }

  private persistCache(): void {
    try {
      const allCards = Array.from(this.cache.values()).slice(0, 300);
      localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(allCards));
    } catch (e) {}
  }

  public recordSeen(word: string): void {
    const clean = word.toLowerCase();
    this.seenWords.add(clean);
    try {
      const seenArr = Array.from(this.seenWords);
      const trimmed = seenArr.slice(Math.max(0, seenArr.length - 500));
      localStorage.setItem('wordplay_seen_words', JSON.stringify(trimmed));
    } catch (e) {}
  }

  /**
   * INSTANT synchronous batch (0ms).
   * Returns pre-packaged or cached words for this category so the UI loads immediately.
   */
  public getInitialInstantBatch(category: WordCategory = 'mixed', count: number = 4): WordCard[] {
    let matching = CURATED_FALLBACK_WORDS.filter(
      (c) => category === 'mixed' || c.categoryTag === category
    );

    if (matching.length === 0) {
      matching = CURATED_FALLBACK_WORDS;
    }

    const unseen = matching.filter((c) => !this.seenWords.has(c.word.toLowerCase()));
    const pool = unseen.length >= count ? unseen : matching;

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const chosen = shuffled.slice(0, count);

    chosen.forEach((c) => {
      if (!c.hindiMeaning) {
        c.hindiMeaning = hindiTranslationService.getInstantHindi(c.word);
      }
    });

    return chosen;
  }

  /**
   * Fetches enriched WordCard for a single word with caching & Hindi translation
   */
  public async getWordCard(word: string): Promise<WordCard | null> {
    const clean = word.trim().toLowerCase();

    // Fast path: memory or persistent cache hit (0ms)
    if (this.cache.has(clean)) {
      const existing = this.cache.get(clean)!;
      if (!existing.hindiMeaning) {
        existing.hindiMeaning =
          hindiTranslationService.getInstantHindi(clean) ||
          (await hindiTranslationService.getHindiMeaning(clean));
      }
      return existing;
    }

    // Try Free Dictionary API with timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);

      const dictCard = await fetchFromDictionaryApi(clean);
      clearTimeout(timeoutId);

      if (dictCard) {
        dictCard.hindiMeaning =
          hindiTranslationService.getInstantHindi(clean) ||
          (await hindiTranslationService.getHindiMeaning(clean));
        this.cache.set(clean, dictCard);
        this.persistCache();
        return dictCard;
      }
    } catch (e) {}

    // Secondary fallback: Wiktionary
    try {
      const wiktionaryCard = await fetchFromWiktionary(clean);
      if (wiktionaryCard) {
        wiktionaryCard.hindiMeaning =
          hindiTranslationService.getInstantHindi(clean) ||
          (await hindiTranslationService.getHindiMeaning(clean));
        this.cache.set(clean, wiktionaryCard);
        this.persistCache();
        return wiktionaryCard;
      }
    } catch (e) {}

    return null;
  }

  /**
   * Refill candidates queue from Datamuse & curated
   */
  private async refillCandidates(category: WordCategory): Promise<void> {
    if (this.isRefilling) return;
    this.isRefilling = true;

    try {
      const datamuseWords = await fetchWordListFromDatamuse(category, 30);
      const freshWords = datamuseWords.filter((w) => !this.seenWords.has(w));
      this.candidateQueue.push(...freshWords);

      const matchingCurated = CURATED_FALLBACK_WORDS.filter(
        (c) => category === 'mixed' || c.categoryTag === category
      )
        .map((c) => c.word)
        .filter((w) => !this.seenWords.has(w.toLowerCase()));

      this.candidateQueue.push(...matchingCurated.sort(() => 0.5 - Math.random()));

      if (this.candidateQueue.length < 5) {
        const recycled = CURATED_FALLBACK_WORDS.map((c) => c.word).sort(() => 0.5 - Math.random());
        this.candidateQueue.push(...recycled);
      }
    } catch (err) {
      const fallback = CURATED_FALLBACK_WORDS.map((c) => c.word).sort(() => 0.5 - Math.random());
      this.candidateQueue.push(...fallback);
    } finally {
      this.isRefilling = false;
    }
  }

  /**
   * High-speed parallel batch fetcher
   */
  public async getBatch(category: WordCategory = 'mixed', count: number = 5): Promise<WordCard[]> {
    if (this.candidateQueue.length < count * 2) {
      await this.refillCandidates(category);
    }

    const cards: WordCard[] = [];

    const remainingCandidates: string[] = [];
    while (this.candidateQueue.length > 0 && cards.length < count) {
      const word = this.candidateQueue.shift()!;
      const cached = this.cache.get(word.toLowerCase());
      if (cached && !cards.some((c) => c.word.toLowerCase() === cached.word.toLowerCase())) {
        if (!cached.hindiMeaning) {
          cached.hindiMeaning = hindiTranslationService.getInstantHindi(cached.word);
        }
        cards.push(cached);
      } else {
        remainingCandidates.push(word);
      }
    }

    if (cards.length < count && remainingCandidates.length > 0) {
      const needed = count - cards.length;
      const batchToFetch = remainingCandidates.slice(0, needed + 3);

      const results = await Promise.allSettled(
        batchToFetch.map((candidate) => this.getWordCard(candidate))
      );

      for (const res of results) {
        if (res.status === 'fulfilled' && res.value) {
          const card = res.value;
          if (!cards.some((c) => c.word.toLowerCase() === card.word.toLowerCase())) {
            cards.push(card);
            if (cards.length >= count) break;
          }
        }
      }
    }

    if (cards.length < count) {
      const instantFallback = this.getInitialInstantBatch(category, count);
      for (const cur of instantFallback) {
        if (!cards.some((c) => c.word.toLowerCase() === cur.word.toLowerCase())) {
          cards.push(cur);
          if (cards.length >= count) break;
        }
      }
    }

    return cards;
  }
}

export const wordService = new WordService();
