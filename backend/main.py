from typing import List
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session

import models
import schemas
from database import engine, get_db

# Erstellt Tabellen, falls noch nicht existieren
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HabitTracker")


# ----    Dependencies   ----

def check_for_user(user_id: int, db: Session = Depends(get_db)) -> models.User:
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User does not exist")
    return user


def check_for_task(task_id: int, db: Session = Depends(get_db)) -> models.Task:
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task does not exist")
    return task


@app.get("/")
def root():
    return {"message": "Hello"}


# ----    Users    ----

# Alle User abrufen
@app.get("/users/", response_model=List[schemas.UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


# User per ID abrufen
@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_user(user: models.User = Depends(check_for_user)):
    return user


# User erstellen
@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


# User aktualisieren
@app.put("/users/{user_id}", response_model=schemas.UserResponse)
def update_user(
    user_data: schemas.UserCreate,
    db_user: models.User = Depends(check_for_user),
    db: Session = Depends(get_db)
):
    for field, value in user_data.model_dump().items():
        setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)
    return db_user


# User löschen
@app.delete("/users/{user_id}")
def delete_user(user: models.User = Depends(check_for_user), db: Session = Depends(get_db)):
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}


# ----    Tasks    ----

# Neue Task für einen bestimmten User erstellen
@app.post("/users/{user_id}/tasks/", response_model=schemas.TaskResponse)
def create_task(
    task: schemas.TaskCreate,
    user: models.User = Depends(check_for_user),
    db: Session = Depends(get_db)
):
    new_task = models.Task(**task.model_dump(), user_id=user.id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


# Alle Tasks eines bestimmten Users abrufen
@app.get("/users/{user_id}/tasks/", response_model=List[schemas.TaskResponse])
def get_all_tasks_for_user(user: models.User = Depends(check_for_user), db: Session = Depends(get_db)):
    return db.query(models.Task).filter(models.Task.user_id == user.id).all()


# Einzelne Task per task_id abrufen
@app.get("/tasks/{task_id}", response_model=schemas.TaskResponse)
def get_task(task: models.Task = Depends(check_for_task)):
    return task


# Task aktualisieren
@app.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(
    task_data: schemas.TaskCreate,
    db_task: models.Task = Depends(check_for_task),
    db: Session = Depends(get_db)
):
    for field, value in task_data.model_dump().items():
        setattr(db_task, field, value)

    db.commit()
    db.refresh(db_task)
    return db_task


# Einzelne Task löschen
@app.delete("/tasks/{task_id}")
def delete_task(task: models.Task = Depends(check_for_task), db: Session = Depends(get_db)):
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}
