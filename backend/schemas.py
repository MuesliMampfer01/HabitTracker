#Prüfen und Filtern von Daten, die über API reinkommen und an Client Rausgehen, also ob Zahlen Zahlen und Strings Strings sind etc
from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


#----    Weekday Enum    ----

class Weekday(str, Enum):
    MON = "MON"
    TUE = "TUE"
    WED = "WED"
    THU = "THU"
    FRI = "FRI"
    SAT = "SAT"
    SUN = "SUN"


#----    User Schemas    ----

class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    model_config = ConfigDict(from_attributes=True)


class UserLogin(BaseModel):
    email: str
    password: str


#----    Task Schemas    ----

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False
    is_recurring: bool = False
    scheduled_days: list[Weekday] = Field(default_factory=list)


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    is_recurring: Optional[bool] = None
    scheduled_days: Optional[list[Weekday]] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    is_completed: bool
    is_recurring: bool
    scheduled_days: list[Weekday] = Field(default_factory=list)
    created_at: datetime
    user_id: int

    model_config = ConfigDict(from_attributes=True)


#----    Token Schemas    ----

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None
