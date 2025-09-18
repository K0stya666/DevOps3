import '@testing-library/jest-dom';
import axios from 'axios';
import BookService from '../BookService';

jest.mock('axios');

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
    console.error.mockRestore();
});
afterEach(() => {
    jest.clearAllMocks();
});

test('BookService.getAllBooks возвращает список книг и дергает /api/books', async () => {
    const data = [{ id: 1, title: 'A' }, { id: 2, title: 'B' }];
    axios.get.mockResolvedValueOnce({ data });

    const res = await BookService.getAllBooks();

    expect(axios.get).toHaveBeenCalledWith('/api/books');
    expect(res.data).toEqual(data);
});

test('BookService.searchBooks вызывает /api/books/search', async () => {
    const data = [{ id: 3, title: 'JS' }];
    axios.get.mockResolvedValueOnce({ data });

    const res = await BookService.searchBooks('js');

    expect(axios.get).toHaveBeenCalledWith('/api/books/search?query=js');
    expect(res.data).toEqual(data);
});
