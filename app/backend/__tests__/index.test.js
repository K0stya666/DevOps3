const request = require('supertest');
const express = require('express');

// �������� ����������� ����� ��������
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

// ����� ����������� ������������ ����������� server
const server = require('../index');

describe('Server Setup', () => {
  it('������ �������� dotenv.config()', () => {
    expect(require('dotenv').config).toHaveBeenCalled();
  });

  it('������ ��������� express-����������', () => {
    expect(express).toHaveBeenCalled();
  });

  it('������ ������������ cors middleware', () => {
    const app = express();
    expect(app.use).toHaveBeenCalledWith('cors-middleware');
  });

  it('������ ������������ express.json middleware', () => {
    const app = express();
    expect(app.use).toHaveBeenCalledWith('json-middleware');
  });

  it('������ �������������� �������� ��� ����', () => {
    const app = express();
    expect(app.use).toHaveBeenCalledWith('/api/books', 'book-routes');
  });

  it('������ ��������� ������ �� ��������� �����', () => {
    const app = express();
    process.env.PORT = '8080';
    expect(app.listen).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
  });
});