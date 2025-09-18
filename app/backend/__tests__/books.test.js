let consoleErrSpy;
beforeAll(() => {
    consoleErrSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
    consoleErrSpy.mockRestore();
});


const request = require('supertest');
const express = require('express');
const cors = require('cors');

// ?????? pool ????? ???????? ?????????
jest.mock('../db', () => ({
    query: jest.fn()
}));

const pool = require('../db');
const bookRoutes = require('../routes/books');

// ???????? Express-??????????
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/books', bookRoutes);

describe('Book API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/books', () => {
        it('?????? ?????????? ??? ?????', async () => {
            const mockBooks = [
                { id: 1, title: '????? 1', author: '????? 1' },
                { id: 2, title: '????? 2', author: '????? 2' }
            ];

            pool.query.mockResolvedValue({ rows: mockBooks });

            const response = await request(app).get('/api/books');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockBooks);
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM books ORDER BY id DESC');
        });

        it('?????? ???????????? ?????? ??? ??????? ? ??', async () => {
            pool.query.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/api/books');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Server Error' });
        });
    });

    describe('GET /api/books/:id', () => {
        it('?????? ?????????? ????? ?? ID', async () => {
            const mockBook = { id: 1, title: '????? 1', author: '????? 1' };

            pool.query.mockResolvedValue({ rows: [mockBook] });

            const response = await request(app).get('/api/books/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockBook);
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM books WHERE id = $1', ['1']);
        });

        it('?????? ?????????? 404, ???? ????? ?? ???????', async () => {
            pool.query.mockResolvedValue({ rows: [] });

            const response = await request(app).get('/api/books/999');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Book not found' });
        });

        it('?????? ???????????? ?????? ??? ??????? ? ??', async () => {
            pool.query.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/api/books/1');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Server Error' });
        });
    });

    describe('POST /api/books', () => {
        it('?????? ????????? ????? ?????', async () => {
            const newBook = {
                title: '????? ?????',
                author: '????? ?????',
                description: '???????? ????? ?????',
                publicationDate: '2023-01-01',
                isbn: '1234567890123',
                genre: '??????????',
                availableCopies: 2,
                totalCopies: 5
            };

            const createdBook = { id: 1, ...newBook };

            pool.query.mockResolvedValue({ rows: [createdBook] });

            const response = await request(app).post('/api/books').send(newBook);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(createdBook);
            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO books (title, author, description, publication_date, isbn, genre, available_copies, total_copies) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
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

        it('?????? ???????????? ?????? ??? ???????? ?????', async () => {
            pool.query.mockRejectedValue(new Error('Database error'));

            const response = await request(app).post('/api/books').send({
                title: '????? ?????',
                author: '????? ?????'
            });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Server Error' });
        });
    });

    describe('PUT /api/books/:id', () => {
        it('?????? ????????? ???????????? ?????', async () => {
            const updatedBook = {
                title: '??????????? ?????',
                author: '??????????? ?????',
                description: '??????????? ????????',
                publicationDate: '2023-02-01',
                isbn: '1234567890123',
                genre: '?????',
                availableCopies: 3,
                totalCopies: 6
            };

            const savedBook = { id: 1, ...updatedBook };

            pool.query.mockResolvedValue({ rows: [savedBook] });

            const response = await request(app).put('/api/books/1').send(updatedBook);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(savedBook);
            expect(pool.query).toHaveBeenCalledWith(
                'UPDATE books SET title = $1, author = $2, description = $3, publication_date = $4, isbn = $5, genre = $6, available_copies = $7, total_copies = $8 WHERE id = $9 RETURNING *',
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

        it('?????? ?????????? 404, ???? ????? ??? ?????????? ?? ???????', async () => {
            pool.query.mockResolvedValue({ rows: [] });

            const response = await request(app).put('/api/books/999').send({
                title: '??????????? ?????',
                author: '??????????? ?????'
            });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Book not found' });
        });

        it('?????? ???????????? ?????? ??? ?????????? ?????', async () => {
            pool.query.mockRejectedValue(new Error('Database error'));

            const response = await request(app).put('/api/books/1').send({
                title: '??????????? ?????',
                author: '??????????? ?????'
            });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Server Error' });
        });
    });

    describe('DELETE /api/books/:id', () => {
        it('?????? ??????? ????? ?? ID', async () => {
            const deletedBook = { id: 1, title: '????????? ?????' };

            pool.query.mockResolvedValue({ rows: [deletedBook] });

            const response = await request(app).delete('/api/books/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Book deleted successfully' });
            expect(pool.query).toHaveBeenCalledWith('DELETE FROM books WHERE id = $1 RETURNING *', ['1']);
        });

        it('?????? ?????????? 404, ???? ????? ??? ???????? ?? ???????', async () => {
            pool.query.mockResolvedValue({ rows: [] });

            const response = await request(app).delete('/api/books/999');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Book not found' });
        });

        it('?????? ???????????? ?????? ??? ???????? ?????', async () => {
            pool.query.mockRejectedValue(new Error('Database error'));

            const response = await request(app).delete('/api/books/1');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Server Error' });
        });
    });
});

describe('GET /api/books/search', () => {
    it('200: ?????????? ????????? ????? ?? ?????? query', async () => {
        const { query } = require('../db');
        const found = [
            { id: 3, title: 'Node Patterns', author: 'Smith', isbn: '111', genre: 'IT' }
        ];
        query.mockResolvedValueOnce({ rows: found });

        const request = require('supertest');
        const express = require('express');
        const router = require('../routes/books');
        const app = express();
        app.use(express.json());
        app.use('/api/books', router);

        const res = await request(app).get('/api/books/search').query({ query: 'node' });
        expect(res.status).toBe(200);
        expect(res.body).toEqual(found);
        expect(query).toHaveBeenCalledWith(
            'SELECT * FROM books WHERE title ILIKE $1 OR author ILIKE $1 OR isbn ILIKE $1 OR genre ILIKE $1',
            ['%node%']
        );
    });

    it('500: ??? ?????? ??', async () => {
        const { query } = require('../db');
        query.mockRejectedValueOnce(new Error('db fail'));

        const request = require('supertest');
        const express = require('express');
        const router = require('../routes/books');
        const app = express();
        app.use(express.json());
        app.use('/api/books', router);

        const res = await request(app).get('/api/books/search').query({ query: 'x' });
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Server Error' });
    });
});
