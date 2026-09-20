import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ApiKeyModal from './components/ApiKeyModal';
import HistoryModal from './components/HistoryModal';
import ResumeInput from './components/ResumeInput';
import JobDescriptionInput from './components/JobDescriptionInput';
import MatchScoreCard from './components/MatchScoreCard';
import SkillMatrix from './components/SkillMatrix';
import ATSFeedback from './components/ATSFeedback';
import BulletRewriter from './components/BulletRewriter';
import InterviewPrep from './components/InterviewPrep';
import CoverLetterModal from './components/CoverLetterModal';

import { analyzeResumeWithBackend } from './services/api';
import { analyzeResumeOffline } from './services/nlpEngine';
import { analyzeWithGemini, getStoredApiKey } from './services/geminiService';
import { SAMPLE_RESUMES, SAMPLE_JOB_DESCRIPTIONS } from './services/sampleData';
import { Sparkles, RefreshCw, BarChart3, Layers, FileSearch, Wand2, MessageSquare, FileText, ArrowRight, AlertTriangle, Server, CheckCircle2 } from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel p-6 rounded-2xl border border-rose-500/30 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
            <h2 className="text-lg font-bold text-rose-300">Something went wrong</h2>
            <p className="text-xs text-slate-400">{this.state.error?.toString()}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-xl text-white transition-colors"
            >
              Reload Copilot App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  // Dynamic User Inputs (Clean initial state for real uploads/pastes)
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Dynamic Analysis Result
  const [analysis, setAnalysis] = useState(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Modals & Key state
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState(() => !!getStoredApiKey());

  const handleRunAnalysis = useCallback(async () => {
    if (!resumeText.trim() || !jdText.trim()) return;

    setIsAnalyzing(true);

    try {
      const apiKey = getStoredApiKey();
      if (apiKey) {
        try {
          const aiResult = await analyzeWithGemini(resumeText, jdText, apiKey);
          const backendResult = await analyzeResumeWithBackend(resumeText, jdText);
          setAnalysis({
            ...backendResult,
            overallScore: aiResult.matchPercent || backendResult.overallScore,
            grade: aiResult.atsGrade || backendResult.grade,
            interviewQuestions: aiResult.interviewQuestions || backendResult.interviewQuestions
          });
          setIsAnalyzing(false);
          return;
        } catch (geminiErr) {
          console.warn('Gemini API fallback to Python backend:', geminiErr);
        }
      }

      // Python FastAPI Backend ML Analysis
      const backendResult = await analyzeResumeWithBackend(resumeText, jdText);
      setAnalysis(backendResult);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [resumeText, jdText]);

  const handleLoadSampleDemo = () => {
    setResumeText(SAMPLE_RESUMES[0].text);
    setJdText(SAMPLE_JOB_DESCRIPTIONS[0].text);
    setJobTitle(SAMPLE_JOB_DESCRIPTIONS[0].title);
    setCompanyName(SAMPLE_JOB_DESCRIPTIONS[0].company);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* Header */}
      <Header
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        isApiKeyConfigured={isApiKeyConfigured}
        onLoadSample={handleLoadSampleDemo}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Hero Section Banner */}
        <div className="text-center space-y-2.5 max-w-3xl mx-auto py-1 sm:py-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] sm:text-xs font-semibold max-w-full">
            <Server className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Python FastAPI ML Backend Active (http://localhost:8000)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Transform Your Resume into a <span className="gradient-text">Job Offer Magnet</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed px-2">
            Upload your resume PDF & job description to run real-time skill matching, pass ATS screening filters, rewrite STAR bullet points, and practice tailored interview questions.
          </p>
        </div>

        {/* Dual Input Workspace: Resume + Job Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          <ResumeInput
            resumeText={resumeText}
            onChangeResumeText={setResumeText}
          />

          <JobDescriptionInput
            jdText={jdText}
            onChangeJdText={setJdText}
            jobTitle={jobTitle}
            onChangeJobTitle={setJobTitle}
            companyName={companyName}
            onChangeCompanyName={setCompanyName}
          />
        </div>

        {/* Analyze Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">Ready for Python ML Analysis</h3>
                {analysis?.source === 'python_fastapi' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>FastAPI</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">TF-IDF Vectorizer + Cosine Similarity + Skill Extraction</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              onClick={() => setIsCoverLetterOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all flex items-center space-x-1.5 shrink-0"
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Cover Letter</span>
            </button>

            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || !resumeText.trim() || !jdText.trim()}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze Fit (FastAPI)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dashboard Results Section */}
        {analysis && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-300">
            
            {/* Dashboard Tabs Bar */}
            <div className="flex border-b border-slate-800 overflow-x-auto pb-1 space-x-2 scrollbar-none">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 shrink-0 ${
                  activeTab === 'overview'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Overview & Scores</span>
              </button>

              <button
                onClick={() => setActiveTab('skills')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 shrink-0 ${
                  activeTab === 'skills'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Skill Matrix ({analysis.missingSkills?.length || 0} missing)</span>
              </button>

              <button
                onClick={() => setActiveTab('ats')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 shrink-0 ${
                  activeTab === 'ats'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileSearch className="w-3.5 h-3.5" />
                <span>ATS Content Audit</span>
              </button>

              <button
                onClick={() => setActiveTab('bullet')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 shrink-0 ${
                  activeTab === 'bullet'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>STAR Rewriter & RAG</span>
              </button>

              <button
                onClick={() => setActiveTab('interview')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 shrink-0 ${
                  activeTab === 'interview'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Interview Q&A ({analysis.interviewQuestions?.length || 0})</span>
              </button>
            </div>

            {/* Tab Views */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <MatchScoreCard analysis={analysis} />
                <SkillMatrix matchedSkills={analysis.matchedSkills} missingSkills={analysis.missingSkills} />
                <ATSFeedback atsMetrics={analysis.atsMetrics} recommendations={analysis.recommendations} />
              </div>
            )}

            {activeTab === 'skills' && (
              <SkillMatrix matchedSkills={analysis.matchedSkills} missingSkills={analysis.missingSkills} />
            )}

            {activeTab === 'ats' && (
              <ATSFeedback atsMetrics={analysis.atsMetrics} recommendations={analysis.recommendations} />
            )}

            {activeTab === 'bullet' && (
              <BulletRewriter jobTitle={jobTitle} missingSkills={analysis.missingSkills} />
            )}

            {activeTab === 'interview' && (
              <InterviewPrep questions={analysis.interviewQuestions} />
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500 px-4">
        <p>AI Career Copilot • Python FastAPI, Scikit-Learn, Vector Embeddings & RAG • Built for Portfolio Excellence</p>
      </footer>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaveKey={(configured) => setIsApiKeyConfigured(configured)}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />

      <CoverLetterModal
        isOpen={isCoverLetterOpen}
        onClose={() => setIsCoverLetterOpen(false)}
        resumeText={resumeText}
        jdText={jdText}
        jobTitle={jobTitle}
        companyName={companyName}
      />

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
