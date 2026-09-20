import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Get API Key from localStorage or environment
 */
export function getStoredApiKey() {
  return localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
}

/**
 * Save API key to localStorage
 */
export function setStoredApiKey(key) {
  if (key) {
    localStorage.setItem('gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('gemini_api_key');
  }
}

/**
 * Initialize Google Generative AI Client
 */
function getAIClient(customApiKey) {
  const key = customApiKey || getStoredApiKey();
  if (!key) {
    throw new Error('No Gemini API Key provided. Please enter an API key in settings or use the offline mode.');
  }
  return new GoogleGenerativeAI(key);
}

/**
 * Analyze Resume with Gemini AI
 */
export async function analyzeWithGemini(resumeText, jdText, apiKey = null) {
  const genAI = getAIClient(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are an expert Executive Career Coach and Senior Talent Acquisition Specialist.
Analyze the following candidate RESUME against the target JOB DESCRIPTION.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}

Return a strictly formatted JSON object matching this schema (do NOT include markdown code blocks or backticks, just raw JSON):
{
  "summary": "2-3 sentence executive summary of the match fit",
  "matchPercent": 85,
  "atsGrade": "A",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "criticalMissingSkills": ["Missing Skill 1", "Missing Skill 2"],
  "atsImprovements": [
    { "area": "Formatting", "suggestion": "Detail suggestion" },
    { "area": "Keywords", "suggestion": "Detail suggestion" }
  ],
  "bulletRewrites": [
    {
      "original": "Worked on React dashboard",
      "rewritten": "Architected responsive React 18 dashboard, cutting load times by 40% for 100k users",
      "reason": "Added STAR context, quantifiable metric, and strong action verb"
    }
  ],
  "interviewQuestions": [
    {
      "category": "Technical",
      "type": "System Design",
      "question": "Question text here",
      "modelAnswer": "Comprehensive model answer strategy"
    }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean potential markdown code fences
    const jsonText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Gemini Analysis Failed: ${error.message}`);
  }
}

/**
 * Generate Customized Cover Letter using Gemini
 */
export async function generateCoverLetter(resumeText, jdText, targetRole = 'Software Engineer', apiKey = null) {
  const genAI = getAIClient(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are a professional Executive Resume Writer.
Write a compelling, tailored, high-converting Cover Letter for the candidate based on their RESUME and the target JOB DESCRIPTION.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}

Rules:
- Keep it concise (3-4 impactful paragraphs).
- Highlight 2 key matching achievements with metrics.
- Sound enthusiastic, professional, and confident.
- Do NOT include generic filler.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * AI STAR Bullet Point Rewriter
 */
export async function rewriteBulletPoint(originalBullet, targetRole = '', apiKey = null) {
  const genAI = getAIClient(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
Transform this resume bullet point into 3 distinct high-impact STAR (Situation, Task, Action, Result) versions with quantifiable metrics and strong action verbs:

Original Bullet: "${originalBullet}"
Target Role Context: ${targetRole || 'Software Engineering'}

Return a JSON array of 3 options (raw JSON only):
[
  { "option": 1, "text": "Enhanced version 1...", "impact": "Focuses on speed & metric" },
  { "option": 2, "text": "Enhanced version 2...", "impact": "Focuses on leadership & scale" },
  { "option": 3, "text": "Enhanced version 3...", "impact": "Focuses on technical architecture" }
]
`;

  const result = await model.generateContent(prompt);
  const jsonText = result.response.text().replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(jsonText);
}
