import axios from 'axios';
import BookService from '../BookService';

// Мокируем axios
jest.mock('axios');

describe('BookService', () => {
  const mockBook = {
    title: 'Война и мир',
    author: 'Лев Толстой',
    description: 'Великий роман-эпопея',
    publicationDate: '1869-01-01',
    isbn: '9785171147426',
    genre: 'Роман',
    availableCopies: 3,
    totalCopies: 5
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBooks', () => {
    it('должен возвращать все книги', async () => {
      const books = [mockBook, {...mockBook, id: 2, title: 'Анна Каренина'}];
      axios.get.mockResolvedValue({ data: books });

      const response = await BookService.getAllBooks();

      expect(axios.get).toHaveBeenCalledWith('http://89.208.104.134:8080/api/books');
      expect(response.data).toEqual(books);
    });

    it('должен обрабатывать ошибки', async () => {
      const error = new Error('Сетевая ошибка');
      axios.get.mockRejectedValue(error);

      await expect(BookService.getAllBooks()).rejects.toThrow(error);
    });
  });

  describe('getBookById', () => {
    it('должен возвращать книгу по ID', async () => {
      const book = {...mockBook, id: 1};
      axios.get.mockResolvedValue({ data: book });

      const response = await BookService.getBookById(1);

      expect(axios.get).toHaveBeenCalledWith('http://89.208.104.134:8080/api/books/1');
      expect(response.data).toEqual(book);
    });
  });

  describe('createBook', () => {
    it('должен создавать новую книгу', async () => {
      const newBook = {...mockBook, id: 1};
      axios.post.mockResolvedValue({ data: newBook });

      const response = await BookService.createBook(mockBook);

      expect(axios.post).toHaveBeenCalledWith('http://89.208.104.134:8080/api/books', mockBook);
      expect(response.data).toEqual(newBook);
    });
  });

  describe('updateBook', () => {
    it('должен обновлять существующую книгу', async () => {
      const updatedBook = {...mockBook, id: 1, title: 'Обновленное название'};
      axios.put.mockResolvedValue({ data: updatedBook });

      const response = await BookService.updateBook(1, updatedBook);

      expect(axios.put).toHaveBeenCalledWith('http://89.208.104.134:8080/api/books/1', updatedBook);
      expect(response.data).toEqual(updatedBook);
    });
  });

  describe('deleteBook', () => {
    it('должен удалять книгу', async () => {
      const successResponse = { message: 'Книга удалена успешно' };
      axios.delete.mockResolvedValue({ data: successResponse });

      const response = await BookService.deleteBook(1);

      expect(axios.delete).toHaveBeenCalledWith('http://89.208.104.134:8080/api/books/1');
      expect(response.data).toEqual(successResponse);
    });
  });

  describe('searchBooks', () => {
    it('должен искать книги по запросу', async () => {
      const books = [mockBook];
      axios.get.mockResolvedValue({ data: books });

      const response = await BookService.searchBooks('Война');

      expect(axios.get).toHaveBeenCalledWith('http://89.208.104.134:8080/api/books/search?query=Война');
      expect(response.data).toEqual(books);
    });
  });
});