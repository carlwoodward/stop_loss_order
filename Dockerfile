FROM node:lts

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
ENV REDIS_URL=host.containers.internal:6379
ENV TEMPORAL_URL=host.containers.internal:7233
COPY . .
