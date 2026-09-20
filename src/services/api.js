import { analyzeResumeOffline } from './nlpEngine';

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Sends resume & JD to Python FastAPI ML backend for full analysis.
 * Automatically falls back to offline engine if server is unreachable.
 */
export async function analyzeResumeWithBackend(resumeText, jdText) {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resume_text: resumeText,
        job_description: jdText,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Map backend response fields
    return {
      overallScore: Math.round(data.match_score),
      tfidfScore: Math.round(data.tfidf_score || data.match_score),
      semanticScore: Math.round(data.semantic_score || data.match_score),
      grade: data.ats_grade,
      skillMatchPercent: Math.round(data.skill_match_percent),
      matchedSkills: data.matched_skills || [],
      missingSkills: data.missing_skills || [],
      matchedTerms: data.matched_terms || [],
      missingTerms: data.missing_terms || [],
      atsMetrics: {
        actionVerbScore: data.ats_metrics.action_verb_score,
        metricScore: data.ats_metrics.metric_score,
        sectionScore: data.ats_metrics.section_score,
        foundVerbs: data.ats_metrics.found_verbs,
        metricCount: data.ats_metrics.metric_count,
        foundSections: data.ats_metrics.found_sections,
        missingSections: data.ats_metrics.missing_sections,
      },
      recommendations: data.recommendations || [],
      interviewQuestions: data.interview_questions || [],
      source: 'python_fastapi'
    };
  } catch (error) {
    console.warn('Backend API connection failed, falling back to local JS engine:', error.message);
    const offlineData = analyzeResumeOffline(resumeText, jdText);
    return {
      ...offlineData,
      tfidfScore: offlineData.overallScore,
      semanticScore: offlineData.overallScore,
      source: 'offline_js'
    };
  }
}

/**
 * RAG Vector Database Query: Fetch contextually retrieved STAR templates based on missing skills.
 */
export async function fetchRAGTemplates(missingSkills = []) {
  try {
    const response = await fetch(`${API_BASE_URL}/rag/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missing_skills: missingSkills })
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.retrieved_templates || [];
  } catch (err) {
    console.warn('RAG vector retrieval warning:', err);
    return [];
  }
}

/**
 * Fetch candidate analysis history from SQLAlchemy database.
 */
export async function fetchAnalysisHistory() {
  try {
    const response = await fetch(`${API_BASE_URL}/history`);
    if (!response.ok) return [];
    return await response.json();
  } catch (err) {
    console.warn('History fetch warning:', err);
    return [];
  }
}
