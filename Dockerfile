FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --production

# Copy application code (including pre-built dist)
COPY . .

# Run the server
CMD ["node", "dist/index.js"]
