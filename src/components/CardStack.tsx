import React from 'react';
import { WordCard } from '../types';
import { SwipeCard } from './SwipeCard';
import { Loader2, Sparkles, RefreshCw } from 'lucide-react';

interface CardStackProps {
  cards: WordCard[];
  onSwipe: (direction: 'left' | 'right') => void;
  isFlipped?: boolean;
  onFlipCard?: () => void;
  forcedDirection?: 'left' | 'right' | null;
  isLoading: boolean;
  onRefresh?: () => void;
}

export const CardStack: React.FC<CardStackProps> = ({
  cards,
  onSwipe,
  isFlipped = false,
  onFlipCard,
  forcedDirection,
  isLoading,
  onRefresh
}) => {
  // If no cards left and currently loading
  if (cards.length === 0 && isLoading) {
    return (
      <div className="w-full max-w-[min(92vw,400px)] h-[min(460px,calc(100dvh-225px))] min-h-[300px] mx-auto rounded-3xl border border-slate-800 bg-slate-900 flex flex-col items-center justify-center p-6 text-center animate-pulse shadow-xl">
        <Loader2 className="w-10 h-10 text-sky-400 animate-spin mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Unearthing New Words...</h3>
        <p className="text-xs sm:text-sm text-slate-400">Consulting Datamuse & Dictionary databases</p>
      </div>
    );
  }

  // If cards empty and not loading
  if (cards.length === 0) {
    return (
      <div className="w-full max-w-[min(92vw,400px)] h-[min(460px,calc(100dvh-225px))] min-h-[300px] mx-auto rounded-3xl border border-slate-800 bg-slate-900 flex flex-col items-center justify-center p-6 text-center shadow-xl">
        <div className="w-14 h-14 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-3">
          <Sparkles className="w-7 h-7 text-sky-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">You're All Caught Up!</h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-5">
          You have reviewed every word in this batch. Ready to discover more?
        </p>
        <button
          type="button"
          onClick={onRefresh}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold shadow-lg shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Load Fresh Batch</span>
        </button>
      </div>
    );
  }

  // Render top 3 cards in reverse order (bottom to top)
  const visibleCards = cards.slice(0, 3);

  return (
    <div className="relative w-full max-w-[min(92vw,400px)] h-[min(460px,calc(100dvh-225px))] min-h-[300px] mx-auto perspective-1000">
      {visibleCards
        .map((card, index) => {
          const isTop = index === 0;

          // Scale & Translation for stack depth illusion
          let style: React.CSSProperties = {
            zIndex: visibleCards.length - index,
          };

          if (index === 1) {
            style = {
              ...style,
              transform: 'scale(0.94) translateY(12px)',
              opacity: 0.85,
              pointerEvents: 'none',
              transition: 'transform 0.3s ease, opacity 0.3s ease'
            };
          } else if (index === 2) {
            style = {
              ...style,
              transform: 'scale(0.88) translateY(22px)',
              opacity: 0.45,
              pointerEvents: 'none',
              transition: 'transform 0.3s ease, opacity 0.3s ease'
            };
          }

          return (
            <div key={card.id || card.word} className="absolute inset-0" style={style}>
              <SwipeCard
                card={card}
                isTop={isTop}
                onSwipe={onSwipe}
                isFlipped={isTop ? isFlipped : false}
                onFlipCard={isTop ? onFlipCard : undefined}
                forcedDirection={isTop ? forcedDirection : null}
              />
            </div>
          );
        })
        .reverse()}
    </div>
  );
};
