from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional
from shapely.geometry import Point
import json

class GeoJSON(BaseModel):
    type: str
    coordinates: list

class TreeBase(BaseModel):
    species: str
    height: Optional[float]
    diameter: Optional[float]
    health_condition: Optional[str]
    planted_date: Optional[datetime]
    last_inspection: Optional[datetime]
    notes: Optional[str]
    latitude: float
    longitude: float

class TreeCreate(TreeBase):
    @validator('latitude')
    def validate_latitude(cls, v):
        if not -90 <= v <= 90:
            raise ValueError('Latitude must be between -90 and 90')
        return v

    @validator('longitude')
    def validate_longitude(cls, v):
        if not -180 <= v <= 180:
            raise ValueError('Longitude must be between -180 and 180')
        return v

class TreeUpdate(BaseModel):
    species: Optional[str]
    height: Optional[float]
    diameter: Optional[float]
    health_condition: Optional[str]
    last_inspection: Optional[datetime]
    notes: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]

class Tree(TreeBase):
    id: int
    created_at: datetime
    updated_at: datetime
    location: Optional[GeoJSON]

    class Config:
        orm_mode = True

    @validator('location', pre=True)
    def parse_location(cls, v):
        if isinstance(v, str):
            return {
                "type": "Point",
                "coordinates": [float(x.strip()) for x in v.replace("POINT(", "").replace(")", "").split()]
            }
        return v 