import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Database URL (SQLite for instant zero-config local dev, easily swappable to PostgreSQL)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./career_copilot.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """
    FastAPI dependency yielding a database session per request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
