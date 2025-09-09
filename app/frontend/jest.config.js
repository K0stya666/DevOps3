module.exports = {
  testEnvironment: 'jsdom', // Используем окружение для браузера
  setupFilesAfterEnv: ['@testing-library/jest-dom'], // Подключаем jest-dom
  testMatch: ['**/__tests__/**/*.test.js'], // Ищем тесты в папке __tests__
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/' // Игнорируем всё, кроме axios
  ]
};
