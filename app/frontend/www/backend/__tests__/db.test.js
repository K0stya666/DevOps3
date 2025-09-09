// backend/__tests__/db.test.js
const { Pool } = require('pg');

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    on: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('Database Module', () => {
  beforeEach(() => {
    // ������������� �������� ���������� ���������
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '5432';
    process.env.DB_NAME = 'librarydb';
    process.env.DB_USER = 'libraryuser';
    process.env.DB_PASSWORD = 'password';
    
    // ������� ��� ��� ������ db
    jest.resetModules();
  });

  it('������ �������������� ������', () => {
    const pool = require('../db');
    expect(pool).toBeDefined();
  });
});