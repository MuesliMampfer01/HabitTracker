#Prüfen und Filtern von Daten, die über API reinkommen und an Client Rausgehen, also ob Zahlen Zahlen und Strings Strings sind etc
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


#----    User Schemas    ----

class UserCreate(BaseModel):
    name: str
    email: str
    role: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    #dafür da, dass Pydantic Daten aus Alchemy herauslesen kann, Alchemy gibt eig Objekte zurück, Pydantic erwartet aber eig Dictionaries
    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    email: str
    password: str


#----    Task Schemas   ----

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    is_completed: bool
    created_at: datetime
    user_id: int

    model_config = ConfigDict(from_attributes=True)


#----    Token Schemas    ----

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[int] = None
