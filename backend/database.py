#DB-Verbindung und Session-Config
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

#Bestimmen vom aktuellen Pfad zum Ordner und Unterordner Data
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

#data Ordner automatisch erstellen, wenn nicht existiert
DATA_DIR.mkdir(parents=True, exist_ok=True)

#Pfad zur DB Datei im Ordner Data
DB_PATH = DATA_DIR / "app.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"

#Tunnel zur Datenbank-Datei
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) #Erzeugung der Session für jeden Aufruf
Base = declarative_base() #Erstellt Mutterklasse für alle Tabellen, alle Tabellen erben später von Base, damit Alchemy weiß, dass sie zusammengehören

def get_db(): #Generatorfunktion, die eine Sitzung öffnet und sie über yield an die Funktion weitergibt und später wieder schließt
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()