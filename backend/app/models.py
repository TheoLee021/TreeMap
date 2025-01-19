from geoalchemy2 import Geometry
from sqlalchemy import Column, Integer, String, DateTime, Float, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Tree(Base):
    __tablename__ = "trees"

    id = Column(Integer, primary_key=True, index=True)
    tag_number = Column(Integer, nullable=False)
    common_name = Column(String(100))
    botanical_name = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    height = Column(Float)
    diameter = Column(Float)
    crown_height = Column(Float)
    crown_spread = Column(Float)
    last_update = Column(DateTime)
    contributors = Column(String(200))
    notes = Column(Text)
    last_inspection = Column(DateTime)
    health = Column(String(50))
    expert_notes = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 