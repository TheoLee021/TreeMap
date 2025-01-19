from pydantic import BaseModel, validator, Field
from datetime import datetime
from typing import Optional
from shapely.geometry import Point, mapping
import json
from geoalchemy2.shape import to_shape

class GeoJSON(BaseModel):
    type: str
    coordinates: list

class TreeBase(BaseModel):
    tag_number: Optional[str] = None
    common_name: Optional[str] = None
    species: str
    height: Optional[float] = None
    diameter: Optional[float] = None
    crown_height: Optional[float] = None
    crown_spread: Optional[float] = None
    contributors: Optional[str] = None
    last_inspection: Optional[datetime] = None
    health_condition: str
    last_pruned: Optional[datetime] = None
    notes: Optional[str] = None

class TreeCreate(TreeBase):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

class TreeUpdate(BaseModel):
    species: Optional[str]
    height: Optional[float]
    diameter: Optional[float]
    health_condition: Optional[str]
    last_inspection: Optional[datetime]
    notes: Optional[str]
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