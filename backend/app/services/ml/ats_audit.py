import re
from typing import Dict, List

ACTION_VERBS = [
    'spearheaded', 'architected', 'engineered', 'developed', 'optimized', 'reduced', 
    'increased', 'boosted', 'automated', 'streamlined', 'designed', 'built', 'implemented', 
    'mentored', 'led', 'scaled', 'delivered', 'orchestrated', 'cut', 'launched', 'improved'
]

EXPECTED_SECTIONS = ['summary', 'experience', 'skills', 'education', 'projects']

def audit_ats_content(resume_text: str, jd_text: str) -> Dict:
    """
    Audits resume for action verbs, quantifiable metrics, and standard ATS headers.
    """
    norm_resume = resume_text.lower()

    # 1. Action Verbs Check
    found_verbs = [verb for verb in ACTION_VERBS if verb in norm_resume]
    action_verb_score = min(100, int((len(found_verbs) / 5) * 100))

    # 2. Quantifiable Impact & Metrics Check
    metric_matches = re.findall(r'(\d+%\s*|\$\d+|\b\d+x\b|\b\d{2,}\b|\b(million|k|M)\b)', resume_text, re.IGNORECASE)
    metric_count = len(metric_matches)
    metric_score = min(100, int((metric_count / 4) * 100))

    # 3. Standard ATS Section Headers Check
    found_sections = [sec for sec in EXPECTED_SECTIONS if sec in norm_resume]
    missing_sections = [sec for sec in EXPECTED_SECTIONS if sec not in norm_resume]
    section_score = int((len(found_sections) / len(EXPECTED_SECTIONS)) * 100)

    # 4. Generate Actionable Recommendations
    recommendations = []
    if metric_score < 60:
        recommendations.append({
            "type": "metrics",
            "title": "Incorporate Quantifiable Achievements",
            "description": "Your bullet points lack numbers or metrics. Use percentages (%), latency reductions, or dollar amounts."
        })
    if action_verb_score < 70:
        recommendations.append({
            "type": "verbs",
            "title": "Strengthen Action Verbs",
            "description": "Start bullet points with strong action verbs like 'Architected', 'Spearheaded', 'Optimized'."
        })
    if missing_sections:
        recommendations.append({
            "type": "section",
            "title": "Include Standard ATS Headers",
            "description": f"Missing standard sections: {', '.join(missing_sections)}. Standard headers ensure smooth ATS parsing."
        })

    return {
        "ats_metrics": {
            "action_verb_score": action_verb_score,
            "metric_score": metric_score,
            "section_score": section_score,
            "found_verbs": found_verbs,
            "metric_count": metric_count,
            "found_sections": found_sections,
            "missing_sections": missing_sections
        },
        "recommendations": recommendations
    }

def generate_interview_questions(matched_skills: List[Dict], missing_skills: List[Dict]) -> List[Dict]:
    """
    Generates targeted interview questions based on candidate skill match & gaps.
    """
    top_matched = [s["name"] for s in matched_skills[:2]]
    top_missing = [s["name"] for s in missing_skills[:2]]

    questions = [
        {
            "id": "q1",
            "category": "Technical Core",
            "type": "System & Architecture",
            "question": f"Can you describe a project where you leveraged {top_matched[0] if top_matched else 'your core tech stack'} to solve a major performance bottleneck?",
            "hint": f"Discuss initial metric, technical choices using {top_matched[0] if top_matched else 'modern patterns'}, and measurable improvement."
        },
        {
            "id": "q2",
            "category": "Technical Deep-Dive",
            "type": "Problem Solving",
            "question": f"How do you handle state management, async data flow, and error handling when building scalable applications?",
            "hint": "Mention caching, optimistic updates, centralized store practices, and graceful error boundary fallbacks."
        }
    ]

    if top_missing:
        questions.append({
            "id": "q3",
            "category": "Gap Mitigation",
            "type": "Adaptability & Growth",
            "question": f"The target role emphasizes {top_missing[0]}. Have you worked with similar frameworks, or how would you quickly adapt?",
            "hint": "Highlight your fast learning velocity by sharing a story of mastering a similar technology within days."
        })

    questions.append({
        "id": "q4",
        "category": "Behavioral & Leadership",
        "type": "STAR Method",
        "question": "Tell me about a time when you had to make a technical trade-off under a tight deadline. How did you align the team?",
        "hint": "Use the STAR method: Situation, Task, Action, Result. Focus on clear communication and data-backed trade-offs."
    })

    return questions
