import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
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
    console.error('Uncaught error in MediCore UI:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-400 mb-6">
              An unexpected runtime error occurred during hospital resource processing operations.
            </p>
            {this.state.error && (
              <div className="mb-6 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-rose-400 font-mono text-left overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
