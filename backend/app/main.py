from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import trees, auth
from . import models
from .database import engine
from .websocket import router as websocket_router

app = FastAPI()

# CORS 설정 업데이트
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 시작 시 데이터베이스 테이블 생성
@app.on_event("startup")
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)

# 라우터 추가
app.include_router(trees.router, prefix="/api/trees", tags=["trees"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(websocket_router)

@app.get("/")
async def root():
    return {"message": "Tree Map API"} 