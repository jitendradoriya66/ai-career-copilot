import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Copy, Check, Lightbulb, MessageSquare } from 'lucide-react';

export default function InterviewPrep({ questions }) {
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  if (!questions || questions.length === 0) return null;

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCopyQuestion = (q, id) => {
    const text = `Question: ${q.question}\nHint/Strategy: ${q.hint || q.modelAnswer || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
      
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <span>Tailored Interview Questions & Strategy Hints</span>
        </h2>
        <p className="text-xs text-slate-400">Questions generated based on candidate experience match and skill gaps</p>
      </div>

      {/* Questions Cards */}
      <div className="space-y-3">
        {questions.map((q, idx) => {
          const isExpanded = expandedId === (q.id || idx);
          return (
            <div
              key={q.id || idx}
              className="rounded-xl bg-slate-950/70 border border-slate-800 overflow-hidden transition-all hover:border-slate-700"
            >
              {/* Question Header Row */}
              <div
                onClick={() => toggleExpand(q.id || idx)}
                className="p-4 flex items-center justify-between cursor-pointer select-none space-x-3"
              >
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    Q{idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {q.category || 'Technical'}
                      </span>
                      {q.type && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">
                          {q.type}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-semibold text-slate-200 leading-relaxed">
                      {q.question}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyQuestion(q, q.id || idx);
                    }}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedId === (q.id || idx) ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <div className="p-1.5 rounded-lg bg-slate-900 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Strategy & Model Answer Box */}
              {isExpanded && (
                <div className="p-4 bg-indigo-950/20 border-t border-slate-800/80 text-xs space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center space-x-1.5 text-indigo-400 font-semibold">
                    <Lightbulb className="w-4 h-4" />
                    <span>Interview Answer Strategy & Key Points</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed pl-5 font-mono">
                    {q.hint || q.modelAnswer || 'Structure answer using STAR method: Situation, Task, Action, and Quantifiable Result.'}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
