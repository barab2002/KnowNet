# Use Node.js LTS (Alpine)
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the API
RUN npx nx build api

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["node", "dist/api/main.js"]
