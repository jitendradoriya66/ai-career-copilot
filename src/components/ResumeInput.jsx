import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw, Sparkles, Code, Brain } from 'lucide-react';
import { extractTextFromPDF } from '../services/pdfParser';
import { SAMPLE_RESUMES } from '../services/sampleData';

export default function ResumeInput({ resumeText, onChangeResumeText }) {
  const [isParsing, setIsParsing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setUploadError('Please upload a PDF document (.pdf)');
      return;
    }

    setUploadError('');
    setIsParsing(true);
    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const extractedText = await extractTextFromPDF(arrayBuffer);
      onChangeResumeText(extractedText);
    } catch (err) {
      setUploadError(err.message || 'Failed to extract PDF text');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSample = (sample) => {
    setFileName(`${sample.title}.txt`);
    onChangeResumeText(sample.text);
    setUploadError('');
  };

  const wordCount = resumeText ? resumeText.trim().split(/\s+/).length : 0;

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-4 border border-slate-800">
      
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Candidate Resume</h2>
            <p className="text-xs text-slate-400">Upload PDF or paste plain text</p>
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[11px] text-slate-400 hidden sm:inline">Samples:</span>
          {SAMPLE_RESUMES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleLoadSample(sample)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-indigo-300 border border-slate-700 transition-colors"
              title={`Load ${sample.title}`}
            >
              {sample.id === 'fullstack-dev' ? 'Full Stack' : 'AI Engineer'}
            </button>
          ))}
        </div>
      </div>

      {/* PDF Dropzone */}
      <div
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-900/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files[0])}
        />
        
        <div className="flex flex-col items-center justify-center space-y-2">
          {isParsing ? (
            <div className="flex items-center space-x-2 text-indigo-400">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="text-xs font-semibold">Extracting text from PDF...</span>
            </div>
          ) : (
            <>
              <div className="p-2.5 rounded-full bg-slate-800/80 text-slate-400">
                <Upload className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-indigo-400 hover:underline">Click to upload PDF</span>
                <span className="text-slate-400"> or drag and drop</span>
              </div>
              {fileName && (
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-medium border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3" />
                  <span>{fileName}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {uploadError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Textarea Area */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <label htmlFor="resume-textarea" className="font-medium">Resume Text Content</label>
          <span>{wordCount} words | {resumeText.length} chars</span>
        </div>
        <textarea
          id="resume-textarea"
          value={resumeText}
          onChange={(e) => onChangeResumeText(e.target.value)}
          rows={10}
          placeholder="Paste resume text or upload PDF above..."
          className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs font-mono leading-relaxed resize-y"
        />
      </div>

    </div>
  );
}
