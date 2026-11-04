FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-workspace.yaml ./
COPY packages/tema/package.json ./packages/tema/
COPY packages/core/package.json ./packages/core/
COPY packages/ficha-app/package.json ./packages/ficha-app/
COPY apps/web/package.json ./apps/web/
RUN pnpm install --no-frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3001
COPY --from=builder /app ./
EXPOSE 3001
CMD ["pnpm", "--filter", "@calafrio/web", "start"]
