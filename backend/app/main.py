from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.api.routes import health, analyze, rag, history, auth_route

# Create SQL database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Career Copilot API",
    description="Production-grade Backend ML, Vector Search, RAG, Auth & Persistence Service",
    version="1.0.0"
)

# Configure CORS middleware for local & Docker frontend communication
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:80",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(auth_route.router, prefix="/api", tags=["Authentication"])
app.include_router(analyze.router, prefix="/api", tags=["Analysis"])
app.include_router(rag.router, prefix="/api", tags=["RAG & Vector Search"])
app.include_router(history.router, prefix="/api", tags=["Database History"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
