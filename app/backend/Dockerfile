FROM node:18-alpine

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Открываем порт
EXPOSE 8080

# Запускаем приложение
CMD ["npm", "start"]
