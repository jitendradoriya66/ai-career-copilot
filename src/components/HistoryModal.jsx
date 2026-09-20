import React, { useState, useEffect } from 'react';
import { X, History, Calendar, CheckCircle2, Trophy, Clock, RefreshCw } from 'lucide-react';
import { fetchAnalysisHistory } from '../services/api';

export default function HistoryModal({ isOpen, onClose, onSelectRecord }) {
  const [historyRecords, setHistoryRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setIsLoading(true);
    const records = await fetchAnalysisHistory();
    setHistoryRecords(records);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Analysis Run History</h3>
              <p className="text-xs text-slate-400">Persisted in database via SQLAlchemy ORM</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-indigo-300 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-400" />
              <p>Loading database history...</p>
            </div>
          ) : historyRecords.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 italic">
              No analysis records found in database yet. Run an analysis to store history.
            </div>
          ) : (
            historyRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between gap-4 cursor-pointer"
                onClick={() => {
                  if (onSelectRecord) onSelectRecord(rec);
                  onClose();
                }}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">
                      {rec.job_title || 'Resume vs Job Analysis'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      Grade: {rec.ats_grade}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {rec.created_at ? new Date(rec.created_at).toLocaleString() : 'Recent'}
                    </span>
                    <span>•</span>
                    <span>Matched: {rec.matched_skills?.length || 0} skills</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xl font-black text-indigo-400">{rec.match_score}%</span>
                  <p className="text-[10px] text-slate-400 uppercase">Match Score</p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
