import React from 'react';
import { FileSearch, CheckCircle2, AlertTriangle, Zap, TrendingUp, Lightbulb, FileText } from 'lucide-react';

export default function ATSFeedback({ atsMetrics, recommendations }) {
  const { foundVerbs, actionVerbScore, metricScore, metricCount, foundSections, missingSections } = atsMetrics;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <FileSearch className="w-5 h-5 text-indigo-400" />
          <span>ATS Optimization & Content Quality Audit</span>
        </h2>
        <p className="text-xs text-slate-400">Detailed line-by-line feedback to pass Applicant Tracking Systems</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Action Verbs Audit */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> Action Verbs Audit
            </span>
            <span className="text-xs font-semibold text-amber-400">{foundVerbs.length} verbs found</span>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[60px]">
            {foundVerbs.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No strong action verbs found. Add verbs like "Spearheaded", "Architected", "Optimized".</p>
            ) : (
              foundVerbs.map((verb, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-mono capitalize">
                  {verb}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Quantifiable Metrics Density */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Quantifiable Impact
            </span>
            <span className="text-xs font-semibold text-emerald-400">{metricCount} metrics</span>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed min-h-[60px]">
            {metricCount >= 4 ? (
              <div className="flex items-start space-x-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Great job! Resume includes rich numeric proof (%, $, 2x, team sizes).</span>
              </div>
            ) : (
              <div className="flex items-start space-x-2 text-amber-400">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Low metric count. Add data (e.g. "Reduced load latency by 45%", "Managed \$50k budget").</span>
              </div>
            )}
          </div>
        </div>

        {/* Standard ATS Section Headers */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-400" /> ATS Section Check
            </span>
            <span className="text-xs font-semibold text-purple-400">{foundSections.length}/5 Sections</span>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[60px]">
            {['summary', 'experience', 'skills', 'education', 'projects'].map((sec) => {
              const isFound = foundSections.includes(sec);
              return (
                <span
                  key={sec}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-medium flex items-center space-x-1 capitalize border ${
                    isFound
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                  }`}
                >
                  {isFound ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <AlertTriangle className="w-3 h-3 text-rose-400" />}
                  <span>{sec}</span>
                </span>
              );
            })}
          </div>
        </div>

      </div>

      {/* AI / NLP Action Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-400" /> Key Action Items for Improvement
          </h3>

          <div className="space-y-2.5">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs flex items-start space-x-3">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0 mt-0.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-200">{rec.title}</h4>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
