import React, { useState } from 'react';
import { CheckCircle2, XCircle, Copy, Check, Filter, Layers, AlertCircle } from 'lucide-react';

export default function SkillMatrix({ matchedSkills, missingSkills }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copied, setCopied] = useState(false);

  // Extract unique categories
  const categories = ['All', ...new Set([...matchedSkills, ...missingSkills].map(s => s.category))];

  // Filter skills
  const filteredMatched = selectedCategory === 'All' 
    ? matchedSkills 
    : matchedSkills.filter(s => s.category === selectedCategory);

  const filteredMissing = selectedCategory === 'All' 
    ? missingSkills 
    : missingSkills.filter(s => s.category === selectedCategory);

  const handleCopyMissing = () => {
    const textToCopy = missingSkills.map(s => s.name).join(', ');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
      
      {/* Header & Category Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Skill Match & Gap Analysis Matrix</span>
          </h2>
          <p className="text-xs text-slate-400">Comparing extracted skills against target job description</p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout: Matched vs Missing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Matched Skills Box */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Matched Skills ({filteredMatched.length})
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 min-h-[160px]">
            {filteredMatched.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">No matched skills found in this category.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredMatched.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="capitalize">{skill.name}</span>
                    <span className="text-[10px] text-emerald-500/80 font-normal">({skill.category})</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Missing Skills Box */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-400" />
              Missing Skills Gaps ({filteredMissing.length})
            </span>

            {missingSkills.length > 0 && (
              <button
                onClick={handleCopyMissing}
                className="inline-flex items-center space-x-1 text-[11px] text-slate-400 hover:text-indigo-400 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Missing'}</span>
              </button>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 min-h-[160px]">
            {filteredMissing.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-emerald-400 text-xs space-y-1">
                <CheckCircle2 className="w-6 h-6" />
                <p className="font-semibold">Full skill coverage matched!</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredMissing.map((skill, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${
                      skill.priority === 'Critical'
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
                    <span className="capitalize">{skill.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                      skill.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {skill.priority}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
