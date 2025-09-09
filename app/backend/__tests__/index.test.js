const request = require('supertest');
const express = require('express');

// ћокируем зависимости перед импортом
jest.mock('express', () => {
  const expressApp = {
    use: jest.fn(),
    listen: jest.fn()
  };
  const express = jest.fn(() => expressApp);
  express.json = jest.fn(() => 'json-middleware');
  return express;
});

jest.mock('cors', () => jest.fn(() => 'cors-middleware'));
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

jest.mock('./routes/books', () => 'book-routes');
jest.mock('./db', () => ({}));

// ѕосле мокировани€ зависимостей импортируем server
const server = require('../index');

describe('Server Setup', () => {
  it('должен вызывать dotenv.config()', () => {
    expect(require('dotenv').config).toHaveBeenCalled();
  });

  it('должен создавать express-приложение', () => {
    expect(express).toHaveBeenCalled();
  });

  it('должен использовать cors middleware', () => {
    const app = express();
    expect(app.use).toHaveBeenCalledWith('cors-middleware');
  });

  it('должен использовать express.json middleware', () => {
    const app = express();
    expect(app.use).toHaveBeenCalledWith('json-middleware');
  });

  it('должен регистрировать маршруты дл€ книг', () => {
    const app = express();
    expect(app.use).toHaveBeenCalledWith('/api/books', 'book-routes');
  });

  it('должен запускать сервер на указанном порту', () => {
    const app = express();
    process.env.PORT = '8080';
    expect(app.listen).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
  });
});