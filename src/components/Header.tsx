import React from 'react';
import { BookMarked, Flame, Volume2, VolumeX, Gauge } from 'lucide-react';
import { WordCategory, UserStats } from '../types';

interface HeaderProps {
  category: WordCategory;
  onSelectCategory: (cat: WordCategory) => void;
  stats: UserStats;
  savedCount: number;
  onOpenLibrary: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isSlowSpeed: boolean;
  onToggleSpeed: () => void;
}

const CATEGORIES: { id: WordCategory; label: string }[] = [
  { id: 'mixed', label: 'All-Round' },
  { id: 'advanced', label: 'GRE / SAT' },
  { id: 'evocative', label: 'Poetic' },
  { id: 'daily', label: 'Daily' },
  { id: 'literature', label: 'Literary' },
];

export const Header: React.FC<HeaderProps> = ({
  category,
  onSelectCategory,
  stats,
  savedCount,
  onOpenLibrary,
  isMuted,
  onToggleMute,
  isSlowSpeed,
  onToggleSpeed
}) => {
  return (
    <header className="w-full max-w-xl mx-auto px-3 sm:px-4 pt-1.5 pb-1 sm:py-2.5 flex flex-col gap-1.5 z-30 select-none shrink-0">
      <div className="flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/25 shrink-0">
            <span className="text-white font-serif font-black text-base">W</span>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold font-serif text-white tracking-tight flex items-center gap-1">
              WordPlay
              <span className="text-[9px] font-mono uppercase bg-sky-500/10 text-sky-400 border border-sky-500/30 px-1 py-0.2 rounded-full font-bold">
                PRO
              </span>
            </h1>
          </div>
        </div>

        {/* Right Header Controls (Clean & Spacious) */}
        <div className="flex items-center gap-1.5">
          {/* Daily Streak */}
          <div
            className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 shrink-0 shadow-sm"
            title={`Day ${stats.currentStreak} Streak!`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500 animate-pulse" />
            <span>{stats.currentStreak}d</span>
          </div>

          {/* Pronunciation Speed Toggle (1x / 0.75x Slow) */}
          <button
            type="button"
            onClick={onToggleSpeed}
            aria-label="Toggle pronunciation speed"
            className={`px-2 py-1 rounded-full text-[10px] font-bold border transition-colors flex items-center gap-0.5 shadow-sm ${
              isSlowSpeed
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle normal vs slow pronunciation speed"
          >
            <Gauge className="w-3 h-3" />
            <span>{isSlowSpeed ? '0.7x' : '1.0x'}</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors shadow-sm"
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-sky-400" />}
          </button>

          {/* Remember Library Button - Visible on Desktop / Tablets (hidden on small phones where BottomNav takes over) */}
          <button
            type="button"
            onClick={onOpenLibrary}
            aria-label="Open Remember Library"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20 active:scale-95 transition-all shrink-0 ml-1"
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>Library</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 bg-white/25 rounded-full text-[10px]">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all duration-150 ${
              category === cat.id
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30 font-semibold'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </header>
  );
};
