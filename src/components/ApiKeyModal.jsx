import React, { useState, useEffect } from 'react';
import { X, Key, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../services/geminiService';

export default function ApiKeyModal({ isOpen, onClose, onSaveKey }) {
  const [keyInput, setKeyInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeyInput(getStoredApiKey());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(keyInput);
    setSavedSuccess(true);
    onSaveKey(!!keyInput.trim());
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setKeyInput('');
    setStoredApiKey('');
    onSaveKey(false);
    setSavedSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Google Gemini API Key</h3>
              <p className="text-xs text-slate-400">Enable deep AI analysis & STAR bullet rewriting</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info box */}
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300 space-y-1">
          <p className="font-semibold flex items-center gap-1.5 text-indigo-200">
            <AlertCircle className="w-4 h-4 text-indigo-400" />
            Optional Enhancement
          </p>
          <p className="text-slate-300">
            Without an API key, the app runs on a fast, deterministic local NLP engine for instant offline skill matching & ATS scoring.
          </p>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Gemini API Key
          </label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-mono"
          />
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center text-xs text-indigo-400 hover:text-indigo-300 hover:underline gap-1 mt-1"
          >
            <span>Get a free API key from Google AI Studio</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleClear}
            className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors"
          >
            Remove Key
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Key</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
