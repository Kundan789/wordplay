import { WordCard, UserStats } from '../types';

const STORAGE_KEY_LIBRARY = 'wordplay_remember_library';
const STORAGE_KEY_STATS = 'wordplay_user_stats';

class StorageService {
  public getRememberedWords(): WordCard[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_LIBRARY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load library:', e);
      return [];
    }
  }

  public saveWord(card: WordCard): boolean {
    try {
      const list = this.getRememberedWords();
      const existsIndex = list.findIndex((item) => item.word.toLowerCase() === card.word.toLowerCase());

      if (existsIndex >= 0) {
        return false; // already saved
      }

      const newEntry: WordCard = {
        ...card,
        savedAt: Date.now(),
        mastered: false
      };

      list.unshift(newEntry);
      localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(list));
      this.incrementStats('save');
      return true;
    } catch (e) {
      console.error('Failed to save word:', e);
      return false;
    }
  }

  public removeWord(id: string): void {
    try {
      const list = this.getRememberedWords();
      const updated = list.filter((item) => item.id !== id && item.word.toLowerCase() !== id.toLowerCase());
      localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to remove word:', e);
    }
  }

  public toggleMastered(id: string): boolean {
    try {
      const list = this.getRememberedWords();
      const target = list.find((item) => item.id === id || item.word.toLowerCase() === id.toLowerCase());
      if (target) {
        target.mastered = !target.mastered;
        localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(list));
        return !!target.mastered;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  public getStats(): UserStats {
    const today = new Date().toISOString().split('T')[0];
    const defaultStats: UserStats = {
      totalSwiped: 0,
      savedCount: 0,
      passedCount: 0,
      currentStreak: 1,
      lastSwipeDate: today,
      cardsToday: 0
    };

    try {
      const raw = localStorage.getItem(STORAGE_KEY_STATS);
      if (!raw) return defaultStats;

      const parsed: UserStats = JSON.parse(raw);

      // Check if day changed
      if (parsed.lastSwipeDate !== today) {
        // Calculate streak
        const lastDate = new Date(parsed.lastSwipeDate);
        const currDate = new Date(today);
        const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

        if (diffDays === 1) {
          // Next day consecutive streak maintained!
          parsed.currentStreak += 1;
        } else if (diffDays > 1) {
          // Missed a day
          parsed.currentStreak = 1;
        }

        parsed.lastSwipeDate = today;
        parsed.cardsToday = 0;
        localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(parsed));
      }

      return parsed;
    } catch (e) {
      return defaultStats;
    }
  }

  public incrementStats(action: 'save' | 'pass'): void {
    try {
      const stats = this.getStats();
      stats.totalSwiped += 1;
      stats.cardsToday += 1;
      if (action === 'save') {
        stats.savedCount += 1;
      } else {
        stats.passedCount += 1;
      }
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
    } catch (e) {}
  }

  public exportAsJson(): void {
    const data = this.getRememberedWords();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    this.downloadFile(blob, `wordplay-saved-${new Date().toISOString().slice(0, 10)}.json`);
  }

  public exportAsCsv(): void {
    const data = this.getRememberedWords();
    const headers = ['Word', 'Part of Speech', 'Definition', 'Example', 'Synonyms', 'Mastered'];
    const rows = data.map((item) => [
      `"${item.word.replace(/"/g, '""')}"`,
      `"${item.partOfSpeech.replace(/"/g, '""')}"`,
      `"${item.definition.replace(/"/g, '""')}"`,
      `"${(item.examples?.[0] || '').replace(/"/g, '""')}"`,
      `"${(item.synonyms?.join(', ') || '').replace(/"/g, '""')}"`,
      item.mastered ? 'Yes' : 'No'
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadFile(blob, `wordplay-vocabulary-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const storageService = new StorageService();
