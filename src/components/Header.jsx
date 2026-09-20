import React from 'react';
import { Key, Sparkles, Zap, History } from 'lucide-react';

export default function Header({ onOpenApiKeyModal, onOpenHistoryModal, isApiKeyConfigured, onLoadSample }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Brand / Logo */}
        <div className="flex items-center space-x-2.5 shrink-0 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <h1 className="text-xs sm:text-base md:text-lg font-extrabold text-white tracking-tight whitespace-nowrap">
                AI CAREER COPILOT
              </h1>
              <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block truncate max-w-[200px] md:max-w-none">
              Smart Resume Analyzer & Job Match Engine
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          
          {/* History Button */}
          <button
            onClick={onOpenHistoryModal}
            className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-all"
            title="View DB History"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">DB History</span>
          </button>

          {/* Preset Data Loader Button */}
          <button
            onClick={onLoadSample}
            className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-all shadow-sm"
            title="Load Sample Resumes"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Sample Demo</span>
          </button>

          {/* Gemini API Key Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              isApiKeyConfigured
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Gemini API Key"
          >
            <Key className={`w-3.5 h-3.5 ${isApiKeyConfigured ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="hidden lg:inline">{isApiKeyConfigured ? 'Gemini Active' : 'API Key'}</span>
            {isApiKeyConfigured && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
}
