const express = require('express');
const pool = require('../db');
const router = express.Router();

// ???????? ??? ?????
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM books');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ???????? ????? ?? ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ??????? ????? ?????
router.post('/', async (req, res) => {
  const { title, author, description, publicationDate, isbn, genre, availableCopies, totalCopies } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO books (title, author, description, publicationDate, isbn, genre, availableCopies, totalCopies) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, author, description, publicationDate, isbn, genre, availableCopies, totalCopies]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ???????? ?????
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, description, publicationDate, isbn, genre, availableCopies, totalCopies } = req.body;
  try {
const { rows } = await pool.query(
  'UPDATE books SET title = $1, author = $2, description = $3, publicationdate = $4, isbn = $5, genre = $6, availablecopies = $7, totalcopies = $8 WHERE id = $9 RETURNING *',
  [title, author, description, publicationDate || null, isbn, genre, availableCopies, totalCopies, id]
);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ??????? ?????
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
