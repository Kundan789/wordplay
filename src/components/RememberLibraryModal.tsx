import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  BookMarked,
  Volume2,
  Trash2,
  CheckCircle2,
  Circle,
  FileSpreadsheet,
  FileJson,
  BrainCircuit,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowLeft,
  PlusCircle,
  Loader2,
  Target,
  Layers,
  Check,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { WordCard } from '../types';
import { CURATED_FALLBACK_WORDS } from '../data/curatedFallbackWords';
import { audioService } from '../services/audioService';
import { storageService } from '../services/storageService';
import { wordService } from '../services/wordService';
import { soundEffects } from '../services/soundEffects';
import confetti from 'canvas-confetti';

interface RememberLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedWords: WordCard[];
  onUpdateWords: () => void;
  initialTab?: 'library' | 'quiz';
}

export const RememberLibraryModal: React.FC<RememberLibraryModalProps> = ({
  isOpen,
  onClose,
  savedWords,
  onUpdateWords,
  initialTab = 'library'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPos, setSelectedPos] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'library' | 'quiz'>(initialTab);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  // Sync initialTab when modal opens
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
      if (initialTab === 'quiz') {
        setQuizIndex(0);
        setShowQuizAnswer(false);
        setIsQuizFinished(false);
        setSelectedChoice(null);
        setIsEvaluated(false);
      }
    }
  }, [isOpen, initialTab]);

  // Manual Word Lookup state
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [onlineLookupError, setOnlineLookupError] = useState<string | null>(null);

  // Quiz Mode State
  const [quizType, setQuizType] = useState<'multipleChoice' | 'flashcard'>('multipleChoice');
  const [quizIndex, setQuizIndex] = useState(0);
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);

  // Handle Android physical back button and ESC key
  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ modal: 'remember-library' }, '');

    const handlePopState = () => {
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Filter words
  const filteredWords = savedWords.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.examples?.[0] && item.examples[0].toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPos = selectedPos === 'all' || item.partOfSpeech.toLowerCase() === selectedPos.toLowerCase();

    return matchesSearch && matchesPos;
  });

  const partsOfSpeech = ['all', 'noun', 'verb', 'adjective', 'adverb'];

  const handleToggleMastered = (id: string) => {
    const isNowMastered = storageService.toggleMastered(id);
    if (isNowMastered) {
      soundEffects.playSave();
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.6 }
      });
    }
    onUpdateWords();
  };

  const handleRemove = (id: string) => {
    storageService.removeWord(id);
    onUpdateWords();
  };

  const handlePlayAudio = (word: string, audioUrl?: string) => {
    setPlayingWord(word);
    audioService.playWord(word, audioUrl, () => {
      setPlayingWord(null);
    });
  };

  // Manual Online Word Lookup & Add to Library
  const handleLookupAndAdd = async () => {
    if (!searchQuery.trim() || isSearchingOnline) return;
    setIsSearchingOnline(true);
    setOnlineLookupError(null);

    try {
      const card = await wordService.getWordCard(searchQuery.trim());
      if (card) {
        const saved = storageService.saveWord(card);
        if (saved) {
          soundEffects.playSave();
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.5 }
          });
          onUpdateWords();
          setSearchQuery('');
        } else {
          setOnlineLookupError(`"${card.word}" is already saved in your library.`);
        }
      } else {
        setOnlineLookupError(`Could not find a definition for "${searchQuery}". Please check spelling.`);
      }
    } catch (e) {
      setOnlineLookupError('Failed to look up word. Please check your internet connection.');
    } finally {
      setIsSearchingOnline(false);
    }
  };

  // Active quiz deck: user's saved words or starter curated vocabulary pack
  const quizDeck: WordCard[] = savedWords.length > 0 ? savedWords : CURATED_FALLBACK_WORDS.slice(0, 10);
  const currentQuizCard = quizDeck[quizIndex] || quizDeck[0];

  // Generate 4 randomized options for multiple choice
  useEffect(() => {
    if (!isOpen || activeTab !== 'quiz' || isQuizFinished || !currentQuizCard) return;

    const correctWord = currentQuizCard.word;
    const pool = new Set<string>();

    // Other words in quizDeck
    quizDeck.forEach((w) => {
      if (w.word.toLowerCase() !== correctWord.toLowerCase()) {
        pool.add(w.word);
      }
    });

    // Fill from curated baseline words if needed
    CURATED_FALLBACK_WORDS.forEach((w) => {
      if (w.word.toLowerCase() !== correctWord.toLowerCase()) {
        pool.add(w.word);
      }
    });

    const poolArr = Array.from(pool).sort(() => 0.5 - Math.random());
    const distractors = poolArr.slice(0, 3);
    const options = [correctWord, ...distractors].sort(() => 0.5 - Math.random());

    setCurrentOptions(options);
    setSelectedChoice(null);
    setIsEvaluated(false);
  }, [isOpen, quizIndex, activeTab, isQuizFinished, quizDeck.length]);

  const handleAdvanceNext = () => {
    setSelectedChoice(null);
    setIsEvaluated(false);
    setShowQuizAnswer(false);

    if (quizIndex < quizDeck.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setIsQuizFinished(true);
      soundEffects.playFanfare();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  };

  const handleSelectChoice = (option: string) => {
    if (isEvaluated || !currentQuizCard) return;
    setSelectedChoice(option);
    setIsEvaluated(true);

    const isCorrect = option.toLowerCase() === currentQuizCard.word.toLowerCase();
    const newCorrect = isCorrect ? quizScore.correct + 1 : quizScore.correct;
    const newTotal = quizScore.total + 1;
    setQuizScore({ correct: newCorrect, total: newTotal });

    if (isCorrect) {
      soundEffects.playCorrect();
      confetti({ particleCount: 35, spread: 55, origin: { y: 0.6 } });
      setTimeout(() => {
        handleAdvanceNext();
      }, 1050);
    } else {
      soundEffects.playWrong();
    }
  };

  const handleQuizNext = (remembered: boolean) => {
    const newCorrect = remembered ? quizScore.correct + 1 : quizScore.correct;
    const newTotal = quizScore.total + 1;
    setQuizScore({ correct: newCorrect, total: newTotal });

    if (remembered) {
      soundEffects.playSave();
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } else {
      soundEffects.playPass();
    }

    handleAdvanceNext();
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setShowQuizAnswer(false);
    setSelectedChoice(null);
    setIsEvaluated(false);
    setQuizScore({ correct: 0, total: 0 });
    setIsQuizFinished(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center bg-slate-950/90 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:max-w-2xl h-full sm:h-[92vh] sm:max-h-[820px] bg-slate-900 sm:border sm:border-slate-800 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 relative">
        {/* Top Header - Mobile Optimized with unmistakable Back & Close buttons */}
        <div className="px-4 py-3 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-2 bg-slate-900/95 sticky top-0 z-30">
          {/* Back button for mobile */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to swipe view"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-sky-400 hover:text-white hover:bg-slate-700 font-semibold text-xs active:scale-95 transition-all shadow-sm border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 text-sky-400" />
            <span>Back</span>
          </button>

          {/* Title & Count */}
          <div className="text-center flex-1 min-w-0 px-1">
            <h2 className="text-base sm:text-xl font-bold font-serif text-white truncate flex items-center justify-center gap-1.5">
              <span>Remember Library</span>
              <span className="text-[10px] font-mono font-semibold bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/30">
                {savedWords.length}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            {/* View Mode Toggle (Vault / Quiz) */}
            <div className="bg-slate-800 p-0.5 sm:p-1 rounded-xl flex items-center gap-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('library');
                  setIsQuizFinished(false);
                }}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'library'
                    ? 'bg-sky-500 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Vault
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('quiz');
                  restartQuiz();
                }}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span className="inline text-xs font-semibold">Quiz</span>
              </button>
            </div>

            {/* Prominent Close (X) button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Library Vault */}
        {activeTab === 'library' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search and Filters Bar */}
            <div className="p-3 sm:p-4 sm:px-6 border-b border-slate-800 bg-slate-900/60 space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setOnlineLookupError(null);
                  }}
                  placeholder="Search saved words or look up new words..."
                  className="w-full pl-10 pr-9 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setOnlineLookupError(null);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Online Lookup Error notice */}
              {onlineLookupError && (
                <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-500/30 p-2 rounded-lg">
                  {onlineLookupError}
                </div>
              )}

              {/* Part of Speech Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                {partsOfSpeech.map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setSelectedPos(pos)}
                    className={`px-3 py-1 rounded-full uppercase tracking-wider font-semibold transition-all whitespace-nowrap ${
                      selectedPos === pos
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            {/* Word List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3">
              {filteredWords.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 p-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 text-slate-500">
                    <BookMarked className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-slate-200 mb-1">
                    {searchQuery ? `No saved words match "${searchQuery}"` : 'No words saved yet!'}
                  </h4>

                  {searchQuery ? (
                    <div className="mt-3 flex flex-col items-center gap-2 max-w-sm">
                      <p className="text-xs text-slate-400">
                        Want to look up and add <strong>"{searchQuery}"</strong> directly to your library?
                      </p>
                      <button
                        type="button"
                        onClick={handleLookupAndAdd}
                        disabled={isSearchingOnline}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-md active:scale-95 transition-all disabled:opacity-50"
                      >
                        {isSearchingOnline ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <PlusCircle className="w-3.5 h-3.5" />
                        )}
                        <span>{isSearchingOnline ? 'Looking up definition...' : `Add "${searchQuery}" to Library`}</span>
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs max-w-xs text-slate-500">
                      Swipe right on cards to collect vocabulary words in your library.
                    </p>
                  )}
                </div>
              ) : (
                filteredWords.map((item) => (
                  <div
                    key={item.id || item.word}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                      item.mastered
                        ? 'bg-slate-900 border-emerald-500/30'
                        : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base sm:text-lg font-bold font-serif capitalize text-white">
                          {item.word}
                        </span>
                        {item.phonetic && (
                          <span className="text-xs text-slate-400 font-mono">
                            {item.phonetic}
                          </span>
                        )}
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-950/60 text-sky-400 border border-sky-500/20">
                          {item.partOfSpeech}
                        </span>
                        {item.hindiMeaning && (
                          <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                            {item.hindiMeaning}
                          </span>
                        )}
                        {item.mastered && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Mastered
                          </span>
                        )}
                      </div>

                      {/* Action buttons with minimum 44px touch targets on mobile */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(item.word, item.audioUrl)}
                          className={`p-2 rounded-lg transition-colors ${
                            playingWord === item.word
                              ? 'text-white bg-sky-500 animate-pulse'
                              : 'text-sky-400 hover:bg-sky-500/20 active:scale-90'
                          }`}
                          title="Listen pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleMastered(item.id || item.word)}
                          className={`p-2 rounded-lg transition-colors active:scale-90 ${
                            item.mastered
                              ? 'text-emerald-400 hover:bg-emerald-500/20'
                              : 'text-slate-500 hover:text-emerald-400 hover:bg-slate-800'
                          }`}
                          title={item.mastered ? 'Mark as Need Practice' : 'Mark as Mastered'}
                        >
                          {item.mastered ? (
                            <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id || item.word)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 active:scale-90 transition-colors"
                          title="Remove from library"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 mb-2 leading-relaxed">
                      {item.definition}
                    </p>

                    {item.examples && item.examples.length > 0 && (
                      <div className="text-xs text-slate-400 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                        "{item.examples[0]}"
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Export & Stats Bar */}
            <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-400 truncate">
                {savedWords.filter((w) => w.mastered).length}/{savedWords.length} mastered
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => storageService.exportAsCsv()}
                  disabled={savedWords.length === 0}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors disabled:opacity-40"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden xs:inline">CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => storageService.exportAsJson()}
                  disabled={savedWords.length === 0}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors disabled:opacity-40"
                >
                  <FileJson className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden xs:inline">JSON</span>
                </button>
              </div>
            </div>

            {/* Dedicated Sticky Mobile Exit Bar */}
            <div className="p-3 bg-slate-900/95 border-t border-slate-800 sm:hidden">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-sky-500/25 active:scale-95 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Exit Library & Return to Swiping</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Memory Quiz / Recall Mode */}
        {activeTab === 'quiz' && (
          <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 overflow-y-auto">
            {isQuizFinished ? (
              /* Quiz Completion Screen */
              <div className="my-auto text-center max-w-sm mx-auto flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-amber-500/30 flex items-center justify-center mb-3">
                  <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 animate-bounce" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-white mb-1.5">Quiz Complete!</h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-4">
                  Great session! Here is how your recall performed:
                </p>

                <div className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-4 mb-5">
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-1">
                    {Math.round((quizScore.correct / Math.max(1, quizScore.total)) * 100)}%
                  </div>
                  <div className="text-xs text-slate-400">
                    {quizScore.correct} of {quizScore.total} words recalled accurately
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full">
                  <button
                    type="button"
                    onClick={restartQuiz}
                    className="flex-1 py-3 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Practice Again</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('library')}
                    className="flex-1 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-all border border-slate-700"
                  >
                    Back to Vault
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Starter Pack banner if user has not saved words yet */}
                {savedWords.length === 0 && (
                  <div className="text-[11px] text-sky-300 bg-sky-950/60 border border-sky-500/25 px-3 py-1 rounded-full mb-3 inline-flex items-center justify-center gap-1.5 mx-auto">
                    <span>✨ Starter Quiz (Swipe right on cards to quiz your custom library)</span>
                  </div>
                )}

                {/* Quiz Progress */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span>
                    Card {quizIndex + 1} of {quizDeck.length}
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    Score: {quizScore.correct} / {quizScore.total}
                  </span>
                </div>

                {/* Quiz Sub-mode Switcher */}
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-slate-800 p-0.5 rounded-xl flex items-center gap-0.5 border border-slate-700 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setQuizType('multipleChoice');
                        setSelectedChoice(null);
                        setIsEvaluated(false);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        quizType === 'multipleChoice'
                          ? 'bg-sky-500 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>4-Choice Quiz</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuizType('flashcard');
                        setShowQuizAnswer(false);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        quizType === 'flashcard'
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Flashcards</span>
                    </button>
                  </div>
                </div>

                {/* Multiple Choice Quiz View */}
                {quizType === 'multipleChoice' ? (
                  <div className="my-auto text-center max-w-lg mx-auto w-full py-1">
                    <span className="text-[10px] sm:text-xs uppercase font-semibold text-sky-400 tracking-wider bg-sky-950/60 px-3 py-1 rounded-full border border-sky-500/30 mb-2 inline-block">
                      {currentQuizCard.partOfSpeech}
                    </span>

                    <h3 className="text-base sm:text-xl font-medium text-slate-100 mb-2 leading-relaxed">
                      "{currentQuizCard.definition}"
                    </h3>

                    {currentQuizCard.hindiMeaning && (
                      <p className="text-xs text-slate-400 mb-5">
                        <span className="text-slate-500">Hint (Hindi): </span>
                        <span className="text-slate-300 font-medium">{currentQuizCard.hindiMeaning}</span>
                      </p>
                    )}

                    {/* 4 Choices Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md mx-auto w-full mb-3">
                      {currentOptions.map((opt, idx) => {
                        const isSelected = selectedChoice === opt;
                        const isCorrectAnswer = opt.toLowerCase() === currentQuizCard.word.toLowerCase();

                        let btnStyle = 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-200';
                        if (isEvaluated) {
                          if (isCorrectAnswer) {
                            btnStyle = 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-950/50';
                          } else if (isSelected && !isCorrectAnswer) {
                            btnStyle = 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-950/50';
                          } else {
                            btnStyle = 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectChoice(opt)}
                            disabled={isEvaluated}
                            className={`p-3.5 rounded-xl border text-sm sm:text-base font-serif font-bold capitalize transition-all duration-200 active:scale-95 flex items-center justify-between gap-2 shadow-sm ${btnStyle}`}
                          >
                            <span className="truncate">{opt}</span>
                            {isEvaluated && isCorrectAnswer && (
                              <Check className="w-4 h-4 text-white shrink-0" />
                            )}
                            {isEvaluated && isSelected && !isCorrectAnswer && (
                              <XCircle className="w-4 h-4 text-white shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Button after incorrect choice */}
                    {isEvaluated && selectedChoice?.toLowerCase() !== currentQuizCard.word.toLowerCase() && (
                      <div className="flex items-center justify-center gap-2 mt-3 animate-fadeIn">
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(currentQuizCard.word, currentQuizCard.audioUrl)}
                          className="px-3 py-2 rounded-xl bg-slate-800 text-sky-400 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdvanceNext()}
                          className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
                        >
                          Next Word →
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Flashcard Recall View */
                  <div className="my-auto text-center max-w-lg mx-auto w-full py-2">
                    <span className="text-[10px] sm:text-xs uppercase font-semibold text-sky-400 tracking-wider bg-sky-950/60 px-3 py-1 rounded-full border border-sky-500/30 mb-3 inline-block">
                      {currentQuizCard.partOfSpeech}
                    </span>

                    <h3 className="text-sm sm:text-lg font-medium text-slate-200 mb-5 leading-relaxed">
                      "{currentQuizCard.definition}"
                    </h3>

                    {/* Revealed Answer */}
                    {showQuizAnswer ? (
                      <div className="animate-fadeIn p-4 sm:p-6 bg-slate-800 border border-slate-700 rounded-2xl mb-5 shadow-xl">
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white capitalize">
                            {currentQuizCard.word}
                          </h2>
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(currentQuizCard.word, currentQuizCard.audioUrl)}
                            className="p-1.5 rounded-full bg-slate-700 text-sky-400 hover:text-white"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        {currentQuizCard.phonetic && (
                          <p className="text-xs text-slate-400 font-mono mb-2">
                            {currentQuizCard.phonetic}
                          </p>
                        )}
                        {currentQuizCard.hindiMeaning && (
                          <p className="text-xs text-slate-300 mb-3">
                            <span className="text-slate-400 font-medium">Hindi: </span>
                            <span>{currentQuizCard.hindiMeaning}</span>
                          </p>
                        )}
                        {currentQuizCard.examples?.[0] && (
                          <p className="text-xs text-slate-300 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                            "{currentQuizCard.examples[0]}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowQuizAnswer(true)}
                        className="px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-400 font-semibold text-xs sm:text-sm transition-all shadow-lg active:scale-95 mb-5"
                      >
                        Reveal Word
                      </button>
                    )}

                    {/* Answer Scoring Buttons */}
                    {showQuizAnswer ? (
                      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full">
                        <button
                          type="button"
                          onClick={() => handleQuizNext(false)}
                          className="py-3 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 font-semibold text-xs sm:text-sm transition-all active:scale-95"
                        >
                          Still Learning ✕
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuizNext(true)}
                          className="py-3 px-3 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-500/40 text-emerald-400 font-semibold text-xs sm:text-sm transition-all active:scale-95"
                        >
                          I Knew It! ✓
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-[11px] text-slate-500">
                        Try to recall the word from its definition before clicking reveal.
                      </div>
                    )}
                  </div>
                )}

                {/* Sticky Mobile Exit Bar inside Quiz */}
                <div className="pt-4 border-t border-slate-800 sm:hidden mt-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs active:scale-95 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Exit Quiz & Return to Swiping</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
