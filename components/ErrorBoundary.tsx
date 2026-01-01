
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
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
          <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 animate-pulse">
               <AlertTriangle size={40} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Oops! Terjadi Kesalahan</h1>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Sistem mengalami kendala teknis. Jangan khawatir, data Anda aman. Silakan muat ulang halaman.
            </p>
            <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200"
                >
                  <RefreshCw size={18} /> Muat Ulang
                </button>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                >
                  <Home size={18} /> Beranda
                </button>
            </div>
            {this.state.error && (
                <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left overflow-hidden">
                    <p className="text-[10px] font-mono text-slate-400 break-all">
                        Error: {this.state.error.toString()}
                    </p>
                </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
