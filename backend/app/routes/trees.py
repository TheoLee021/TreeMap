from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, Integer
from typing import List, Optional
from .. import models, schemas
from ..database import get_db
from ..websocket import manager
import json
import math

router = APIRouter(
    tags=["trees"]
)

@router.get("/", response_model=List[schemas.Tree])
async def get_trees(
    skip: int = 0,
    limit: int = 100,
    botanical_name: Optional[str] = None,
    lat: Optional[float] = Query(None, ge=-90, le=90),
    lon: Optional[float] = Query(None, ge=-180, le=180),
    radius: Optional[float] = Query(None, gt=0),  # 미터 단위
    sort_by: Optional[str] = Query(None, description="정렬할 필드"),
    order: Optional[str] = Query("asc", description="정렬 순서 (asc 또는 desc)"),
    db: AsyncSession = Depends(get_db)
):
    query = select(models.Tree)
    
    if botanical_name:
        query = query.where(models.Tree.botanical_name.ilike(f"%{botanical_name}%"))
    
    if all(v is not None for v in [lat, lon, radius]):
        # 위도/경도 기반 거리 계산 (Haversine formula)
        radius_degrees = radius / 111320  # 미터를 대략적인 도 단위로 변환
        query = query.where(
            func.sqrt(
                func.pow(models.Tree.latitude - lat, 2) +
                func.pow(models.Tree.longitude - lon, 2)
            ) <= radius_degrees
        )
    
    # 정렬 적용
    if sort_by:
        column = getattr(models.Tree, sort_by, None)
        if column is not None:
            query = query.order_by(column.desc() if order == "desc" else column.asc())
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    trees = result.scalars().all()
    return trees

@router.post("/", response_model=schemas.Tree)
async def create_tree(tree: schemas.TreeCreate, db: AsyncSession = Depends(get_db)):
    db_tree = models.Tree(
        tag_number=tree.tag_number,
        common_name=tree.common_name,
        botanical_name=tree.botanical_name,
        latitude=tree.latitude,
        longitude=tree.longitude,
        height=tree.height,
        diameter=tree.diameter,
        crown_height=tree.crown_height,
        crown_spread=tree.crown_spread,
        last_update=tree.last_update,
        contributors=tree.contributors,
        notes=tree.notes,
        last_inspection=tree.last_inspection,
        health=tree.health,
        expert_notes=tree.expert_notes
    )
    db.add(db_tree)
    await db.commit()
    await db.refresh(db_tree)
    
    # Notify connected clients
    await manager.broadcast(json.dumps({
        "type": "tree_created",
        "data": {
            "id": db_tree.id,
            "latitude": db_tree.latitude,
            "longitude": db_tree.longitude
        }
    }))
    
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
            models.Tree.botanical_name,
            func.count(models.Tree.id).label('count')
        ).group_by(models.Tree.botanical_name)
    )
    
    return {species: count for species, count in stats.fetchall()} 