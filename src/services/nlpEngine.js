// Skill Taxonomy with Categories
export const SKILL_TAXONOMY = {
  'Frontend': [
    'react', 'next.js', 'typescript', 'javascript', 'html', 'html5', 'css', 'css3', 
    'tailwind css', 'tailwind', 'sass', 'redux', 'zustand', 'rxjs', 'webpack', 'vite', 
    'web components', 'graphql', 'rest api', 'vue', 'angular', 'svelte', 'canvas', 
    'three.js', 'd3.js', 'recharts', 'responsive design', 'web accessibility', 'a11y'
  ],
  'Backend': [
    'node.js', 'node', 'express', 'express.js', 'python', 'django', 'fastapi', 'flask', 
    'java', 'spring boot', 'spring', 'c#', '.net', 'asp.net', 'go', 'golang', 'rust', 
    'ruby', 'ruby on rails', 'php', 'laravel', 'microservices', 'restful apis', 'gRPC'
  ],
  'Databases & Storage': [
    'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'sqlite', 'dynamodb', 
    'cassandra', 'elasticsearch', 'firebase', 'supabase', 'sql', 'nosql', 'orm', 'prisma'
  ],
  'AI / Machine Learning': [
    'pytorch', 'tensorflow', 'scikit-learn', 'opencv', 'hugging face', 'langchain', 
    'llamaindex', 'rag', 'llm', 'large language models', 'fine-tuning', 'prompt engineering', 
    'pandas', 'numpy', 'apache spark', 'spark', 'vector databases', 'pinecone', 'chromadb', 
    'nlp', 'natural language processing', 'deep learning', 'machine learning', 'data science'
  ],
  'DevOps & Cloud': [
    'aws', 'amazon web services', 'gcp', 'google cloud', 'azure', 'docker', 'kubernetes', 
    'k8s', 'terraform', 'ci/cd', 'github actions', 'jenkins', 'nginx', 'serverless', 
    'lambda', 'linux', 'bash', 'shell script', 'cloudformation', 'cloud-native'
  ],
  'Testing & Quality': [
    'jest', 'cypress', 'playwright', 'selenium', 'junit', 'vitest', 'unit testing', 
    'integration testing', 'e2e testing', 'tdd', 'test-driven development'
  ],
  'Methodologies & Soft Skills': [
    'agile', 'scrum', 'kanban', 'project management', 'mentorship', 'team leadership', 
    'system design', 'code reviews', 'problem solving', 'cross-functional', 'communication', 
    'technical writing', 'product management'
  ]
};

export const ACTION_VERBS = [
  'spearheaded', 'architected', 'engineered', 'developed', 'optimized', 'reduced', 
  'increased', 'boosted', 'automated', 'streamlined', 'designed', 'built', 'implemented', 
  'mentored', 'led', 'scaled', 'delivered', 'orchestrated', 'cut', 'launched', 'improved'
];

/**
 * Clean and normalize text string
 */
function normalizeText(text) {
  return text.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ');
}

/**
 * Extract matched & missing skills from text based on Taxonomy
 */
export function extractSkills(resumeText, jdText) {
  const normResume = normalizeText(resumeText);
  const normJD = normalizeText(jdText);

  const matchedSkills = [];
  const missingSkills = [];

  Object.entries(SKILL_TAXONOMY).forEach(([category, skills]) => {
    skills.forEach(skill => {
      // Regex check to avoid partial word collisions (e.g. 'go' in 'good')
      const regex = new RegExp(`(?:^|[^a-z0-9+#.-])${skill.replace('.', '\\.')}(?:$|[^a-z0-9+#.-])`, 'i');
      
      const inJD = regex.test(normJD);
      const inResume = regex.test(normResume);

      if (inJD && inResume) {
        matchedSkills.push({ name: skill, category, status: 'matched' });
      } else if (inJD && !inResume) {
        // Determine importance
        const occurrences = (normJD.match(new RegExp(skill, 'gi')) || []).length;
        const priority = occurrences > 1 ? 'Critical' : 'Good to Have';
        missingSkills.push({ name: skill, category, priority, status: 'missing' });
      }
    });
  });

  return { matchedSkills, missingSkills };
}

/**
 * Audit ATS formatting, Action Verbs, and Quantifiable Metrics
 */
export function auditATSMetrics(resumeText, jdText) {
  const normResume = normalizeText(resumeText);
  
  // 1. Action Verbs Audit
  const foundVerbs = ACTION_VERBS.filter(verb => normResume.includes(verb));
  const actionVerbScore = Math.min(100, Math.round((foundVerbs.length / 5) * 100));

  // 2. Metrics & Numbers Check (% or $ or numbers or multipliers)
  const metricMatches = resumeText.match(/(\d+%\s*|\$\d+|\b\d+x\b|\b\d{2,}\b|\b(million|k|M)\b)/gi) || [];
  const metricScore = Math.min(100, Math.round((metricMatches.length / 4) * 100));

  // 3. Section Headers Check
  const expectedSections = ['summary', 'experience', 'skills', 'education', 'projects'];
  const foundSections = expectedSections.filter(sec => normResume.includes(sec));
  const sectionScore = Math.round((foundSections.length / expectedSections.length) * 100);

  return {
    actionVerbScore,
    foundVerbs,
    metricScore,
    metricCount: metricMatches.length,
    sectionScore,
    foundSections,
    missingSections: expectedSections.filter(sec => !normResume.includes(sec))
  };
}

/**
 * Analyze Resume against Job Description
 */
export function analyzeResumeOffline(resumeText, jdText) {
  if (!resumeText || !jdText) {
    throw new Error('Both Resume and Job Description are required for analysis.');
  }

  const { matchedSkills, missingSkills } = extractSkills(resumeText, jdText);
  const atsMetrics = auditATSMetrics(resumeText, jdText);

  // Calculate Match Scores
  const totalJDSkills = matchedSkills.length + missingSkills.length;
  const skillMatchPercent = totalJDSkills > 0 
    ? Math.round((matchedSkills.length / totalJDSkills) * 100)
    : 70;

  const overallScore = Math.round(
    (skillMatchPercent * 0.45) +
    (atsMetrics.actionVerbScore * 0.20) +
    (atsMetrics.metricScore * 0.20) +
    (atsMetrics.sectionScore * 0.15)
  );

  // Generate ATS Grade
  let grade = 'B';
  if (overallScore >= 90) grade = 'A+';
  else if (overallScore >= 80) grade = 'A';
  else if (overallScore >= 70) grade = 'B+';
  else if (overallScore >= 60) grade = 'B';
  else if (overallScore >= 50) grade = 'C';
  else grade = 'D';

  // Improvement Recommendations
  const recommendations = [];

  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 5).map(s => s.name).join(', ');
    recommendations.push({
      type: 'skill_gap',
      title: 'Add Missing High-Priority Keywords',
      description: `Target JD requires: [${topMissing}]. Consider incorporating these terms into your Skills or Experience bullet points.`
    });
  }

  if (atsMetrics.metricScore < 60) {
    recommendations.push({
      type: 'metrics',
      title: 'Incorporate Quantifiable Achievements',
      description: 'Your bullet points lack quantifiable numbers or metrics. Use percentages (%), latency reductions (ms), or user growth numbers.'
    });
  }

  if (atsMetrics.actionVerbScore < 70) {
    recommendations.push({
      type: 'verbs',
      title: 'Strengthen Bullet Point Action Verbs',
      description: 'Start bullet points with strong action verbs like "Architected", "Spearheaded", "Optimized" rather than "Responsible for".'
    });
  }

  if (atsMetrics.missingSections.length > 0) {
    recommendations.push({
      type: 'section',
      title: 'Include Standard ATS Sections',
      description: `Missing standard headers: ${atsMetrics.missingSections.join(', ')}. Standard headers ensure smooth ATS parsing.`
    });
  }

  // Pre-generate targeted interview questions offline
  const interviewQuestions = generateOfflineInterviewQuestions(matchedSkills, missingSkills);

  return {
    overallScore,
    grade,
    skillMatchPercent,
    matchedSkills,
    missingSkills,
    atsMetrics,
    recommendations,
    interviewQuestions
  };
}

/**
 * Generate targeted interview questions offline
 */
function generateOfflineInterviewQuestions(matchedSkills, missingSkills) {
  const topMatched = matchedSkills.slice(0, 3).map(s => s.name);
  const topMissing = missingSkills.slice(0, 2).map(s => s.name);

  const questions = [
    {
      id: 'q1',
      category: 'Technical Core',
      type: 'System & Architecture',
      question: `Can you describe a challenging project where you leveraged ${topMatched[0] || 'your core stack'} to solve a performance bottleneck?`,
      hint: `Discuss the initial metric, your technical architecture decisions using ${topMatched[0] || 'modern patterns'}, and the final measurable improvement.`
    },
    {
      id: 'q2',
      category: 'Technical Deep-Dive',
      type: 'Problem Solving',
      question: `How do you handle state management, async data flow, and error handling when working with ${topMatched[1] || 'complex web applications'}?`,
      hint: 'Mention explicit patterns like caching, optimistic updates, centralized store practices, and graceful error boundary fallbacks.'
    }
  ];

  if (topMissing.length > 0) {
    questions.push({
      id: 'q3',
      category: 'Gap Mitigation',
      type: 'Adaptability & Growth',
      question: `The target role emphasizes ${topMissing[0]}. Have you had experience learning similar frameworks, or how would you quickly get up to speed?`,
      hint: `Highlight your quick learning velocity by sharing a story of mastering a similar technology within days.`
    });
  }

  questions.push({
    id: 'q4',
    category: 'Behavioral & Leadership',
    type: 'STAR Method',
    question: 'Tell me about a time when you had to make a technical trade-off under a tight deadline. How did you align the team?',
    hint: 'Use the STAR method: Situation, Task, Action, Result. Focus on clear communication and data-backed trade-offs.'
  });

  return questions;
}
