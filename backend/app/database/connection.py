
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.core.config import settings


# Create the database engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=settings.DEBUG,
)


# Create the database session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db():
    """
    Provide a database session to API endpoints.
    Close the session after the request finishes.
    """
    db: Session = SessionLocal()

    try:
        yield db
    finally:
        db.close()
