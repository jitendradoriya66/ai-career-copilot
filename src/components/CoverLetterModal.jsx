import React, { useState } from 'react';
import { X, FileText, Copy, Check, Download, Sparkles, RefreshCw } from 'lucide-react';
import { generateCoverLetter, getStoredApiKey } from '../services/geminiService';

export default function CoverLetterModal({ isOpen, onClose, resumeText, jdText, jobTitle, companyName }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const apiKey = getStoredApiKey();
      if (apiKey) {
        const text = await generateCoverLetter(resumeText, jdText, jobTitle, apiKey);
        setCoverLetter(text);
      } else {
        // Offline smart cover letter generator
        setTimeout(() => {
          const generated = `Dear Hiring Team at ${companyName || 'the Company'},

I am writing to express my strong enthusiasm for the ${jobTitle || 'Software Engineer'} role. With a solid foundation in software development, modern web architecture, and scaling robust applications, I am eager to contribute to your team's innovative engineering initiatives.

Throughout my experience, I have specialized in building high-performance, user-centric applications while enforcing high code quality and maintainability. In my previous roles, I successfully spearheaded core feature deployments, optimized system performance metrics, and collaborated across cross-functional teams to deliver impactful software solutions.

What excites me most about this opportunity at ${companyName || 'your organization'} is your focus on technology excellence and continuous innovation. I am confident that my technical skills in modern frameworks, combined with my analytical problem-solving mindset, will allow me to deliver immediate value.

Thank you for your time and consideration. I welcome the opportunity to discuss how my background aligns with your engineering goals.

Sincerely,
[Candidate Name]`;
          setCoverLetter(generated);
          setIsGenerating(false);
        }, 500);
        return;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cover_Letter_${(jobTitle || 'Application').replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Tailored Cover Letter</h3>
              <p className="text-xs text-slate-400">Custom generated for {jobTitle || 'Target Role'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button or Textarea */}
        {!coverLetter && !isGenerating ? (
          <div className="p-8 text-center space-y-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/40">
            <Sparkles className="w-8 h-8 text-indigo-400 mx-auto animate-bounce" />
            <div>
              <h4 className="text-sm font-bold text-white">Ready to generate tailored cover letter</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Generates a compelling, high-converting letter based on your matched experience and target company.
              </p>
            </div>
            <button
              onClick={handleGenerate}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              Generate Cover Letter Now
            </button>
          </div>
        ) : isGenerating ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-7 h-7 text-indigo-400 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-indigo-300">Drafting personalized cover letter...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={12}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleGenerate}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-1.5"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Letter'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
