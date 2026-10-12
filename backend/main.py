from typing import List
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session

import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HabitTracker")

@app.get("/")
def root():
    return {"message": "Hello"}

#ausgabe user durch id
@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

#erstellung eines users
@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

#update User
@app.put("/users/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
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
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User doesnt exist")

    db.delete(db_user)
    db.commit()
    return {"message":"User deleted"}

#get all users
@app.get("/users/", response_model=List[schemas.UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    return db.query(models.User).all() 
        