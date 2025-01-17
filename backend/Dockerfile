FROM python:3.9

WORKDIR /app

# dos2unix 설치 추가
RUN apt-get update && \
    apt-get install -y dos2unix && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 전체 앱 코드를 먼저 복사
COPY . .

# Python 경로 설정 추가
ENV PYTHONPATH=/app

# 직접 실행 명령어 지정
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"] 