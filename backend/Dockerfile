FROM node:20-alpine

WORKDIR /app

# Install PostgreSQL client
RUN apk update && apk add postgresql-client

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install
RUN npm install -g sequelize-cli

COPY ./migrations /app/migrations

# Копируем все остальные файлы бэкенда
COPY . .


CMD sh -c 'sequelize db:migrate --url postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE} && npm start'
# CMD sh -c 'npm run printenv && sequelize db:migrate --url postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE} && npm start > /proc/1/fd/1 2>/proc/1/fd/2'
