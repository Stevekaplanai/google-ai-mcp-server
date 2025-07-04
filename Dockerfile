FROM node:20

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json ./

# Install dependencies with verbose output
RUN npm ci --loglevel verbose || npm install --loglevel verbose

# Copy everything else
COPY . .

# Verify dist directory exists
RUN ls -la dist/

# Set environment
ENV USE_MOCK=true
ENV NODE_ENV=production

# Start the MCP server
CMD ["node", "dist/index.js"]
