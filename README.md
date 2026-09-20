# 🚀 AI Career Copilot — Smart Resume Analyzer & Job Matching System

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141.1-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8.svg)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**AI Career Copilot** is a production-grade, portfolio-ready AI system designed to analyze candidate resumes against job descriptions. Built with **React 19**, **FastAPI**, **Scikit-Learn**, **SentenceTransformers**, **ChromaDB Vector Store**, and **SQLAlchemy**, it provides real-time ATS match scoring, hybrid TF-IDF + Dense Vector embedding calculations, skill gap analysis, STAR bullet point rewriting, and targeted interview question generation.

---

## 📐 System Architecture

```
                    AI CAREER COPILOT ARCHITECTURE
                                 │
             ┌───────────────────┴───────────────────┐
             │                                       │
     Candidate Resume (PDF/Text)             Job Description
             │                                       │
             ▼                                       ▼
    Client-side pdfjs-dist                  Text Preprocessor
             │                                       │
             └───────────────────┬───────────────────┘
                                 │
                                 ▼
                     React 19 Frontend Dashboard
                     (Tailwind v4 / Recharts)
                                 │
                       HTTP POST /api/analyze
                                 │
                                 ▼
                    Python FastAPI ML Backend
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
  Sparse TF-IDF           Dense Vector            Categorized Skill
Cosine Similarity          Embeddings              Taxonomy Engine
(scikit-learn)       (SentenceTransformers)       (Regex & Pattern)
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
                                 ▼
                ChromaDB Vector Store & RAG Retrieval
                (Retrieves STAR Templates & Strategies)
                                 │
                                 ▼
                SQLAlchemy Database Persistence
                     (SQLite / PostgreSQL)
```

---

## ✨ Key Features

- 📄 **Privacy-First PDF Text Extraction**: Uses `pdfjs-dist` worker client-side to extract text without uploading candidate PDFs to external servers.
- 🧮 **Hybrid Matching Engine**:
  - **Sparse TF-IDF Cosine Similarity**: Calculates exact term importance match scores.
  - **Dense Vector Embeddings**: Computes 384-dimensional semantic similarity using `all-MiniLM-L6-v2` (`SentenceTransformers`) to catch contextual equivalence (e.g. "Cloud Infrastructure" $\leftrightarrow$ "AWS DevOps").
- 🎯 **Categorized Skill Matrix**: Categorizes skills into *Frontend*, *Backend*, *Databases*, *AI/ML*, *DevOps*, *Testing*, and *Soft Skills* with priority tags (`Critical` vs `Good to Have`).
- ⚡ **RAG & Vector Database**: Utilizes **ChromaDB** to index and retrieve STAR bullet templates matching candidate skill gaps.
- 📝 **STAR Bullet Rewriter**: Transforms weak resume bullet points into high-impact metric statements.
- ❓ **Tailored Interview Prep**: Generates role-specific technical, behavioral, and gap mitigation interview questions with model answer hints.
- 💾 **Data Persistence & History**: Persists candidate analysis runs using **SQLAlchemy ORM** accessible via `/api/history`.
- 🔐 **JWT Token Authentication**: Built-in Bearer JWT authentication endpoints (`/api/auth/token`).
- 🐳 **Dockerized Production Deployment**: Containerized frontend (Nginx) and backend (Uvicorn) with `docker-compose.yml`.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend UI** | React 19, Vite 6, Tailwind CSS v4, Lucide React, Recharts, Canvas-Confetti |
| **Backend API** | Python 3.12, FastAPI, Uvicorn, Pydantic v2, Pytest, HTTPX |
| **ML & NLP Engine** | Scikit-Learn (TF-IDF Vectorizer, Cosine Similarity), SentenceTransformers (`all-MiniLM-L6-v2`) |
| **Vector DB & RAG** | ChromaDB Persistent Vector Store |
| **Database ORM** | SQLAlchemy (SQLite for local dev, PostgreSQL ready) |
| **Authentication** | Bearer JWT (JSON Web Tokens) |
| **Containerization** | Docker, Docker Compose, Nginx Multi-stage builds |

---

## 🚀 Quickstart & Installation

### Option 1: Docker Compose (Recommended)

Run the full-stack containerized application with one command:

```bash
docker-compose up --build
```
- **React Frontend**: [http://localhost:5173](http://localhost:5173)
- **FastAPI Backend**: [http://localhost:8000](http://localhost:8000)

---

### Option 2: Local Development Setup

#### 1. Start FastAPI Backend

```bash
cd backend
python -m venv venv

# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

#### 2. Start React Frontend

In a separate terminal window:

```bash
# In project root directory
npm install
npm run dev
```
- **Frontend App**: [http://localhost:5173](http://localhost:5173)

---

## 📡 API Endpoints Specification

| Endpoint | Method | Description | Request Body |
| :--- | :---: | :--- | :--- |
| `/api/health` | `GET` | API Health Check | None |
| `/api/auth/token` | `POST` | Issue JWT Bearer Access Token | `{"username": "...", "password": "..."}` |
| `/api/analyze` | `POST` | Full ML, TF-IDF, Embedding & ATS Analysis | `{"resume_text": "...", "job_description": "..."}` |
| `/api/rag/recommendations` | `POST` | ChromaDB Vector Search for STAR templates | `{"missing_skills": ["aws", "docker"]}` |
| `/api/history` | `GET` | Retrieve candidate analysis history from DB | None |

---

## 🧮 Mathematical & Technical Deep-Dive

### 1. TF-IDF & Cosine Similarity
$$\text{TF-IDF}(t, d) = \text{TF}(t, d) \times \left(\log\frac{N}{\text{DF}(t)} + 1\right)$$

$$\text{Cosine Similarity}(\vec{v}_r, \vec{v}_j) = \frac{\vec{v}_r \cdot \vec{v}_j}{\|\vec{v}_r\| \|\vec{v}_j\|} = \frac{\sum_{i=1}^{n} v_{r,i} v_{j,i}}{\sqrt{\sum_{i=1}^{n} v_{r,i}^2} \sqrt{\sum_{i=1}^{n} v_{j,i}^2}}$$

### 2. Dense Vector Semantic Embeddings vs Sparse TF-IDF
While TF-IDF measures exact keyword overlap, **SentenceTransformers** projects sentences into a continuous 384-dimensional dense vector space where semantic distance represents conceptual similarity:
$$\text{Semantic Similarity} = \frac{\vec{e}_{\text{resume}} \cdot \vec{e}_{\text{jd}}}{\|\vec{e}_{\text{resume}}\| \|\vec{e}_{\text{jd}}\|}$$

---

## 🧪 Running Pytest Unit Tests

```bash
cd backend
.\venv\Scripts\python.exe -m pytest
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
