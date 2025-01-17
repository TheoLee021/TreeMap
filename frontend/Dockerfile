FROM node:20-slim

WORKDIR /app

# 필요한 시스템 패키지 설치
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libc6 \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install -g next && \
    npm install

# public 폴더와 그 내용물을 복사
COPY public ./public
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"] 