import React from 'react';
import { X, Volume2, RotateCw, Heart } from 'lucide-react';

interface ControlsBarProps {
  onPass: () => void;
  onPronounce: () => void;
  onFlip: () => void;
  onRemember: () => void;
  disabled?: boolean;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  onPass,
  onPronounce,
  onFlip,
  onRemember,
  disabled
}) => {
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch (e) {}
    }
  };

  return (
    <div className="w-full max-w-[min(90vw,360px)] mx-auto flex flex-col items-center gap-1 px-2 select-none">
      {/* Action Buttons Row */}
      <div className="w-full flex items-center justify-around gap-2 bg-slate-900/95 border border-slate-800 p-2 rounded-full shadow-2xl backdrop-blur-md">
        {/* Pass / Skip Button */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            onPass();
          }}
          disabled={disabled}
          aria-label="Pass / Skip word"
          className="p-3.5 sm:p-4 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:scale-105 active:scale-90 transition-all duration-150 shadow-lg shadow-rose-950/40"
          title="Skip word (Left Arrow)"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Pronounce Button */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            onPronounce();
          }}
          disabled={disabled}
          aria-label="Pronounce word"
          className="p-3 sm:p-3.5 rounded-full bg-slate-800 hover:bg-sky-500 text-sky-400 hover:text-white border border-slate-700 hover:scale-105 active:scale-90 transition-all duration-150 shadow-md"
          title="Pronounce word (P)"
        >
          <Volume2 className="w-5 h-5" />
        </button>

        {/* Flip Button */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            onFlip();
          }}
          disabled={disabled}
          aria-label="Flip card"
          className="p-3 sm:p-3.5 rounded-full bg-slate-800 hover:bg-indigo-500 text-indigo-400 hover:text-white border border-slate-700 hover:scale-105 active:scale-90 transition-all duration-150 shadow-md"
          title="Flip card (Spacebar)"
        >
          <RotateCw className="w-5 h-5" />
        </button>

        {/* Remember / Save Button */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            onRemember();
          }}
          disabled={disabled}
          aria-label="Remember / Save word"
          className="p-3.5 sm:p-4 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 hover:scale-105 active:scale-90 transition-all duration-150 shadow-lg shadow-emerald-950/40"
          title="Save to Remember Library (Right Arrow)"
        >
          <Heart className="w-6 h-6 fill-emerald-500/30 stroke-[2.5]" />
        </button>
      </div>

      {/* Desktop Keyboard Hints - Hidden on Mobile */}
      <div className="hidden sm:flex items-center justify-center gap-4 text-[11px] text-slate-500 font-mono tracking-tight pt-0.5">
        <span>← Skip</span>
        <span>Space: Flip</span>
        <span>P: Pronounce</span>
        <span>→ Remember</span>
      </div>
    </div>
  );
};
