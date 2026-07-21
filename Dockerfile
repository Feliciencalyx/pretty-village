# Step 1: Base image
FROM node:22-alpine AS base
WORKDIR /app

# Step 2: Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm install

# Step 3: Build application for production runtime
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx vite build && npx nitro build

# Step 4: Production runner stage
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy output build artifact from builder stage
COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
