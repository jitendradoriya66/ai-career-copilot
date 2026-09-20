import re
from typing import List, Dict, Tuple

SKILL_TAXONOMY: Dict[str, List[str]] = {
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
}

def extract_skills_from_text(resume_text: str, jd_text: str) -> Tuple[List[Dict], List[Dict]]:
    """
    Extracts categorized skills from Resume and JD text, returning matched vs missing lists.
    """
    norm_resume = resume_text.lower()
    norm_jd = jd_text.lower()

    matched_skills = []
    missing_skills = []

    for category, skills in SKILL_TAXONOMY.items():
        for skill in skills:
            # Escape skill for regex boundary checking
            escaped_skill = re.escape(skill)
            pattern = re.compile(rf'(?:^|[^a-z0-9+#.-]){escaped_skill}(?:$|[^a-z0-9+#.-])', re.IGNORECASE)
            
            in_jd = bool(pattern.search(norm_jd))
            in_resume = bool(pattern.search(norm_resume))

            if in_jd and in_resume:
                matched_skills.append({
                    "name": skill,
                    "category": category,
                    "status": "matched"
                })
            elif in_jd and not in_resume:
                occurrences = len(pattern.findall(norm_jd))
                priority = "Critical" if occurrences > 1 else "Good to Have"
                missing_skills.append({
                    "name": skill,
                    "category": category,
                    "priority": priority,
                    "status": "missing"
                })

    return matched_skills, missing_skills
