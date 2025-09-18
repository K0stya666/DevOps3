const express = require('express');
const pool = require('../db');

const router = express.Router();

// ВАЖНО: search ДО :id
router.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM books WHERE title ILIKE $1 OR author ILIKE $1 OR isbn ILIKE $1 OR genre ILIKE $1',
      [`%${query}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Список книг
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM books ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Книга по id
router.get('/:id(\\d+)', async (req, res) => { // ограничим id только цифрами
  try {
    const { rows } = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Book not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Создать книгу
router.post('/', async (req, res) => {
  const { title, author, description, publicationDate, isbn, genre, availableCopies, totalCopies } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO books (title, author, description, publication_date, isbn, genre, available_copies, total_copies) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, author, description, publicationDate, isbn, genre, availableCopies, totalCopies]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Обновить книгу
router.put('/:id(\\d+)', async (req, res) => {
  const { title, author, description, publicationDate, isbn, genre, availableCopies, totalCopies } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE books SET title = $1, author = $2, description = $3, publication_date = $4, isbn = $5, genre = $6, available_copies = $7, total_copies = $8 WHERE id = $9 RETURNING *',
      [title, author, description, publicationDate, isbn, genre, availableCopies, totalCopies, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Book not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Удалить книгу
router.delete('/:id(\\d+)', async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
