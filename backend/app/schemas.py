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
    species: str
    height: Optional[float] = None
    diameter: Optional[float] = None
    health_condition: str
    planted_date: Optional[datetime] = None
    last_inspection: Optional[datetime] = None
    notes: Optional[str] = None

class TreeCreate(TreeBase):
    latitude: float
    longitude: float

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
    location: str
    created_at: datetime
    updated_at: datetime

    @validator("location", pre=True)
    def parse_location(cls, v):
        if hasattr(v, "desc"):
            point = to_shape(v)
            return f"POINT({point.x} {point.y})"
        return v

    @classmethod
    def from_orm(cls, obj):
        # Convert PostGIS geometry to GeoJSON
        if hasattr(obj, 'location') and obj.location is not None:
            shape = to_shape(obj.location)
            obj.location = json.dumps(mapping(shape))
        return super().from_orm(obj)

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        } 