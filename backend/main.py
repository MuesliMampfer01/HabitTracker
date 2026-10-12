from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

from pydantic import BaseModel, ConfigDict
from typing import Optional, List

app = FastAPI(title="HabitTracker")

#grundlegende verbindung zur sql datenbank, gebunden an users.db datei
#check_same_thread macht es möglich, dass verscheidenen Threads gleichzeitig dieselbe Datenbankverbindung nutzen können
engine = create_engine("sqlite:///users.db", connect_args={"check_same_thread": False})

#Erzeugt Fabrikklasse für Sitzungen zur Datenbank, immer wenn Code mit DB sprechen muss wird eine Instanz SessionLocal erstellt
#autocommit=false sagt an, dass Änderungen erst mit dem db.commit() fest gespeichert werden
#autoflush=false verhindert, dass ungespeicherte Änderungen automatisch vor jeder Abfrage in die Datenbank gespeichert werden
#bind=engine: Verknüpft die Sessions mit der erstellten Datenbank engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
#Base erstellt eine Basisklasse für ORM (Object-Relational Mapping), alle Tabellen erben später von diesem Objekt
Base = declarative_base()

#Erstellung der Tabelle, durch das Erben von Base weiß SQLAlchemy, dass die Klasse als Tabelle verwaltet werden soll
class User(Base):
    __tablename__ ="users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    role = Column(String, nullable=False)


Base.metadata.create_all(engine)

class UserCreate(BaseModel):
    name:str
    email:str
    role:str

class UserResponse(BaseModel):
    id:int
    name:str
    email:str
    role:str

    class Config:
        model_config = ConfigDict(from_attributes=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
   
@app.get("/")
def root():
    return {"message": "Hello"}

#ausgabe user durch id
@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

#erstellung eines users
@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

#update User
@app.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User doesnt exist")
    for field, value in user.model_dump().items():
        setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)
    return db_user


#delete user
@app.delete("/users/{user_id}")
def delete_user(user_id:int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User doesnt exist")

    db.delete(db_user)
    db.commit()
    return {"message":"User deleted"}

#get all users
@app.get("/users/", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    return db.query(User).all() 
        