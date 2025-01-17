from geoalchemy2 import Geometry
from sqlalchemy import Column, Integer, String, DateTime, Float, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Tree(Base):
    __tablename__ = "trees"

    id = Column(Integer, primary_key=True, index=True)
    species = Column(String(100), nullable=False)
    height = Column(Float)
    diameter = Column(Float)
    health_condition = Column(String(50))
    planted_date = Column(DateTime, default=datetime.utcnow)
    last_inspection = Column(DateTime)
    notes = Column(Text)
    location = Column(Geometry('POINT', srid=4326))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 