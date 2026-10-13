#Prüfen und Filtern von Daten, die über API reinkommen und an Client Rausgehen, also ob Zahlen Zahlen und Strings Strings sind etc
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: str
    role: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    #dafür da, dass Pydantic Daten aus Alchemy herauslesen kann, Alchemy gibt eig Objekte zurück, Pydantic erwartet aber eig Dictionaries
    model_config = ConfigDict(from_attributes=True)

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
