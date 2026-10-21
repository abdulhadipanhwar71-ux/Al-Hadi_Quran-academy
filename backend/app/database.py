import os
from pathlib import Path
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from .config import settings
import logging

logger = logging.getLogger("alhadi.database")

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
SQLITE_DB_PATH = ROOT_DIR / "database" / "alhadi_academy.db"

def get_engine():
    db_url = settings.database_url
    if db_url.startswith("sqlite"):
        return create_engine(db_url, connect_args={"check_same_thread": False})

    try:
        eng = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_recycle=3600,
            pool_size=10,
            max_overflow=20,
        )
        with eng.connect() as conn:
            conn.execute(text("SELECT 1"))
        return eng
    except Exception as e:
        logger.warning(f"MySQL unavailable ({e}). Using bundled SQLite database at {SQLITE_DB_PATH}.")
        sqlite_url = f"sqlite:///{SQLITE_DB_PATH}" if SQLITE_DB_PATH.exists() else "sqlite:///./alhadi_academy.db"
        return create_engine(
            sqlite_url,
            connect_args={"check_same_thread": False}
        )

engine = get_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
