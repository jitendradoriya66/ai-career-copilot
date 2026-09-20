import React from 'react';
import { Briefcase, Building2, Sparkles } from 'lucide-react';
import { SAMPLE_JOB_DESCRIPTIONS } from '../services/sampleData';

export default function JobDescriptionInput({ 
  jdText, 
  onChangeJdText, 
  jobTitle, 
  onChangeJobTitle,
  companyName,
  onChangeCompanyName 
}) {
  const handleLoadSampleJD = (sample) => {
    onChangeJobTitle(sample.title);
    onChangeCompanyName(sample.company);
    onChangeJdText(sample.text);
  };

  const wordCount = jdText ? jdText.trim().split(/\s+/).length : 0;

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-4 border border-slate-800">
      
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Target Job Description</h2>
            <p className="text-xs text-slate-400">Paste job requirements & qualifications</p>
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[11px] text-slate-400 hidden sm:inline">Samples:</span>
          {SAMPLE_JOB_DESCRIPTIONS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleLoadSampleJD(sample)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-purple-300 border border-slate-700 transition-colors"
              title={`Load ${sample.title}`}
            >
              {sample.id === 'senior-react-lead' ? 'React Lead' : 'AI Engineer'}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs for Title & Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="target-job-title-input" className="block text-xs font-medium text-slate-400 mb-1">Target Job Title</label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              id="target-job-title-input"
              type="text"
              value={jobTitle}
              onChange={(e) => onChangeJobTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="company-name-input" className="block text-xs font-medium text-slate-400 mb-1">Company Name (Optional)</label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              id="company-name-input"
              type="text"
              value={companyName}
              onChange={(e) => onChangeCompanyName(e.target.value)}
              placeholder="e.g. InnovateX Tech"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Job Description Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <label htmlFor="jd-textarea" className="font-medium">Job Description Text</label>
          <span>{wordCount} words | {jdText.length} chars</span>
        </div>
        <textarea
          id="jd-textarea"
          value={jdText}
          onChange={(e) => onChangeJdText(e.target.value)}
          rows={11}
          placeholder="Paste job post requirements, responsibilities, and qualifications..."
          className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs font-mono leading-relaxed resize-y"
        />
      </div>

    </div>
  );
}
