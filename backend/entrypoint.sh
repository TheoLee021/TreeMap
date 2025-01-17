#!/bin/sh

# 데이터베이스 마이그레이션 실행
alembic upgrade head

# FastAPI 애플리케이션 실행
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload 