import React from 'react';
import { Layers, BookMarked, BrainCircuit, Download } from 'lucide-react';

interface BottomNavProps {
  savedCount: number;
  onOpenLibrary: () => void;
  onOpenQuiz: () => void;
  onOpenInstall: () => void;
  isStandalone?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  savedCount,
  onOpenLibrary,
  onOpenQuiz,
  onOpenInstall,
  isStandalone = false
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="w-full bg-slate-900/95 border-t border-slate-800/90 backdrop-blur-lg px-6 py-1.5 flex items-center justify-around z-30 select-none sm:hidden safe-bottom"
    >
      {/* Tab 1: Swipe Cards (Active Home) */}
      <button
        type="button"
        className="flex flex-col items-center justify-center py-1 px-4 text-sky-400 group active:scale-90 transition-all"
        title="Discover Words"
      >
        <div className="relative p-1">
          <Layers className="w-5 h-5 drop-shadow-sm" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
        </div>
        <span className="text-[10px] font-bold tracking-tight text-sky-400 mt-0.5">
          Discover
        </span>
      </button>

      {/* Tab 2: Remember Library (Unmistakable & Never Cut Off!) */}
      <button
        type="button"
        onClick={onOpenLibrary}
        className="flex flex-col items-center justify-center py-1 px-4 text-slate-400 hover:text-white active:scale-90 transition-all group relative"
        title="Remember Library"
      >
        <div className="relative p-1">
          <BookMarked className="w-5 h-5 group-hover:text-sky-400 transition-colors" />
          {savedCount > 0 && (
            <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-full text-[9px] font-mono font-bold shadow-md shadow-sky-500/30">
              {savedCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold tracking-tight text-slate-300 group-hover:text-white mt-0.5">
          Library
        </span>
      </button>

      {/* Tab 3: Memory Quiz */}
      <button
        type="button"
        onClick={onOpenQuiz}
        className="flex flex-col items-center justify-center py-1 px-4 text-slate-400 hover:text-white active:scale-90 transition-all group touch-manipulation cursor-pointer"
        title="Memory Quiz"
      >
        <div className="p-1">
          <BrainCircuit className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
        </div>
        <span className="text-[10px] font-semibold tracking-tight text-slate-300 group-hover:text-white mt-0.5">
          Quiz
        </span>
      </button>

      {/* Tab 4: Get App (ONLY shown on browser web when NOT installed, COMPLETELY REMOVED inside installed app!) */}
      {!isStandalone && (
        <button
          type="button"
          onClick={onOpenInstall}
          className="flex flex-col items-center justify-center py-1 px-4 text-slate-400 hover:text-white active:scale-90 transition-all group"
          title="Install Web App"
        >
          <div className="p-1">
            <Download className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
          </div>
          <span className="text-[10px] font-semibold tracking-tight text-slate-300 group-hover:text-white mt-0.5">
            Get App
          </span>
        </button>
      )}
    </nav>
  );
};
