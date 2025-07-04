FROM node:20-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install only production dependencies
RUN npm ci --only=production

# Set environment
ENV USE_MOCK=true

# Run the pre-built server
CMD ["node", "dist/index.js"]
