FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/
COPY packages/core/package.json packages/core/
COPY packages/ficha-app/package.json packages/ficha-app/
COPY packages/tema/package.json packages/tema/
RUN pnpm install --frozen-lockfile --filter @calafrio/web...

COPY . .
RUN pnpm --filter @calafrio/web build

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

WORKDIR /app/apps/web
CMD ["pnpm", "start"]
