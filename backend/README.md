# AI Career Copilot — Python ML Backend

FastAPI service powering the ML and NLP pipeline for AI Career Copilot.

## 🚀 Setup & Installation

### 1. Create Virtual Environment
```bash
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Development Server
```bash
uvicorn app.main:app --reload --port 8000
```
The API server will run at: `http://localhost:8000`  
Swagger Documentation: `http://localhost:8000/docs`

### 4. Run Pytest Suite
```bash
pytest
```

## Endpoints

- `GET /api/health`: Health check endpoint returning API service status.
