import React, { useState } from 'react';
import { Volume2, Sparkles, RotateCw } from 'lucide-react';
import { WordCard } from '../types';
import { audioService } from '../services/audioService';

interface CardFrontProps {
  card: WordCard;
  onFlip: () => void;
}

const PART_OF_SPEECH_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  noun: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' },
  verb: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  adjective: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  adverb: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  default: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' }
};

export const CardFront: React.FC<CardFrontProps> = ({ card, onFlip }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const posStyle = PART_OF_SPEECH_COLORS[card.partOfSpeech.toLowerCase()] || PART_OF_SPEECH_COLORS.default;

  const handleAudioClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsPlayingAudio(true);
    audioService.playWord(card.word, card.audioUrl, () => {
      setIsPlayingAudio(false);
    });
  };

  return (
    <div className="w-full h-full p-5 sm:p-7 flex flex-col justify-between bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl relative overflow-hidden select-none">
      {/* Decorative ambient subtle background glows */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between z-10">
        <span
          className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}
        >
          {card.partOfSpeech}
        </span>

        {/* Difficulty / Tag */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{card.difficulty || 'Discovery'}</span>
        </div>
      </div>

      {/* Center Word & Pronunciation */}
      <div className="my-auto text-center flex flex-col items-center z-10 py-2">
        {/* The Word */}
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white capitalize mb-3 drop-shadow-sm font-serif">
          {card.word}
        </h2>

        {/* Phonetics & Speaker Button */}
        <div className="flex items-center gap-3">
          {card.phonetic && (
            <span className="text-slate-400 font-mono text-sm sm:text-base tracking-wide">
              {card.phonetic}
            </span>
          )}

          {/* Pronunciation Speaker Button */}
          <button
            type="button"
            data-no-drag="true"
            onClick={handleAudioClick}
            aria-label={`Listen to pronunciation of ${card.word}`}
            className={`p-2.5 rounded-full transition-all duration-200 shadow-md ${
              isPlayingAudio
                ? 'bg-sky-500 text-white scale-110 shadow-sky-500/50 animate-pulse'
                : 'bg-slate-800 text-sky-400 hover:bg-sky-500 hover:text-white hover:scale-105 active:scale-95 border border-sky-500/30'
            }`}
          >
            <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
          </button>
        </div>


        {/* One-liner definition teaser */}
        <div className="mt-4 max-w-sm px-2">
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3 font-normal">
            {card.definition}
          </p>
        </div>
      </div>

      {/* Bottom Action Prompts */}
      <div className="z-10 pt-2 border-t border-slate-800/80 flex flex-col items-center gap-2">
        <button
          type="button"
          data-no-drag="true"
          onClick={(e) => {
            e.stopPropagation();
            onFlip();
          }}
          className="flex items-center gap-2 text-xs font-semibold text-sky-400 bg-sky-950/60 hover:bg-sky-900/80 px-4 py-2 rounded-full border border-sky-500/30 transition-all cursor-pointer active:scale-95 shadow-sm"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Tap to flip for usage & examples</span>
        </button>

        <div className="flex items-center justify-between w-full text-[11px] text-slate-500 px-1">
          <span>👈 Swipe left to skip</span>
          <span>Swipe right to save 👉</span>
        </div>
      </div>
    </div>
  );
};
