import os
import tempfile
import json
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Handle serverless read-only filesystem (Vercel / AWS Lambda)
if os.environ.get("VERCEL") or not os.access(".", os.W_OK):
    db_path = os.path.join(tempfile.gettempdir(), "triage_audit.db")
    DATABASE_URL = f"sqlite:///{db_path}"
else:
    DATABASE_URL = "sqlite:///./triage_audit.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    symptoms = Column(Text, nullable=False)       # JSON serialized list of symptoms
    predictions = Column(Text, nullable=False)    # JSON serialized predictions list
    urgency = Column(String(50), nullable=False)   # "Emergency", "Consult GP", "Self Care"

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    triage_id = Column(Integer, nullable=True)
    rating = Column(Integer, nullable=False)       # 1 to 5 stars
    comments = Column(Text, nullable=True)

def init_db():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Warning initializing DB schema: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
