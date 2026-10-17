export type WordCategory = 'mixed' | 'advanced' | 'evocative' | 'daily' | 'literature';

export interface WordCard {
  id: string;
  word: string;
  phonetic?: string;
  audioUrl?: string;
  partOfSpeech: string;
  definition: string;
  secondaryDefinitions?: string[];
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  etymology?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  hindiMeaning?: string;
  source?: 'dictionaryapi' | 'datamuse' | 'curated' | 'wiktionary';
  savedAt?: number;
  mastered?: boolean;
}

export interface UserStats {
  totalSwiped: number;
  savedCount: number;
  passedCount: number;
  currentStreak: number;
  lastSwipeDate: string; // YYYY-MM-DD
  cardsToday: number;
}
