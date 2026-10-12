#Beschreibung der richtigen Struktur der Tabellen
from sqlalchemy import Column, Integer, String
from database import Base

class User(Base): #erben von Base -> Klasse wird als Tabelle bei ALchemy hinterlegt
    __tablename__ = "users" #Name der Tabelle

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    role = Column(String, nullable=False)