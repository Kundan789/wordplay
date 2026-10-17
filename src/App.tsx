import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WordCard, WordCategory, UserStats } from './types';
import { wordService } from './services/wordService';
import { storageService } from './services/storageService';
import { audioService } from './services/audioService';
import { soundEffects } from './services/soundEffects';
import { Header } from './components/Header';
import { CardStack } from './components/CardStack';
import { ControlsBar } from './components/ControlsBar';
import { RememberLibraryModal } from './components/RememberLibraryModal';
import { InstallModal } from './components/InstallModal';
import { BottomNav } from './components/BottomNav';
import { ErrorBoundary } from './components/ErrorBoundary';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [category, setCategory] = useState<WordCategory>('mixed');

  // INSTANT zero-wait card load from pre-packaged / cached pool
  const [cards, setCards] = useState<WordCard[]>(() =>
    wordService.getInitialInstantBatch('mixed', 5)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTopFlipped, setIsTopFlipped] = useState<boolean>(false);
  const [savedWords, setSavedWords] = useState<WordCard[]>([]);
  const [stats, setStats] = useState<UserStats>(storageService.getStats());
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [libraryInitialTab, setLibraryInitialTab] = useState<'library' | 'quiz'>('library');
  const [forcedDirection, setForcedDirection] = useState<'left' | 'right' | null>(null);

  // Sound and Speech Speed states
  const [isMuted, setIsMuted] = useState<boolean>(soundEffects.isMuted);
  const [isSlowSpeed, setIsSlowSpeed] = useState<boolean>(audioService.isSlowMode);

  // Swipe history for Undo capability
  const [swipeHistory, setSwipeHistory] = useState<{ card: WordCard; action: 'pass' | 'save' }[]>([]);

  // PWA install prompt event & Install Popup modal
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  const isFetchingRef = useRef(false);

  // Check standalone mode on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkStandalone = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(standalone);
      return standalone;
    };

    const standalone = checkStandalone();
    try {
      window.matchMedia('(display-mode: standalone)').addEventListener('change', checkStandalone);
    } catch (e) {}

    setSavedWords(storageService.getRememberedWords());
    setStats(storageService.getStats());

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Only auto-trigger download popup when app opens in normal browser (NOT in installed standalone app)
    if (!standalone) {
      const dismissed = sessionStorage.getItem('wordplay_install_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsInstallModalOpen(true);
        }, 1200);
        return () => {
          clearTimeout(timer);
          window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        };
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Preload audio for current card and upcoming cards to ensure 0-delay playback
  useEffect(() => {
    if (cards.length > 0) {
      if (cards[0]?.audioUrl) audioService.preloadAudio(cards[0].audioUrl);
      if (cards[1]?.audioUrl) audioService.preloadAudio(cards[1].audioUrl);
      if (cards[2]?.audioUrl) audioService.preloadAudio(cards[2].audioUrl);
    }
  }, [cards]);

  // Background lazy loader for endless batching
  const loadBatch = useCallback(async (cat: WordCategory, replaceAll = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const newCards = await wordService.getBatch(cat, 6);
      setCards((prev) => {
        if (replaceAll) return newCards;
        const existingWords = new Set(prev.map((c) => c.word.toLowerCase()));
        const fresh = newCards.filter((c) => !existingWords.has(c.word.toLowerCase()));
        return [...prev, ...fresh];
      });
    } catch (err) {
      console.error('Batch load error:', err);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Immediate category change with 0ms instant display + background top-up
  useEffect(() => {
    setIsTopFlipped(false);
    audioService.stop();

    const instantCards = wordService.getInitialInstantBatch(category, 5);
    setCards(instantCards);

    loadBatch(category, false);
  }, [category, loadBatch]);

  // Handle Swipe (Left = Pass, Right = Remember)
  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      if (cards.length === 0) return;

      audioService.stop();
      const currentCard = cards[0];
      const remainingCards = cards.slice(1);

      wordService.recordSeen(currentCard.word);

      if (direction === 'right') {
        soundEffects.playSave();
        const saved = storageService.saveWord(currentCard);
        if (saved) {
          setSavedWords(storageService.getRememberedWords());
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.7, x: 0.75 },
            colors: ['#10b981', '#38bdf8', '#fbbf24']
          });
        }
        setSwipeHistory((prev) => [{ card: currentCard, action: 'save' }, ...prev.slice(0, 19)]);
      } else {
        soundEffects.playPass();
        storageService.incrementStats('pass');
        setSwipeHistory((prev) => [{ card: currentCard, action: 'pass' }, ...prev.slice(0, 19)]);
      }

      const updatedStats = storageService.getStats();
      if (updatedStats.cardsToday === 10) {
        soundEffects.playFanfare();
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.4 }
        });
      }

      setStats(updatedStats);
      setCards(remainingCards);
      setForcedDirection(null);
      setIsTopFlipped(false);

      if (remainingCards.length < 4) {
        loadBatch(category, false);
      }
    },
    [cards, category, loadBatch]
  );

  // Undo Last Swipe
  const handleUndo = useCallback(() => {
    if (swipeHistory.length === 0) return;

    soundEffects.playFlip();
    audioService.stop();
    const [lastItem, ...restHistory] = swipeHistory;
    setSwipeHistory(restHistory);

    if (lastItem.action === 'save') {
      storageService.removeWord(lastItem.card.id || lastItem.card.word);
      setSavedWords(storageService.getRememberedWords());
    }

    setIsTopFlipped(false);
    setCards((prev) => [lastItem.card, ...prev]);
  }, [swipeHistory]);

  // Pronounce current top card
  const handlePronounce = useCallback(() => {
    if (cards.length > 0) {
      audioService.playWord(cards[0].word, cards[0].audioUrl);
    }
  }, [cards]);

  // Toggle Flip on current top card
  const handleFlipTop = useCallback(() => {
    soundEffects.playFlip();
    setIsTopFlipped((prev) => !prev);
  }, []);

  // Programmatic Button Swipes
  const triggerPass = useCallback(() => {
    if (cards.length > 0 && !forcedDirection) {
      setForcedDirection('left');
    }
  }, [cards, forcedDirection]);

  const triggerRemember = useCallback(() => {
    if (cards.length > 0 && !forcedDirection) {
      setForcedDirection('right');
    }
  }, [cards, forcedDirection]);

  // Open Library Helpers
  const handleOpenLibrary = useCallback(() => {
    setLibraryInitialTab('library');
    setIsLibraryOpen(true);
  }, []);

  const handleOpenQuiz = useCallback(() => {
    setLibraryInitialTab('quiz');
    setIsLibraryOpen(true);
  }, []);

  // Sound Mute Toggle
  const handleToggleMute = useCallback(() => {
    const nextMute = soundEffects.toggleMute();
    setIsMuted(nextMute);
  }, []);

  // Speech Speed Toggle
  const handleToggleSpeed = useCallback(() => {
    const nextSlow = audioService.toggleSpeed();
    setIsSlowSpeed(nextSlow);
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLibraryOpen || isInstallModalOpen || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        triggerPass();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        triggerRemember();
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleFlipTop();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        handlePronounce();
      } else if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLibraryOpen, isInstallModalOpen, triggerPass, triggerRemember, handleFlipTop, handlePronounce, handleUndo]);

  // PWA Install Action
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setDeferredPrompt(null);
          setIsInstallModalOpen(false);
        }
      } catch (err) {
        setIsInstallModalOpen(true);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };

  const handleDismissInstall = () => {
    setIsInstallModalOpen(false);
    try {
      sessionStorage.setItem('wordplay_install_dismissed', 'true');
    } catch (e) {}
  };

  return (
    <div className="relative w-full h-[100dvh] flex flex-col justify-between overflow-hidden bg-slate-950 bg-ambient-mesh text-slate-100 font-sans pt-[env(safe-area-inset-top,0px)] select-none">
      {/* Top Header */}
      <Header
        category={category}
        onSelectCategory={setCategory}
        stats={stats}
        savedCount={savedWords.length}
        onOpenLibrary={handleOpenLibrary}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isSlowSpeed={isSlowSpeed}
        onToggleSpeed={handleToggleSpeed}
      />

      {/* Main Card Swiping Stage */}
      <main className="flex-1 flex flex-col items-center justify-center px-3 my-auto relative z-10 w-full max-w-lg mx-auto min-h-0">
        <CardStack
          cards={cards}
          onSwipe={handleSwipe}
          isFlipped={isTopFlipped}
          onFlipCard={handleFlipTop}
          forcedDirection={forcedDirection}
          isLoading={isLoading && cards.length === 0}
          onRefresh={() => loadBatch(category, true)}
        />
      </main>

      {/* Bottom Floating Swipe Controls Bar */}
      <div className="w-full relative z-20 pb-1 sm:pb-3 shrink-0">
        <ControlsBar
          onPass={triggerPass}
          onPronounce={handlePronounce}
          onFlip={handleFlipTop}
          onRemember={triggerRemember}
          disabled={cards.length === 0 || !!forcedDirection}
        />
      </div>

      {/* Dedicated Mobile Bottom Navigation Dock */}
      <BottomNav
        savedCount={savedWords.length}
        onOpenLibrary={handleOpenLibrary}
        onOpenQuiz={handleOpenQuiz}
        onOpenInstall={handleInstallClick}
        isStandalone={isStandalone}
      />

      {/* Remember Library Modal Drawer */}
      <ErrorBoundary onReset={() => setIsLibraryOpen(false)}>
        <RememberLibraryModal
          isOpen={isLibraryOpen}
          onClose={() => setIsLibraryOpen(false)}
          savedWords={savedWords}
          initialTab={libraryInitialTab}
          onUpdateWords={() => {
            setSavedWords(storageService.getRememberedWords());
            setStats(storageService.getStats());
          }}
        />
      </ErrorBoundary>

      {/* Download / Install App Popup Modal (Only on browser web, never inside installed standalone app) */}
      {!isStandalone && (
        <InstallModal
          isOpen={isInstallModalOpen}
          deferredPrompt={deferredPrompt}
          onInstall={handleInstallClick}
          onDismiss={handleDismissInstall}
        />
      )}
    </div>
  );
};

export default App;
