FROM node:20-alpine

WORKDIR /app

# Install PostgreSQL client
RUN apk update && apk add postgresql-client

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

COPY ./migrations /app/migrations

# Копируем все остальные файлы бэкенда
COPY . .

# Запускаем миграции перед запуском бэкенда
CMD sh -c "npx sequelize-cli db:migrate --url postgresql://postgres:1234@db:5432/db && npm start"