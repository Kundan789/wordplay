import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, Share2, PlusSquare, ArrowDown, CheckCircle2 } from 'lucide-react';

interface InstallModalProps {
  deferredPrompt: any;
  onInstall: () => void;
  onDismiss: () => void;
  isOpen: boolean;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  deferredPrompt,
  onInstall,
  onDismiss,
  isOpen
}) => {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroidOrDesktop, setIsAndroidOrDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);
    setIsAndroidOrDesktop(!isIosDevice);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      {/* Modal Card - Bottom Sheet on mobile, centered dialog on desktop */}
      <div
        className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 flex flex-col text-slate-100 relative overflow-hidden pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Drag handle pill on mobile */}
        <div className="w-12 h-1.5 bg-slate-700/70 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header with Close */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30 shrink-0">
              <span className="text-white font-serif font-black text-2xl">W</span>
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-white flex items-center gap-1.5">
                Install WordPlay
                <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-bold">
                  App
                </span>
              </h3>
              <p className="text-xs text-slate-400">Add to your home screen for the best experience</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss download prompt"
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-2 my-2 py-3 border-y border-slate-800/80 text-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 mb-1">
              <Smartphone className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-200">Full Screen</span>
            <span className="text-[10px] text-slate-400">No URL bar</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-1">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-200">Works Offline</span>
            <span className="text-[10px] text-slate-400">Zero loading</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-200">Instant Audio</span>
            <span className="text-[10px] text-slate-400">Native speech</span>
          </div>
        </div>

        {/* Installation Instructions based on Platform */}
        {isIOS ? (
          /* iOS Instructions (Safari does not allow programmatic install prompt) */
          <div className="my-3 p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-2xl text-xs space-y-2">
            <p className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span>To install on iPhone / iPad:</span>
            </p>
            <div className="flex items-center gap-2.5 text-slate-300">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0">1</span>
              <span>Tap the <Share2 className="w-3.5 h-3.5 inline mx-1 text-sky-400" /> <strong>Share</strong> button at bottom of Safari</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0">2</span>
              <span>Scroll down & tap <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-sky-400" /> <strong>Add to Home Screen</strong></span>
            </div>
          </div>
        ) : (
          /* Android & Chrome Direct Install */
          <div className="my-3 text-xs text-slate-300 text-center">
            Install WordPlay directly onto your phone with one tap for standalone fullscreen practice.
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-2">
          {deferredPrompt ? (
            <button
              type="button"
              onClick={onInstall}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-sky-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Install App on Device</span>
            </button>
          ) : isIOS ? (
            <button
              type="button"
              onClick={onDismiss}
              className="w-full py-3 px-4 rounded-2xl bg-sky-500 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              Got It, Thanks!
            </button>
          ) : (
            <button
              type="button"
              onClick={onInstall}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-sky-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Install to Home Screen</span>
            </button>
          )}

          <button
            type="button"
            onClick={onDismiss}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Continue in browser
          </button>
        </div>
      </div>
    </div>
  );
};
