FROM node:20

WORKDIR /app

COPY . .

RUN npm install

CMD ["node", "dist/index.js"]
