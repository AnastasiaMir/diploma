FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN chown -R node:node /app/node_modules

RUN rm -rf /app/node_modules/.vite

USER node

EXPOSE 5173

CMD ["npm", "run", "dev"]