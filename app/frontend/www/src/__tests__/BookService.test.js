import axios from 'axios';
import BookService from '../BookService';

// �������� axios
jest.mock('axios');

describe('BookService', () => {
  const mockBook = {
    title: '����� � ���',
    author: '��� �������',
    description: '������� �����-������',
    publicationDate: '1869-01-01',
    isbn: '9785171147426',
    genre: '�����',
    availableCopies: 3,
    totalCopies: 5
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBooks', () => {
    it('������ ���������� ��� �����', async () => {
      const books = [mockBook, {...mockBook, id: 2, title: '���� ��������'}];
      axios.get.mockResolvedValue({ data: books });

      const response = await BookService.getAllBooks();

      expect(axios.get).toHaveBeenCalledWith('http://89.208.104.134:8080/api/books');
      expect(response.data).toEqual(books);
    });

    it('������ ������������ ������', async () => {
      const error = new Error('������� ������');
      axios.get.mockRejectedValue(error);

      await expect(BookService.getAllBooks()).rejects.toThrow(error);
    });
  });

  describe('getBookById', () => {
    it('������ ���������� ����� �� ID', async () => {
      const book = {...mockBook, id: 1};
      axios.get.mockResolvedValue({ data: book });

      const response = await BookService.getBookById(1);

      expect(axios.get).toHaveBeenCalledWith('http://89.208.104.134:8080/api/books/1');
      expect(response.data).toEqual(book);
    });
  });

  describe('createBook', () => {
    it('������ ��������� ����� �����', async () => {
      const newBook = {...mockBook, id: 1};
      axios.post.mockResolvedValue({ data: newBook });

      const response = await BookService.createBook(mockBook);

      expect(axios.post).toHaveBeenCalledWith('http://89.208.104.134:8080/api/books', mockBook);
      expect(response.data).toEqual(newBook);
    });
  });

  describe('updateBook', () => {
    it('������ ��������� ������������ �����', async () => {
      const updatedBook = {...mockBook, id: 1, title: '����������� ��������'};
      axios.put.mockResolvedValue({ data: updatedBook });

      const response = await BookService.updateBook(1, updatedBook);

      expect(axios.put).toHaveBeenCalledWith('http://89.208.104.134:8080/api/books/1', updatedBook);
      expect(response.data).toEqual(updatedBook);
    });
  });

  describe('deleteBook', () => {
    it('������ ������� �����', async () => {
      const successResponse = { message: '����� ������� �������' };
      axios.delete.mockResolvedValue({ data: successResponse });

      const response = await BookService.deleteBook(1);

      expect(axios.delete).toHaveBeenCalledWith('http://89.208.104.134:8080/api/books/1');
      expect(response.data).toEqual(successResponse);
    });
  });

  describe('searchBooks', () => {
    it('������ ������ ����� �� �������', async () => {
      const books = [mockBook];
      axios.get.mockResolvedValue({ data: books });

      const response = await BookService.searchBooks('�����');

      expect(axios.get).toHaveBeenCalledWith('http://89.208.104.134:8080/api/books/search?query=�����');
      expect(response.data).toEqual(books);
    });
  });
});