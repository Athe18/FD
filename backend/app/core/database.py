"""
Prabal Database Configuration (PostgreSQL / Supabase)
=====================================================
PostgreSQL is the single primary database of record for all Prabal entities,
incorporating spatial geometries and vector embeddings.
"""

from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from app.core.config import settings

# Primary PostgreSQL Engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Dependency injection for FastAPI database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
