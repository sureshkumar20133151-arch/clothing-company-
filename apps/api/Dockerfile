# ==============================================================================
# INDIGO & THREAD - PRODUCTION API DOCKERFILE
# Node.js + Express + TypeScript + Prisma ORM
# ==============================================================================

# --- Stage 1: Build & Dependencies ---
FROM node:20-alpine AS builder

WORKDIR /app

# Enable corepack and prepare pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy root workspace manifests
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

# Install all dependencies across the workspace
RUN pnpm install

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Build shared library first
RUN pnpm --filter @indigo/shared build

# Generate Prisma Client
RUN pnpm --filter @indigo/api db:generate

# Build API TypeScript to dist/
RUN pnpm --filter @indigo/api build

# Prune devDependencies for production runtime
RUN pnpm --filter @indigo/api --prod deploy pruned-api

# --- Stage 2: Production Runner ---
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Install OpenSSL for Prisma engine compatibility on Alpine
RUN apk add --no-cache openssl

# Create non-root system user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 indigouser

# Copy built application and pruned node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared/dist ./node_modules/@indigo/shared/dist
COPY --from=builder /app/packages/shared/package.json ./node_modules/@indigo/shared/package.json
COPY --from=builder /app/apps/api/package.json ./package.json

USER indigouser

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/v1/health || exit 1

CMD ["node", "dist/server.js"]
