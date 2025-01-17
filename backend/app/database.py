from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# 비동기 데이터베이스 URL (asyncpg 사용)
ASYNC_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://treeuser:treepassword@db:5432/treemap"
).replace('postgresql://', 'postgresql+asyncpg://')

# 비동기 엔진 생성
engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=True,  # SQL 로깅 활성화
    pool_pre_ping=True,  # 연결 상태 확인
    pool_size=5,  # 커넥션 풀 크기
    max_overflow=10  # 최대 초과 커넥션
)

# 비동기 세션 생성
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

Base = declarative_base()

# 비동기 데이터베이스 의존성
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close() 