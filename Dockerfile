# Use Node.js 20 slim image
FROM node:20-slim

# Install build essentials for native dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install ALL dependencies (including dev dependencies for building)
RUN npm ci

# Copy source files
COPY src/ ./src/

# Build the TypeScript project
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Set environment variables defaults
ENV USE_MOCK=false
ENV GOOGLE_CLOUD_LOCATION=us-central1
ENV NODE_ENV=production

# Expose the stdio interface
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('healthy')" || exit 1

# Make the entrypoint executable
RUN chmod +x dist/index.js

# Run the server
ENTRYPOINT ["node", "dist/index.js"]