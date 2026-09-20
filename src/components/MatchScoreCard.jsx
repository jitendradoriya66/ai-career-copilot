import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Zap, CheckCircle2, AlertTriangle, TrendingUp, Target, FileCheck, Sparkles, Brain, Cpu } from 'lucide-react';

export default function MatchScoreCard({ analysis }) {
  const { overallScore, tfidfScore, semanticScore, grade, skillMatchPercent, atsMetrics, source } = analysis;

  useEffect(() => {
    if (overallScore >= 80) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [overallScore]);

  let badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  if (overallScore >= 85) {
    badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (overallScore >= 70) {
    badgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  } else if (overallScore >= 60) {
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }

  // SVG Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Gauge Ring */}
        <div className="flex items-center space-x-6">
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="text-slate-800 stroke-current"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-current transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  stroke: overallScore >= 85 ? '#10b981' : overallScore >= 70 ? '#6366f1' : '#f59e0b'
                }}
              />
            </svg>

            {/* Score Text inside Circle */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white tracking-tight">{overallScore}%</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overall Match</span>
            </div>
          </div>

          {/* Text Description */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${badgeColor}`}>
                ATS Grade: {grade}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-medium flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>{source === 'python_fastapi' ? 'FastAPI ML Engine' : 'Offline Engine'}</span>
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">
              {overallScore >= 85 ? 'High Compatibility Match' : overallScore >= 70 ? 'Good Match with Targeted Gaps' : 'Needs Optimization'}
            </h3>
            
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Calculated across exact TF-IDF keyword overlap, dense 384-dim semantic embeddings, action verb density, and quantifiable metrics.
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="w-full md:w-auto grid grid-cols-2 sm:grid-cols-3 gap-3 min-w-[300px]">
          
          {/* Sparse TF-IDF Score */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300 font-medium"><Cpu className="w-3.5 h-3.5 text-sky-400" /> TF-IDF Match</span>
              <span className="font-bold text-slate-100">{tfidfScore ?? overallScore}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-sky-400 rounded-full" style={{ width: `${tfidfScore ?? overallScore}%` }}></div>
            </div>
          </div>

          {/* Dense Vector Semantic Embeddings Score */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300 font-medium"><Brain className="w-3.5 h-3.5 text-purple-400" /> Semantic Match</span>
              <span className="font-bold text-slate-100">{semanticScore ?? overallScore}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full" style={{ width: `${semanticScore ?? overallScore}%` }}></div>
            </div>
          </div>

          {/* Skill Coverage % */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300 font-medium"><Target className="w-3.5 h-3.5 text-indigo-400" /> Skill Fit</span>
              <span className="font-bold text-slate-100">{skillMatchPercent}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${skillMatchPercent}%` }}></div>
            </div>
          </div>

          {/* Verbs Score */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300 font-medium"><Zap className="w-3.5 h-3.5 text-amber-400" /> Action Verbs</span>
              <span className="font-bold text-slate-100">{atsMetrics.actionVerbScore}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${atsMetrics.actionVerbScore}%` }}></div>
            </div>
          </div>

          {/* Metrics Density */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300 font-medium"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Metrics Density</span>
              <span className="font-bold text-slate-100">{atsMetrics.metricScore}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${atsMetrics.metricScore}%` }}></div>
            </div>
          </div>

          {/* ATS Section Structure */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300 font-medium"><FileCheck className="w-3.5 h-3.5 text-purple-400" /> ATS Sections</span>
              <span className="font-bold text-slate-100">{atsMetrics.sectionScore}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full" style={{ width: `${atsMetrics.sectionScore}%` }}></div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
