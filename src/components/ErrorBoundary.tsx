import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 select-none">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto mb-3 text-rose-400 font-bold text-xl">
              !
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Something went wrong</h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              We encountered an issue loading this view. You can return to swiping immediately.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-lg shadow-sky-500/25 active:scale-95 transition-all"
            >
              Back to Swiping
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
