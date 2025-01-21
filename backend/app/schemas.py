from pydantic import BaseModel, validator, Field, EmailStr
from datetime import datetime
from typing import Optional
from shapely.geometry import Point, mapping
import json
from geoalchemy2.shape import to_shape
from enum import Enum
from .models import UserRole

class GeoJSON(BaseModel):
    type: str
    coordinates: list

class TreeBase(BaseModel):
    tag_number: Optional[int] = None
    common_name: Optional[str] = None
    botanical_name: str
    height: Optional[float] = None
    diameter: Optional[float] = None
    crown_height: Optional[float] = None
    crown_spread: Optional[float] = None
    last_update: Optional[datetime] = None
    contributors: Optional[str] = None
    notes: Optional[str] = None
    last_inspection: Optional[datetime] = None
    health: Optional[str] = None
    expert_notes: Optional[str] = None

class TreeCreate(TreeBase):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

class TreeUpdate(BaseModel):
    botanical_name: Optional[str] = None
    height: Optional[float] = None
    diameter: Optional[float] = None
    crown_height: Optional[float] = None
    crown_spread: Optional[float] = None
    last_update: Optional[datetime] = None
    contributors: Optional[str] = None
    notes: Optional[str] = None
    last_inspection: Optional[datetime] = None
    health: Optional[str] = None
    expert_notes: Optional[str] = None
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)

class Tree(TreeBase):
    id: int
    latitude: float
    longitude: float
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    USER = "user"

class UserBase(BaseModel):
    email: EmailStr
    role: Optional[UserRole] = UserRole.USER
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 