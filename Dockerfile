# Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Build API
RUN npx nx build api

# Production Stage
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV production

# Copy built assets and package files from the build output
# Nx generates a package.json (and optional lockfile) in dist/api
COPY --from=builder /app/dist/api ./

# Install only production dependencies for the specific app
RUN npm ci --omit=dev

# Expose port
EXPOSE 3000

# Start
CMD ["node", "main.js"]
