// backend/__tests__/books.test.js
const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Мокируем pool перед импортом маршрутов
jest.mock('../db', () => ({
  query: jest.fn()
}));

const pool = require('../db');
const bookRoutes = require('../routes/books');

// Создаем тестовое Express-приложение
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/books', bookRoutes);

describe('Book API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/books', () => {
    it('должен возвращать все книги', async () => {
      const mockBooks = [
        { id: 1, title: 'Книга 1', author: 'Автор 1' },
        { id: 2, title: 'Книга 2', author: 'Автор 2' }
      ];

      pool.query.mockResolvedValue({ rows: mockBooks });

      const response = await request(app).get('/api/books');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBooks);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM books');
    });

    it('должен обрабатывать ошибки при запросе к БД', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/books');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server Error');
    });
  });

  describe('GET /api/books/:id', () => {
    it('должен возвращать книгу по ID', async () => {
      const mockBook = { id: 1, title: 'Книга 1', author: 'Автор 1' };

      pool.query.mockResolvedValue({ rows: [mockBook] });

      const response = await request(app).get('/api/books/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBook);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM books WHERE id = $1', ['1']);
    });

    it('должен возвращать 404, если книга не найдена', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/api/books/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Book not found' });
    });

    it('должен обрабатывать ошибки при запросе к БД', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/books/1');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server Error');
    });
  });

  describe('POST /api/books', () => {
    it('должен создавать новую книгу', async () => {
      const newBook = {
        title: 'Новая книга',
        author: 'Новый автор',
        description: 'Описание новой книги',
        publicationDate: '2023-01-01',
        isbn: '1234567890123',
        genre: 'Фантастика',
        availableCopies: 2,
        totalCopies: 5
      };

      const createdBook = { id: 1, ...newBook };

      pool.query.mockResolvedValue({ rows: [createdBook] });

      const response = await request(app).post('/api/books').send(newBook);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdBook);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO books (title, author, description, publicationDate, isbn, genre, availableCopies, totalCopies) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [
          newBook.title,
          newBook.author,
          newBook.description,
          newBook.publicationDate,
          newBook.isbn,
          newBook.genre,
          newBook.availableCopies,
          newBook.totalCopies
        ]
      );
    });

    it('должен обрабатывать ошибки при создании книги', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/api/books').send({
        title: 'Новая книга',
        author: 'Новый автор'
      });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server Error');
    });
  });

  describe('PUT /api/books/:id', () => {
    it('должен обновлять существующую книгу', async () => {
      const updatedBook = {
        title: 'Обновленная книга',
        author: 'Обновленный автор',
        description: 'Обновленное описание',
        publicationDate: '2023-02-01',
        isbn: '1234567890123',
        genre: 'Роман',
        availableCopies: 3,
        totalCopies: 6
      };

      const savedBook = { id: 1, ...updatedBook };

      pool.query.mockResolvedValue({ rows: [savedBook] });

      const response = await request(app).put('/api/books/1').send(updatedBook);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(savedBook);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE books SET title = $1, author = $2, description = $3, publicationDate = $4, isbn = $5, genre = $6, availableCopies = $7, totalCopies = $8 WHERE id = $9 RETURNING *',
        [
          updatedBook.title,
          updatedBook.author,
          updatedBook.description,
          updatedBook.publicationDate,
          updatedBook.isbn,
          updatedBook.genre,
          updatedBook.availableCopies,
          updatedBook.totalCopies,
          '1'
        ]
      );
    });

    it('должен возвращать 404, если книга для обновления не найдена', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).put('/api/books/999').send({
        title: 'Обновленная книга',
        author: 'Обновленный автор'
      });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Book not found' });
    });

    it('должен обрабатывать ошибки при обновлении книги', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).put('/api/books/1').send({
        title: 'Обновленная книга',
        author: 'Обновленный автор'
      });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server Error');
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('должен удалять книгу по ID', async () => {
      const deletedBook = { id: 1, title: 'Удаленная книга' };

      pool.query.mockResolvedValue({ rows: [deletedBook] });

      const response = await request(app).delete('/api/books/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Book deleted successfully' });
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM books WHERE id = $1 RETURNING *', ['1']);
    });

    it('должен возвращать 404, если книга для удаления не найдена', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).delete('/api/books/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Book not found' });
    });

    it('должен обрабатывать ошибки при удалении книги', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/books/1');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server Error');
    });
  });
});