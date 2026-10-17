import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Globe, 
  BookOpen, 
  BrainCircuit, 
  Volume2, 
  ShieldCheck,
  FileText
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const appUrl = 'https://kundan789.github.io/wordplay/';
  const repoUrl = 'https://github.com/Kundan789/wordplay';

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(appUrl);
      } else {
        const input = document.createElement('input');
        input.value = appUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      {/* Modal Dialog */}
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-7 text-slate-100 z-10 max-h-[92vh] overflow-y-auto no-scrollbar pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Drag handle pill on mobile */}
        <div className="w-12 h-1.5 bg-slate-700/70 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close About Modal"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Logo & Title */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30 shrink-0">
            <span className="text-white font-serif font-black text-2xl">W</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-serif text-white tracking-tight">WordPlay</h2>
              <span className="text-[10px] font-mono uppercase bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full font-bold">
                PRO v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Micro-learning vocabulary builder with Hindi support
            </p>
          </div>
        </div>

        {/* Live Link Share Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-950/60 via-slate-800/80 to-indigo-950/40 border border-sky-500/30 mb-5 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              Live Web Application
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Active Online
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/95 rounded-xl p-2 border border-slate-700/80">
            <code className="text-xs text-slate-300 truncate font-mono flex-1 select-all px-1">
              {appUrl}
            </code>
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-2.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 active:scale-95 text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-sm shrink-0"
              title="Copy link to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <a
              href={appUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
              title="Open live app in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Core Features Tour */}
        <div className="space-y-3 mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Key Highlights
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Tinder-Style Swiping</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Swipe right to remember, left to pass. Tap to reveal definition.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5 text-xs font-bold">
                🇮🇳
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Hindi Meaning</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Clean back-of-card Hindi translations for fast contextual recall.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Interactive Quiz</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  4-choice multiple choice challenges & flashcard active recall.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Synthesized Audio</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Accurate native pronunciations with 1.0x and 0.7x speed control.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Links & Word Report */}
        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex flex-col gap-2.5 mb-5">
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between text-xs text-slate-300 hover:text-white group transition-colors"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 fill-current text-slate-400 group-hover:text-white" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>GitHub Repository (Source Code)</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
          </a>

          <a
            href={`${repoUrl}/blob/main/WordPlay_Comprehensive_Project_Report.docx`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between text-xs text-slate-300 hover:text-white group transition-colors border-t border-slate-800/80 pt-2"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400 group-hover:text-sky-300" />
              <span>Comprehensive Project Report (.docx)</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
          </a>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Client-Side • No Data Tracking • Works Offline</span>
          </div>
        </div>

        {/* Footer Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-sky-500/20 transition-all cursor-pointer"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
