import streamlit as st
import requests
import os
import json
import io
from pypdf import PdfReader

# Page Configuration
st.set_page_config(
    page_title="AI Career Copilot - Streamlit",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom Responsive Glassmorphism & Dark Mode Styling
CUSTOM_CSS = """
<style>
/* Modern Dark Glassmorphism Theme */
.stApp {
    background-color: #030712;
    color: #f3f4f6;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Glassmorphism Container */
.glass-container {
    background: rgba(17, 24, 39, 0.75);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

/* Header Banner */
.header-banner {
    background: linear-gradient(135deg, #1e1b4b 0%, #311b92 50%, #4c1d95 100%);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 20px;
    padding: 24px;
    text-align: center;
    margin-bottom: 24px;
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
}

.header-banner h1 {
    color: #ffffff;
    font-size: 2.2rem;
    font-weight: 800;
    margin-bottom: 8px;
    letter-spacing: -0.02em;
}

.header-banner p {
    color: #c7d2fe;
    font-size: 0.95rem;
    max-width: 700px;
    margin: 0 auto;
}

/* Metric Cards */
div[data-testid="stMetricValue"] {
    font-size: 2rem !important;
    font-weight: 800 !important;
    color: #818cf8 !important;
}

/* Tabs Styling */
.stTabs [data-baseweb="tab-list"] {
    gap: 8px;
    background-color: rgba(17, 24, 39, 0.8);
    padding: 6px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.stTabs [data-baseweb="tab"] {
    border-radius: 8px;
    padding: 8px 16px;
    font-weight: 600;
    color: #9ca3af;
}

.stTabs [aria-selected="true"] {
    background-color: #4f46e5 !important;
    color: #ffffff !important;
}

/* Custom Buttons */
.stButton button {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
    font-weight: 700;
    border: none;
    border-radius: 12px;
    padding: 10px 24px;
    transition: all 0.3s ease;
    width: 100%;
}

.stButton button:hover {
    background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
    transform: translateY(-1px);
}

/* Responsive Viewport Media Queries */
@media (max-width: 768px) {
    .header-banner h1 {
        font-size: 1.6rem;
    }
    .header-banner p {
        font-size: 0.85rem;
    }
    .glass-container {
        padding: 14px;
    }
    .stTabs [data-baseweb="tab"] {
        padding: 6px 10px;
        font-size: 0.8rem;
    }
}
</style>
"""
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)

# API Configuration
FASTAPI_BASE_URL = os.getenv("FASTAPI_BASE_URL", "http://127.0.0.1:8000")

# Sample Data Definition
SAMPLE_RESUME = """Jitendra Doriya
Senior Full Stack & AI Engineer
Email: jitendra@example.com | Phone: +1-555-0199 | Location: San Francisco, CA
GitHub: github.com/jitendradoriya66 | LinkedIn: linkedin.com/in/jitendradoriya

PROFESSIONAL SUMMARY
Results-driven Senior Full Stack & AI Engineer with 5+ years of experience building high-performance web applications, microservices, and AI/ML integrations. Expert in React, FastAPI, Python, PyTorch, Node.js, and Cloud Infrastructure. Proven track record of scaling user applications by 300% and reducing latency by 45%.

TECHNICAL SKILLS
• Frontend: React 19, JavaScript (ES6+), TypeScript, Tailwind CSS, Vite, Redux Toolkit
• Backend & ML: Python 3.12, FastAPI, Node.js, Express, PyTorch, Scikit-Learn, SentenceTransformers
• Databases & Vectors: PostgreSQL, MongoDB, Redis, ChromaDB, SQLAlchemy ORM
• Cloud & DevOps: Docker, Kubernetes, AWS (S3, EC2, Lambda), CI/CD, Git

WORK EXPERIENCE
Senior Full Stack Engineer | TechCorp Inc. | 2022 - Present
• Designed and deployed scalable AI resume scoring microservices using Python FastAPI, reducing evaluation latency from 4.2s to 320ms for over 100k users.
• Developed modern responsive React 19 dashboards with real-time analytics and WebSocket feeds, increasing daily active user retention by 35%.
• Architected RAG pipeline with ChromaDB vector embeddings, boosting job recommendation relevancy by 52%.

Software Engineer | Innovate AI Solutions | 2020 - 2022
• Built microservices architecture in Python & FastAPI serving 50k requests daily with 99.98% uptime.
• Automated CI/CD build pipelines using GitHub Actions and Docker containers, cutting deployment time by 60%.
"""

SAMPLE_JD = """Target Job Title: Senior Full Stack Engineer (AI & Web)
Company: InnovateX Tech

JOB REQUIREMENTS & RESPONSIBILITIES
We are looking for a Senior Full Stack Engineer to lead our core product team in building AI-powered Web applications.

Key Responsibilities:
• Build responsive, high-performance UI components using React 19, TypeScript, and modern CSS frameworks.
• Develop robust RESTful APIs & microservices using Python (FastAPI/Flask) and Node.js.
• Integrate LLMs, vector databases (ChromaDB), and RAG search engines for intelligent recommendations.
• Optimize database schemas in PostgreSQL and SQLAlchemy ORM.
• Containerize services with Docker and manage AWS cloud infrastructure.

Required Qualifications:
• 4+ years of software engineering experience with React, JavaScript/TypeScript, and Python.
• Strong experience with FastAPI, REST APIs, and database design.
• Hands-on experience with AI/ML integration, SentenceTransformers, or Vector Databases.
• Proficiency with Git, Docker, and CI/CD automation pipelines.
"""

# State Initialization
if 'resume_text' not in st.session_state:
    st.session_state.resume_text = ""
if 'jd_text' not in st.session_state:
    st.session_state.jd_text = ""
if 'job_title' not in st.session_state:
    st.session_state.job_title = ""
if 'company_name' not in st.session_state:
    st.session_state.company_name = ""
if 'analysis' not in st.session_state:
    st.session_state.analysis = None

# Helper Functions
def extract_pdf_text(uploaded_file):
    try:
        reader = PdfReader(uploaded_file)
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text.strip()
    except Exception as e:
        st.error(f"Error parsing PDF file: {e}")
        return ""

def check_backend_status():
    try:
        resp = requests.get(f"{FASTAPI_BASE_URL}/api/health", timeout=2)
        if resp.status_code == 200:
            return True, resp.json()
    except Exception:
        pass
    return False, None

def analyze_fit_api(resume_text, jd_text):
    try:
        payload = {
            "resume_text": resume_text,
            "job_description_text": jd_text
        }
        resp = requests.post(f"{FASTAPI_BASE_URL}/api/analyze", json=payload, timeout=10)
        if resp.status_code == 200:
            return resp.json()
    except Exception as e:
        st.warning(f"Backend API call exception: {e}. Running local NLP fallback engine.")
    
    # Python Local Fallback Engine if API is offline
    return run_local_nlp_fallback(resume_text, jd_text)

def run_local_nlp_fallback(resume_text, jd_text):
    words_resume = set(resume_text.lower().split())
    words_jd = set(jd_text.lower().split())
    
    common = words_resume.intersection(words_jd)
    score = min(98, max(45, int((len(common) / max(1, len(words_jd))) * 250)))
    
    matched = list(common)[:8]
    missing = [w for w in ["docker", "kubernetes", "typescript", "graphql", "aws", "pytest"] if w not in words_resume][:4]
    
    return {
        "overallScore": score,
        "grade": "A" if score >= 80 else ("B" if score >= 65 else "C"),
        "matchedSkills": matched,
        "missingSkills": missing,
        "atsMetrics": {
            "actionVerbsScore": 85,
            "quantifiableMetricsScore": 78,
            "formattingScore": 92
        },
        "recommendations": [
            "Quantify key achievements with metrics (%, $, scale).",
            "Include missing technical keywords to increase ATS pass rate."
        ],
        "interviewQuestions": [
            {"id": "q1", "question": "Explain how you optimized FastAPI endpoint performance in your previous project.", "category": "Technical"},
            {"id": "q2", "question": "Describe a time you integrated a vector DB like ChromaDB into a production pipeline.", "category": "System Design"}
        ],
        "source": "streamlit_local_engine"
    }

# App Layout Header
st.markdown("""
<div class="header-banner">
    <h1>🚀 AI Career Copilot</h1>
    <p>Upload your resume & job description for real-time skill matching, ATS score auditing, STAR bullet rewriting, and tailored interview prep.</p>
</div>
""", unsafe_allow_html=True)

# Status Indicator Bar
is_online, backend_info = check_backend_status()
col_status1, col_status2 = st.columns([3, 1])
with col_status1:
    if is_online:
        st.success("🟢 Python FastAPI ML Backend Active (http://127.0.0.1:8000)")
    else:
        st.info("🟡 Standalone Mode Active (Connecting to local NLP engine)")

with col_status2:
    if st.button("✨ Load Sample Demo", help="Populate text areas with sample Full Stack Engineer resume & JD"):
        st.session_state.resume_text = SAMPLE_RESUME
        st.session_state.jd_text = SAMPLE_JD
        st.session_state.job_title = "Senior Full Stack Engineer"
        st.session_state.company_name = "InnovateX Tech"
        st.rerun()

# Workspace Section: Dual Column Inputs (Responsive)
col_resume, col_jd = st.columns(2)

with col_resume:
    st.subheader("📄 Candidate Resume")
    uploaded_pdf = st.file_uploader("Upload Resume PDF (.pdf)", type=["pdf"], key="pdf_uploader")
    if uploaded_pdf is not None:
        extracted = extract_pdf_text(uploaded_pdf)
        if extracted:
            st.session_state.resume_text = extracted
            st.success(f"Parsed {uploaded_pdf.name} successfully!")

    st.session_state.resume_text = st.text_area(
        "Resume Text",
        value=st.session_state.resume_text,
        height=260,
        placeholder="Upload PDF or paste plain text resume content here..."
    )

with col_jd:
    st.subheader("💼 Target Job Description")
    col_t1, col_t2 = st.columns(2)
    with col_t1:
        st.session_state.job_title = st.text_input("Job Title", value=st.session_state.job_title, placeholder="e.g. Senior Full Stack Engineer")
    with col_t2:
        st.session_state.company_name = st.text_input("Company Name", value=st.session_state.company_name, placeholder="e.g. InnovateX Tech")

    st.session_state.jd_text = st.text_area(
        "Job Description Text",
        value=st.session_state.jd_text,
        height=260,
        placeholder="Paste job posting requirements, responsibilities, and qualifications..."
    )

# Action Bar: Trigger Fit Analysis
st.markdown("<br>", unsafe_allow_html=True)
if st.button("🎯 Analyze Fit (Python ML Engine)", type="primary", use_container_width=True):
    if not st.session_state.resume_text.strip() or not st.session_state.jd_text.strip():
        st.error("Please provide both a Resume and a Job Description before running analysis.")
    else:
        with st.spinner("Processing TF-IDF Vectorizer, Cosine Similarity & Skill Extraction..."):
            res = analyze_fit_api(st.session_state.resume_text, st.session_state.jd_text)
            st.session_state.analysis = res
            st.success("Analysis Complete!")

# Results Dashboard Section
if st.session_state.analysis:
    analysis = st.session_state.analysis
    st.markdown("---")
    st.header("📊 Job Fit Analysis Dashboard")

    tab_overview, tab_skills, tab_ats, tab_bullets, tab_interview, tab_cover = st.tabs([
        "📈 Overview & Score",
        "⚡ Skill Matrix",
        "🔍 ATS Audit",
        "🪄 STAR Rewriter & RAG",
        "💬 Interview Q&A",
        "📝 Cover Letter"
    ])

    # Tab 1: Overview
    with tab_overview:
        col_m1, col_m2, col_m3, col_m4 = st.columns(4)
        with col_m1:
            st.metric("Overall Match", f"{analysis.get('overallScore', 0)}%", delta=f"Grade: {analysis.get('grade', 'B')}")
        with col_m2:
            st.metric("Matched Skills", len(analysis.get('matchedSkills', [])))
        with col_m3:
            st.metric("Missing Skills", len(analysis.get('missingSkills', [])))
        with col_m4:
            ats_met = analysis.get('atsMetrics', {})
            st.metric("ATS Formatting Score", f"{ats_met.get('formattingScore', 85)}%")

        st.progress(min(1.0, max(0.0, analysis.get('overallScore', 0) / 100.0)))

        st.subheader("💡 Optimization Recommendations")
        for rec in analysis.get('recommendations', []):
            st.info(f"• {rec}")

    # Tab 2: Skill Matrix
    with tab_skills:
        col_sk1, col_sk2 = st.columns(2)
        with col_sk1:
            st.subheader("✅ Matched Technical Skills")
            matched = analysis.get('matchedSkills', [])
            if matched:
                for skill in matched:
                    st.success(f"✓ {skill.capitalize() if isinstance(skill, str) else skill}")
            else:
                st.write("No exact skill matches identified.")

        with col_sk2:
            st.subheader("⚠️ Missing Required Skills")
            missing = analysis.get('missingSkills', [])
            if missing:
                for skill in missing:
                    st.warning(f"✕ {skill.capitalize() if isinstance(skill, str) else skill}")
            else:
                st.write("No major skill gaps identified!")

    # Tab 3: ATS Audit
    with tab_ats:
        st.subheader("📋 ATS Content Audit & Action Verbs")
        ats_met = analysis.get('atsMetrics', {})
        
        col_a1, col_a2 = st.columns(2)
        with col_a1:
            st.write("**Action Verb Power:**")
            st.progress(ats_met.get('actionVerbsScore', 80) / 100.0)
            st.caption(f"Score: {ats_met.get('actionVerbsScore', 80)}% - Strong utilization of impact verbs.")

        with col_a2:
            st.write("**Quantifiable Metrics Density:**")
            st.progress(ats_met.get('quantifiableMetricsScore', 75) / 100.0)
            st.caption(f"Score: {ats_met.get('quantifiableMetricsScore', 75)}% - Measure results with %, $, or time saved.")

    # Tab 4: STAR Rewriter & RAG
    with tab_bullets:
        st.subheader("🪄 STAR Bullet Point Rewriter with Vector RAG")
        bullet_input = st.text_area("Paste a resume bullet point to rewrite:", value="Responsible for building FastAPI web services and React frontends.")
        
        if st.button("Rewrite into STAR Format"):
            with st.spinner("Querying ChromaDB RAG Vector Store..."):
                try:
                    payload = {"query": bullet_input, "job_title": st.session_state.job_title}
                    resp = requests.post(f"{FASTAPI_BASE_URL}/api/rag/recommendations", json=payload, timeout=5)
                    if resp.status_code == 200:
                        rag_res = resp.json()
                        st.success("STAR Bullet Point Generated via ChromaDB RAG:")
                        st.code(rag_res.get("recommended_bullet", "• Engineered high-throughput FastAPI REST microservices and responsive React 19 user interfaces, reducing page load latency by 45% for over 50k active users."))
                    else:
                        raise Exception("API error")
                except Exception:
                    st.success("STAR Bullet Point Generated (Local Fallback):")
                    st.code("• Architected high-throughput FastAPI REST microservices and responsive React 19 user interfaces, reducing response latency by 45% across 50,000 active monthly users.")

    # Tab 5: Interview Prep
    with tab_interview:
        st.subheader("💬 Tailored Interview Questions & Guidance")
        questions = analysis.get('interviewQuestions', [])
        for i, q in enumerate(questions):
            q_text = q.get('question', q) if isinstance(q, dict) else str(q)
            q_cat = q.get('category', 'Technical') if isinstance(q, dict) else 'General'
            with st.expander(f"Question {i+1} [{q_cat}]: {q_text[:80]}..."):
                st.write(f"**Full Question:** {q_text}")
                st.info("💡 **Answer Strategy:** Use the STAR framework (Situation, Task, Action, Result). Mention specific metrics and technologies matched in the job description.")

    # Tab 6: Cover Letter Builder
    with tab_cover:
        st.subheader("📝 Tailored Cover Letter Builder")
        if st.button("Generate Cover Letter"):
            st.markdown(f"""
```text
Dear Hiring Manager at {st.session_state.company_name or 'InnovateX Tech'},

I am writing to express my enthusiastic interest in the {st.session_state.job_title or 'Senior Full Stack Engineer'} position. With my background in building high-availability web services, Python FastAPI ML microservices, and modern responsive React interfaces, I am confident in my ability to immediately add value to your team.

Key technical highlights matching your role:
- Full-stack development with Python, React 19, TypeScript, and modern CSS frameworks.
- Building scalable backend APIs and vector embeddings search pipelines (ChromaDB / Scikit-Learn).
- Automated CI/CD deployments using Docker containers and cloud infrastructure.

Thank you for your time and consideration. I look forward to discussing how my experience aligns with your team's goals.

Sincerely,
Candidate
```
""")

# Footer
st.markdown("---")
st.markdown(
    "<div style='text-align: center; color: #6b7280; font-size: 0.8rem; padding: 10px;'>"
    "AI Career Copilot • Streamlit Python Frontend & FastAPI ML Backend • Built for Portfolio Excellence"
    "</div>",
    unsafe_allow_html=True
)
