import React, { useState } from 'react';
import { Volume2, RotateCcw, BookOpen, Quote, Sparkles, Compass } from 'lucide-react';
import { WordCard } from '../types';
import { audioService } from '../services/audioService';

interface CardBackProps {
  card: WordCard;
  onFlip: () => void;
}

export const CardBack: React.FC<CardBackProps> = ({ card, onFlip }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleAudioClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsPlayingAudio(true);
    audioService.playWord(card.word, card.audioUrl, () => {
      setIsPlayingAudio(false);
    });
  };

  /**
   * Highlights the target word inside an example sentence
   */
  const renderHighlightedExample = (sentence: string, targetWord: string) => {
    const regex = new RegExp(`(\\b${targetWord}\\w*)`, 'gi');
    const parts = sentence.split(regex);

    return parts.map((part, i) => {
      if (regex.test(part)) {
        return (
          <span
            key={i}
            className="text-sky-300 font-semibold underline decoration-sky-400 decoration-2 underline-offset-2 bg-sky-950/60 px-1 py-0.5 rounded"
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="w-full h-full p-5 sm:p-7 flex flex-col justify-between bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl relative overflow-hidden select-none">
      {/* Ambient subtle background accent */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Mini Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 z-10">
        <div className="flex items-center gap-2">
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-white capitalize">
            {card.word}
          </h3>
          <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700/60">
            {card.partOfSpeech}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Listen */}
          <button
            type="button"
            data-no-drag="true"
            onClick={handleAudioClick}
            aria-label="Listen pronunciation"
            className="p-1.5 rounded-full bg-slate-800 text-sky-400 hover:bg-sky-500 hover:text-white transition-colors"
            title="Listen pronunciation"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
          </button>

          {/* Flip to Front Button */}
          <button
            type="button"
            data-no-drag="true"
            onClick={(e) => {
              e.stopPropagation();
              onFlip();
            }}
            aria-label="Flip back"
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 px-2.5 py-1 rounded-full border border-slate-700/60 transition-colors active:scale-95"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Front</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content Body with smooth mobile touch pan-y */}
      <div
        data-scrollable="true"
        className="flex-1 overflow-y-auto my-2.5 pr-1 space-y-3.5 text-left z-10 touch-pan-y overscroll-contain select-text"
      >
        {/* Definition Section */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>Definition</span>
          </div>
          <p className="text-sm sm:text-base text-slate-200 leading-snug">
            {card.definition}
          </p>
          {card.secondaryDefinitions && card.secondaryDefinitions.length > 0 && (
            <div className="mt-2 pl-3 border-l-2 border-slate-700/60 space-y-1">
              {card.secondaryDefinitions.map((sec, i) => (
                <p key={i} className="text-xs sm:text-sm text-slate-400 italic">
                  • {sec}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Hindi Meaning Section (Unhighlighted, clean standard text) */}
        {card.hindiMeaning && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Hindi Meaning
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-snug">
              {card.hindiMeaning}
            </p>
          </div>
        )}

        {/* Real-World Usage / Examples Section */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <Quote className="w-3.5 h-3.5 text-amber-400" />
            <span>Usage in Context</span>
          </div>
          <div className="space-y-2">
            {card.examples && card.examples.length > 0 ? (
              card.examples.map((ex, i) => (
                <div
                  key={i}
                  className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-xs sm:text-sm text-slate-300 leading-relaxed italic"
                >
                  "{renderHighlightedExample(ex, card.word)}"
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No example sentence available.</p>
            )}
          </div>
        </div>

        {/* Synonyms & Antonyms */}
        {((card.synonyms && card.synonyms.length > 0) || (card.antonyms && card.antonyms.length > 0)) && (
          <div className="space-y-2 pt-1">
            {card.synonyms && card.synonyms.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400/90 block mb-1">
                  Synonyms
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {card.synonyms.map((s, i) => (
                    <span
                      key={i}
                      className="text-xs bg-emerald-950/60 text-emerald-300 border border-emerald-500/25 px-2 py-0.5 rounded-md"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {card.antonyms && card.antonyms.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400/90 block mb-1">
                  Antonyms
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {card.antonyms.map((a, i) => (
                    <span
                      key={i}
                      className="text-xs bg-rose-950/60 text-rose-300 border border-rose-500/25 px-2 py-0.5 rounded-md"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Etymology / Origin if available */}
        {card.etymology && (
          <div className="pt-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Etymology & Backstory</span>
            </div>
            <p className="text-xs text-slate-300 bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-2.5 italic">
              {card.etymology}
            </p>
          </div>
        )}
      </div>

      {/* Bottom return bar */}
      <div className="z-10 pt-2 border-t border-slate-800 flex items-center justify-center">
        <button
          type="button"
          data-no-drag="true"
          onClick={(e) => {
            e.stopPropagation();
            onFlip();
          }}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors py-1 flex items-center gap-1.5 active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Tap anywhere or click here to flip front</span>
        </button>
      </div>
    </div>
  );
};
