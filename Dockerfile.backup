FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install --production
CMD ["node", "dist/index.js"]
