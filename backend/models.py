#Beschreibung der richtigen Struktur der Tabellen
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class User(Base): #erben von Base -> Klasse wird als Tabelle bei ALchemy hinterlegt
    __tablename__ = "users" #Name der Tabelle

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    role = Column(String, nullable=False)

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) # pylint: disable=not-callable
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
