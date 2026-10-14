from typing import Annotated, List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

import models
import schemas
import security
from database import engine
from dependencies import CurrentUserDep, DbDep

# Erstellt Tabellen, falls noch nicht existieren
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HabitTracker")


@app.get("/")
def root():
    return {"message": "Hello"}


@app.post("/login")
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: DbDep
):

    user = db.query(models.User).filter(models.User.email == form_data.username).first()

    if not user or not security.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-Mail or Password is wrong",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token = security.create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token-type": "bearer"}


# ----    Users    ----


# User registrieren
@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: DbDep):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pwd = security.hash_password(user.password)

    user_data = user.model_dump()
    user_data.pop("password")

    new_user = models.User(**user_data, password=hashed_pwd)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# Aktuell angemeldenten User abrufen
@app.get("/users/me", response_model=schemas.UserResponse)
def get_current_user_profile(current_user: CurrentUserDep):
    return current_user


# Alle User abrufen
@app.get("/users/", response_model=List[schemas.UserResponse])
def get_all_users(db: DbDep):
    return db.query(models.User).all()



# ----    Tasks    ----


# Neue Task für aktuell eingeloggten User erstellen
@app.post("/tasks/", response_model=schemas.TaskResponse)
def create_task(
    task: schemas.TaskCreate,
    user: CurrentUserDep,
    db: DbDep
):
    new_task = models.Task(**task.model_dump(), user_id=user.id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


# Alle Tasks des eingeloggten Users abrufen
@app.get("/tasks/", response_model=List[schemas.TaskResponse])
def get_all_tasks(user: CurrentUserDep, db: DbDep):
    return db.query(models.Task).filter(models.Task.user_id == user.id).all()


# Einzelne Task löschen
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, user: CurrentUserDep, db: DbDep):
    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.user_id == user.id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}
