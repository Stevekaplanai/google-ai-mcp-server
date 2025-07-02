FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source files
COPY . .

# Build the TypeScript project
RUN npm run build

# Set environment variables defaults
ENV USE_MOCK=true
ENV GOOGLE_CLOUD_LOCATION=us-central1

# Run the server
CMD ["node", "dist/index.js"]
