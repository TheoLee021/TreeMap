from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from .. import models, schemas
from ..database import get_db
from ..websocket import manager
from geoalchemy2.functions import ST_AsGeoJSON, ST_DWithin, ST_MakePoint
from sqlalchemy import func
import json

router = APIRouter(
    prefix="/trees",
    tags=["trees"]
)

@router.get("/", response_model=List[schemas.Tree])
async def get_trees(
    skip: int = 0,
    limit: int = 100,
    species: Optional[str] = None,
    lat: Optional[float] = Query(None, ge=-90, le=90),
    lon: Optional[float] = Query(None, ge=-180, le=180),
    radius: Optional[float] = Query(None, gt=0),  # 미터 단위
    db: AsyncSession = Depends(get_db)
):
    query = select(models.Tree)
    
    if species:
        query = query.where(models.Tree.species.ilike(f"%{species}%"))
    
    if all(v is not None for v in [lat, lon, radius]):
        point = func.ST_SetSRID(func.ST_MakePoint(lon, lat), 4326)
        query = query.where(ST_DWithin(
            models.Tree.location,
            point,
            radius / 111320  # 미터를 대략적인 도 단위로 변환
        ))
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    trees = result.scalars().all()
    return trees

@router.post("/", response_model=schemas.Tree)
async def create_tree(tree: schemas.TreeCreate, db: AsyncSession = Depends(get_db)):
    # Create PostGIS POINT from latitude and longitude
    location = f"POINT({tree.longitude} {tree.latitude})"
    
    db_tree = models.Tree(
        species=tree.species,
        height=tree.height,
        diameter=tree.diameter,
        health_condition=tree.health_condition,
        planted_date=tree.planted_date,
        last_inspection=tree.last_inspection,
        notes=tree.notes,
        location=location
    )
    
    db.add(db_tree)
    await db.commit()
    await db.refresh(db_tree)
    
    # Notify WebSocket clients
    tree_data = {
        "id": db_tree.id,
        "species": db_tree.species,
        "location": json.loads(await db.scalar(select([ST_AsGeoJSON(db_tree.location)])))
    }
    await manager.broadcast(json.dumps({"type": "tree_added", "data": tree_data}))
    
    return db_tree

@router.get("/{tree_id}", response_model=schemas.Tree)
async def get_tree(tree_id: int, db: AsyncSession = Depends(get_db)):
    tree = await db.get(models.Tree, tree_id)
    if tree is None:
        raise HTTPException(status_code=404, detail="Tree not found")
    return tree

@router.put("/{tree_id}", response_model=schemas.Tree)
async def update_tree(
    tree_id: int,
    tree_update: schemas.TreeUpdate,
    db: AsyncSession = Depends(get_db)
):
    tree = await db.get(models.Tree, tree_id)
    if tree is None:
        raise HTTPException(status_code=404, detail="Tree not found")
    
    update_data = tree_update.dict(exclude_unset=True)
    
    if 'latitude' in update_data or 'longitude' in update_data:
        lat = update_data.pop('latitude', None) or tree.latitude
        lon = update_data.pop('longitude', None) or tree.longitude
        point = f"POINT({lon} {lat})"
        update_data['location'] = point
    
    for key, value in update_data.items():
        setattr(tree, key, value)
    
    await db.commit()
    await db.refresh(tree)
    
    # WebSocket을 통해 나무 업데이트 알림
    await manager.broadcast(
        json.dumps({"action": "update", "tree": schemas.Tree.from_orm(tree).dict()})
    )
    return tree

@router.delete("/{tree_id}")
async def delete_tree(tree_id: int, db: AsyncSession = Depends(get_db)):
    tree = await db.get(models.Tree, tree_id)
    if tree is None:
        raise HTTPException(status_code=404, detail="Tree not found")
    
    await db.delete(tree)
    await db.commit()
    
    # WebSocket을 통해 나무 삭제 알림
    await manager.broadcast(
        json.dumps({"action": "delete", "tree_id": tree_id})
    )
    return {"message": "Tree deleted successfully"}

@router.get("/stats/species", response_model=dict)
async def get_species_stats(db: AsyncSession = Depends(get_db)):
    stats = await db.execute(
        select(
            models.Tree.species,
            func.count(models.Tree.id).label('count')
        ).group_by(models.Tree.species)
    )
    
    return {species: count for species, count in stats.fetchall()} 