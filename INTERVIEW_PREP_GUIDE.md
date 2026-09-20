# 🎯 AI Career Copilot — Interview Prep & System Design Guide

This guide equips you with exact technical answers, mathematical explanations, trade-off justifications, and system architecture talking points to present **AI Career Copilot** as a senior-level portfolio project during interviews.

---

## 🗣️ 1. The 60-Second Elevator Pitch

> *"AI Career Copilot is a full-stack AI platform I built to analyze candidate resumes against job descriptions, measure ATS compatibility, and generate targeted interview prep questions. On the frontend, I used **React 19**, **Tailwind CSS v4**, and **Recharts**. On the backend, I built a high-performance **FastAPI** service in Python 3.12 that combines **Sparse TF-IDF Cosine Similarity** with **Dense 384-dimensional Vector Embeddings** using `SentenceTransformers`. I also integrated a **ChromaDB Vector Store** for Retrieval-Augmented Generation (RAG) to dynamically fetch STAR bullet point templates matching candidate skill gaps, and persisted run history via **SQLAlchemy**. The whole stack is fully containerized using **Docker** and **Docker Compose**."*

---

## ❓ 2. Key Technical Questions & Model Answers

### Q1: Why did you combine Sparse TF-IDF and Dense Vector Embeddings?
**Answer**:
- **TF-IDF (Sparse Vector Representation)** excels at detecting exact technical keyword presence (e.g. `React 18`, `FastAPI`, `PostgreSQL`). However, TF-IDF fails when terms differ lexically even if they are semantically equivalent (e.g. "Cloud Infrastructure Specialist" vs "AWS DevOps Engineer").
- **Dense Vector Embeddings** (`all-MiniLM-L6-v2`) project text into a continuous 384-dimensional vector space where distance represents conceptual meaning.
- **Hybrid Approach**: We combine both vectors in a weighted scoring formula (30% Semantic Embeddings + 30% TF-IDF + 20% Skill Taxonomy Match + 20% ATS Content Audit). This gives us the precision of exact keyword matching alongside the conceptual intelligence of deep learning embeddings.

---

### Q2: How does the Retrieval-Augmented Generation (RAG) pipeline work?
**Answer**:
1. When a candidate's resume missing skills are identified during analysis, those skill terms are passed to the RAG retrieval pipeline.
2. The pipeline queries a persistent **ChromaDB Vector Store** populated with curated high-impact STAR bullet point templates and strategy hints.
3. ChromaDB performs vector similarity search, retrieving the top $K$ most relevant STAR bullet alternatives.
4. The retrieved context is formatted into recommendations presented to the candidate.

---

### Q3: How did you design the backend API architecture?
**Answer**:
- Used **FastAPI** for its asynchronous event loop, automatic OpenAPI/Swagger generation, and strict typing via **Pydantic v2**.
- Structured the codebase cleanly following clean architecture principles:
  - `app/api/routes/`: Route controllers (`health`, `analyze`, `rag`, `history`, `auth`).
  - `app/schemas/`: Pydantic request & response data contracts.
  - `app/services/ml/`: Decoupled ML modules (`tfidf.py`, `embeddings.py`, `skills.py`, `vector_store.py`).
  - `app/db/`: SQLAlchemy ORM models (`models.py`) and database session manager (`database.py`).
  - `app/core/`: Security and JWT Bearer token authentication (`auth.py`).

---

### Q4: How is data privacy handled for sensitive candidate resumes?
**Answer**:
- Candidate PDF parsing is performed **100% client-side** using a `pdfjs-dist` worker running directly in browser memory. PDF bytes never hit third-party servers.
- The Python API processes plain text tokens strictly for vector scoring and persistence, adhering to secure data handling best practices.

---

### Q5: How is the application containerized for production?
**Answer**:
- **Multi-Stage Docker Builds**:
  - Frontend: `node:22-alpine` compiles the production React bundle, which is copied into a minimal `nginx:alpine` image.
  - Backend: `python:3.12-slim` installs minimal C build dependencies and runs Uvicorn.
- **Docker Compose**: Orchestrates multi-container networking linking `copilot_backend` (port 8000) and `copilot_frontend` (port 5173 / port 80).

---

## 🧮 3. Technical & Mathematical Summary Sheet

| Concept | Mathematical / Engineering Formula | Purpose |
| :--- | :--- | :--- |
| **TF-IDF Weight** | $\text{TF-IDF}(t, d) = \text{TF}(t, d) \times (\log\frac{N}{\text{DF}(t)} + 1)$ | Measures word importance relative to corpus |
| **Cosine Similarity** | $\cos(\theta) = \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|}$ | Calculates vector angle (0.0 to 1.0) |
| **Dense Vector Embeddings** | $\vec{e} = \text{SentenceTransformer}(\text{text}) \in \mathbb{R}^{384}$ | Projects text into dense semantic vector space |
| **RAG Vector Search** | $\arg\max_{t \in V} \text{Sim}(\vec{e}_{\text{missing}}, \vec{e}_t)$ | Retrieves contextually relevant STAR templates |
| **Database ORM** | `SQLAlchemy Session (SessionLocal)` | Manages database transactions & records |
